import { Client, Message } from 'discord.js'
import { matchCommand, setCommands } from './command.js'
import { fillLinks } from './commands/actions/gifs.js'
import { updatePresence } from './presence.js'

const client: Client = new Client()

const token: string | undefined = process.env.TOKEN
export const prefix: string = '!'
const commandRegex: RegExp = new RegExp(`^${prefix}.*`)

client.on('ready', () => {
  console.log(`successfully logged in as ${client?.user?.tag ?? 'error'}`)
  updatePresence(client)
    .catch((e: Error) => console.error(e.stack))
  setCommands()
  fillLinks()
    .catch((e: Error) => console.error(e.stack))
})

client.on('guildCreate', (guild) => {
  updatePresence(client)
    .catch((e: Error) => console.error(e.stack))
})

client.on('guildDelete', (guild) => {
  updatePresence(client)
    .catch((e: Error) => console.error(e.stack))
})

client.on('message', (msg: Message) => {
  if (msg.content.search(commandRegex) !== -1) {
    matchCommand(msg, client).catch((e: Error) => console.error(e.stack))
  }
})

client.login(token).catch((e: Error) => console.error(e.stack))
