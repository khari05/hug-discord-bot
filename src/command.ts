import { ApplicationCommand, ApplicationCommandOption, Client, CommandInteraction, Message } from 'discord.js'
import { actionMap } from './commands/actions.js'
import { disableChannelCommand } from './commands/disableChannel.js'
import { enableChannelCommand } from './commands/enableChannel.js'
import { helpCommand } from './commands/help.js'
import { inviteCommand } from './commands/invite.js'

const commandMatcher: RegExp = /^.([a-z]+)\s*?.*/

export interface Command {
  name: string
  description: string
  options: ApplicationCommandOption[]
  cmd: (cmd: string, msg: Message | CommandInteraction, client: Client) => Promise<void>
}

export async function matchCommand (msg: Message, client: Client): Promise<void> {
  const match: RegExpMatchArray | null = msg.content.match(commandMatcher)
  if (match !== null) {
    const command = commandMap.get(match[1])?.cmd
    if (command !== undefined) {
      await command(match[1], msg, client)
    } else {
      await msg.channel.send('Unknown command.').catch((e: Error) => console.error(e.stack))
    }
  }
}

export async function matchSlashCommand (action: CommandInteraction, client: Client): Promise<void> {
  const command = commandMap.get(action.commandName)?.cmd
  if (command !== undefined) {
    await command(action.commandName, action, client)
  }
}

export const commandMap: Map<string, Command> = new Map()

export async function setCommands (client: Client): Promise<void> {
  if (commandMap.size === 0) {
    commandMap.set('help', helpCommand)
    commandMap.set('disablechannel', disableChannelCommand)
    commandMap.set('enablechannel', enableChannelCommand)
    commandMap.set('invite', inviteCommand)
    actionMap.forEach((a, n) => commandMap.set(n, a.command))
  }
  const promises: Array<Promise<ApplicationCommand> | undefined> = []
  if (client.application?.commands.cache.size === 0) {
    commandMap.forEach((c, n) => {
      promises.push(
        client.application?.commands.create({
          name: c.name,
          description: c.description,
          options: c.options
        })
      )
    })
    await Promise.all(promises)
  }
}
