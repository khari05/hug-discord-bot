import { Client, Intents, Interaction, Message } from 'discord.js'
import { matchCommand, matchSlashCommand, setCommands } from './command.js'
import { fillLinks } from './commands/actions.js'

const client: Client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] })

const token: string | undefined = process.env.TOKEN
export const prefix: string = process.env.PREFIX ?? '!'
const commandRegex: RegExp = new RegExp(`^\\${prefix}.*`)

client.on('ready', () => {
  console.log(`successfully logged in as ${client?.user?.tag ?? 'error'}`)
  client.user?.setPresence({ activities: [{ name: `${client.guilds.cache.size} guilds | ${prefix}help`, type: 'WATCHING' }] })
  setCommands(client)
    .catch((e: Error) => console.error(e.stack))
  fillLinks()
    .catch((e: Error) => console.error(e.stack))
})

client.on('guildCreate', (guild) => {
  client.user?.setPresence({ activities: [{ name: `${client.guilds.cache.size} guilds | ${prefix}help`, type: 'WATCHING' }] })
})

client.on('guildDelete', (guild) => {
  client.user?.setPresence({ activities: [{ name: `${client.guilds.cache.size} guilds | ${prefix}help`, type: 'WATCHING' }] })
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
