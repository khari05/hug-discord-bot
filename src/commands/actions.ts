import { Message } from 'discord.js'
import axios from 'axios'
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

export const actionMap: Map<string, Command> = new Map([
  ['hug', { name: 'hug', description: 'Hug another user', cmd: action }],
  ['kiss', { name: 'kiss', description: 'Kiss another user', cmd: action }],
  ['headpat', { name: 'headpat', description: 'Pat another user', cmd: action }],
  ['cuddle', { name: 'cuddle', description: 'Cuddle with another user', cmd: action }],
  ['holdhands', { name: 'holdhands', description: 'Hold hands with another user', cmd: action }]
])

async function action (cmd: string, msg: Message): Promise<void> {
  const phrase = wordMap.get(cmd)
  const links = linkMap.get(cmd)

  if (disabled.includes(msg.channel.id)) {
    await msg.channel.send('Sorry, that command is disabled in this channel.')
  } else {
    if (msg.mentions.users.size === 1 && phrase !== undefined && links !== undefined) {
      await msg.channel.send({
        content: phrase(`<@${msg.author.id}>`, `<@${msg.mentions.users.first()?.id ?? ''}>`),
        files: [{
          attachment: links[Math.floor(Math.random() * links.length - 1)],
          name: 'tenor.gif'
        }]
      })
    }
  }
}

const wordMap: Map<string, (a: string, b: string) => string> = new Map([
  ['hug', (a, b) => `${a} ***hugs*** ${b}`],
  ['kiss', (a, b) => `${a} ***kisses*** ${b}`],
  ['headpat', (a, b) => `${a} ***pats*** ${b}`],
  ['cuddle', (a, b) => `${a} ***cuddles*** ${b}`],
  ['holdhands', (a, b) => `${a} ***holds hands with*** ${b}`]
])

const linkMap: Map<string, string[]> = new Map()

export function fillLinkMap (): void {
  if (linkMap.size === 0) {
    searchTermMap.forEach((q, e) => {
      instance.get('/search', {
        params: {
          q: q,
          limit: 15
        }
      })
        .then((response) => linkMap.set(e, response.data.results.map((a: any) => a.media[0].mediumgif.url)))
        .catch((e: Error) => console.error(e.stack))
    })
  }
}

const searchTermMap: Map<string, string> = new Map([
  ['hug', 'hug anime'],
  ['kiss', 'kiss anime'],
  ['headpat', 'head pat anime'],
  ['cuddle', 'snuggle anime'],
  ['holdhands', 'holding hands anime']
])
