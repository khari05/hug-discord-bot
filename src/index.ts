import { Client, Interaction, Message } from 'discord.js'
import { matchCommand, matchSlashCommand, setCommands } from './command.js'
import { fillLinks } from './commands/actions.js'
import { updatePresence } from './presence.js'

const client: Client = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES'] })

const token: string | undefined = process.env.TOKEN
export const prefix: string = process.env.PREFIX ?? '!'
const commandRegex: RegExp = new RegExp(`^\\${prefix}.*`)

client.on('ready', () => {
  console.log(`successfully logged in as ${client?.user?.tag ?? ''}`)
  updatePresence(client, prefix)
  setCommands(client)
    .catch((e: Error) => console.error(e.stack))
  fillLinks()
    .catch((e: Error) => console.error(e.stack))
})

client.on('guildCreate', (guild) => {
  updatePresence(client, prefix)
})

client.on('guildDelete', (guild) => {
  updatePresence(client, prefix)
})

client.on('messageCreate', (msg: Message) => {
  if (msg.content.search(commandRegex) !== -1) {
    matchCommand(msg, client).catch((e: Error) => console.error(e.stack))
  }
})

client.on('interaction', (interaction: Interaction) => {
  if (interaction.isCommand()) {
    matchSlashCommand(interaction, client).catch((e: Error) => console.error(e.stack))
  }
})

client.login(token).catch((e: Error) => console.error(e.stack))
