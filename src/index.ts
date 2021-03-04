import { Client, Message } from 'discord.js'
import { matchCommand, setCommands } from './command.js'
import { fillLinkMap } from './commands/actions.js'

const client: Client = new Client()

const token: string | undefined = process.env.TOKEN
export const prefix: string = '!'
const commandRegex: RegExp = new RegExp(`^${prefix}.*`)

client.on('ready', () => {
  console.log(`successfully logged in as ${client?.user?.tag ?? 'error'}`)
  setCommands()
  fillLinkMap()
})

client.on('message', (msg: Message) => {
  if (msg.content.search(commandRegex) !== -1) {
    matchCommand(msg).catch((e: Error) => console.error(e.stack))
  }
})

client.login(token).catch((e: Error) => console.error(e.stack))
