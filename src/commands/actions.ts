import { ApplicationCommandOptionData, CommandInteraction, Message } from 'discord.js'
import axios, { AxiosResponse } from 'axios'
import { Command } from '../command'
import { disabled } from '../disabled'
import { sendGif, sendMessage } from '../send'

const tenorApiKey: string | undefined = process.env.TENOR_KEY

const instance = axios.create({
  baseURL: 'https://g.tenor.com/v1',
  timeout: 1000,
  params: {
    key: tenorApiKey
  }
})

interface Action {
  command: Command
  type: ActionType
  phrase: (a: string, b: string) => string
  searchTerm: string
  links: string[]
}

enum ActionType {
  singleUser,
  multiUser
}

const actionOptions: ApplicationCommandOptionData[] = [{ name: 'user', description: 'The other person for your action', required: true, type: 'USER' }]

export const actionMap: Map<string, Action> = new Map([
  ['hug', {
    command: { name: 'hug', description: 'Hug another user', options: actionOptions, cmd: action },
    type: ActionType.multiUser,
    phrase: (a, b) => `***${a} hugs ${b}***`,
    searchTerm: 'hug anime',
    links: []
  }],
  ['kiss', {
    command: { name: 'kiss', description: 'Kiss another user', options: actionOptions, cmd: action },
    type: ActionType.multiUser,
    phrase: (a, b) => `***${a} kisses ${b}***`,
    searchTerm: 'kiss anime',
    links: []
  }],
  ['headpat', {
    command: { name: 'headpat', description: 'Pat another user', options: actionOptions, cmd: action },
    type: ActionType.multiUser,
    phrase: (a, b) => `***${a} pats ${b}***`,
    searchTerm: 'head pat anime',
    links: []
  }],
  ['cuddle', {
    command: { name: 'cuddle', description: 'Cuddle with another user', options: actionOptions, cmd: action },
    type: ActionType.multiUser,
    phrase: (a, b) => `***${a} cuddles ${b}***`,
    searchTerm: 'snuggle anime',
    links: []
  }],
  ['holdhands', {
    command: { name: 'holdhands', description: 'Hold hands with another user', options: actionOptions, cmd: action },
    type: ActionType.multiUser,
    phrase: (a, b) => `***${a} holds hands with ${b}***`,
    searchTerm: 'holding hands anime',
    links: []
  }],
  ['cry', {
    command: { name: 'cry', description: 'Cry', options: [], cmd: action },
    type: ActionType.singleUser,
    phrase: (a, b) => `***${a} cries***`,
    searchTerm: 'cry anime',
    links: []
  }]
])

async function action (cmd: string, msg: Message | CommandInteraction): Promise<void> {
  const action = actionMap.get(cmd)

  if (disabled.includes(msg.channel?.id ?? '')) {
    await sendMessage(msg, 'Sorry, that command is disabled in this channel.', true)
  } else {
    if (action !== undefined && action.links.length !== 0) {
      let person2: string = 'themself'

      if (action.type === ActionType.multiUser) {
        if (msg instanceof Message) {
          const mention = msg.content.match(/<@!?\d+>+?/g)

          // one or more users are mentioned
          if (mention !== null) {
            const mentionIds: string[] = mention.map((a: string) => {
              const match = a.match(/\d+/)
              return match !== null ? match[0] : ''
            })

            if (mention.length === 1 && msg.author.id !== mentionIds[0]) {
              person2 = `<@${mentionIds[0]}>`
            } else if (mention.length === 2) {
              person2 = `<@${mentionIds[0]}> and <@${mentionIds[1]}>`
            } else if (mention.length > 2) {
              person2 = 'multiple people'
            }

          // the message is replying to another message with mention set to true
          } else if (msg.mentions.users.size === 1) {
            person2 = `<@${msg.mentions.users.first()?.id ?? ''}>`

          // the message mentions the server instead of a person
          } else if (msg.content.match(/^.\w+\s(@everyone|@here)/) !== null) {
            person2 = 'the entire server'
          }

        // the message is a slash command
        } else {
          person2 = `<@${msg.options.data[0].user?.id ?? ''}>`
        }
      }

      await sendGif(
        action.phrase(`<@${msg instanceof CommandInteraction ? msg.user.id : msg.author.id}>`, person2),
        msg,
        action.links[Math.floor(Math.random() * (action.links.length - 1))]
      )
    }
  }
}

export async function fillLinks (): Promise<void> {
  const promises: Array<Promise<void>> = []
  actionMap.forEach((a, n) => {
    if (a.links.length === 0) {
      promises.push(
        instance.get('/search', {
          params: {
            q: a.searchTerm,
            limit: 20
          }
        }).then((response) => mapLinks(n, a, response, actionMap))
      )
    }
  })
  await Promise.all(promises)
}

function mapLinks (n: string, a: Action, response: AxiosResponse<any>, map: Map<string, Action>): void {
  map.set(n, {
    ...a,
    links: response.data.results.map((a: any) => a.media[0].mediumgif.url)
  })
}
