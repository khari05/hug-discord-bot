import { DMChannel, Message, NewsChannel, TextChannel } from 'discord.js'
import axios, { AxiosResponse } from 'axios'
import { Command } from '../command.js'
import { disabled } from '../disabled.js'

const tenorApiKey: string | undefined = process.env.TENOR_KEY

const instance = axios.create({
  baseURL: 'https://g.tenor.com/v1',
  timeout: 10000,
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
  dualUser
}

export const actionMap: Map<string, Action> = new Map([
  ['hug', {
    command: { name: 'hug', description: 'Hug another user', cmd: action },
    type: ActionType.dualUser,
    phrase: (a, b) => `***${a} hugs ${b}***`,
    searchTerm: 'hug anime',
    links: []
  }],
  ['kiss', {
    command: { name: 'kiss', description: 'Kiss another user', cmd: action },
    type: ActionType.dualUser,
    phrase: (a, b) => `***${a} kisses ${b}***`,
    searchTerm: 'kiss anime',
    links: []
  }],
  ['headpat', {
    command: { name: 'headpat', description: 'Pat another user', cmd: action },
    type: ActionType.dualUser,
    phrase: (a, b) => `***${a} pats ${b}***`,
    searchTerm: 'head pat anime',
    links: []
  }],
  ['cuddle', {
    command: { name: 'cuddle', description: 'Cuddle with another user', cmd: action },
    type: ActionType.dualUser,
    phrase: (a, b) => `***${a} cuddles ${b}***`,
    searchTerm: 'snuggle anime',
    links: []
  }],
  ['holdhands', {
    command: { name: 'holdhands', description: 'Hold hands with another user', cmd: action },
    type: ActionType.dualUser,
    phrase: (a, b) => `***${a} holds hands with ${b}***`,
    searchTerm: 'holding hands anime',
    links: []
  }],
  ['cry', {
    command: { name: 'cry', description: 'Cry', cmd: action },
    type: ActionType.singleUser,
    phrase: (a, b) => `***${a} cries***`,
    searchTerm: 'cry anime',
    links: []
  }]
])

async function action (cmd: string, msg: Message): Promise<void> {
  const action = actionMap.get(cmd)

  if (disabled.includes(msg.channel.id)) {
    await msg.channel.send('Sorry, that command is disabled in this channel.')
  } else {
    if (action !== undefined && action.links.length !== 0) {
      let person2: string = ''

      if (action.type === ActionType.dualUser) {
        const mention = msg.content.match(/^.\w+\s<@!?(\d+)>/)
        if (mention !== null && mention.length === 2) {
          if (msg.author.id !== mention[1]) {
            person2 = `<@${mention[1]}>`
          } else {
            person2 = 'themself'
          }
        } else if (msg.mentions.users.size === 1) {
          person2 = `<@${msg.mentions.users.first()?.id ?? ''}>`
        } else if (msg.content.match(/^.\w+\s(@everyone|@here)/) !== undefined) {
          person2 = 'the entire server'
        }
      }

      if (person2.length !== 0 || action.type === ActionType.singleUser) {
        await sendGif(
          action.phrase(`<@${msg.author.id}>`, person2),
          msg.channel,
          action.links[Math.floor(Math.random() * (action.links.length - 1))]
        )
      }
    }
  }
}

async function sendGif (msg: string, channel: TextChannel | DMChannel | NewsChannel, link: string): Promise<void> {
  await channel.send({
    content: msg,
    files: [{
      attachment: link,
      name: 'tenor.gif'
    }]
  })
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
