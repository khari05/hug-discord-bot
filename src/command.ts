import { Message } from 'discord.js'
import { actionMap } from './commands/actions.js'
import { disableChannelCommand } from './commands/disableChannel.js'
import { enableChannelCommand } from './commands/enableChannel.js'
import { helpCommand } from './commands/help.js'

const commandMatcher: RegExp = /^.([a-z]*)\s*?.*/

export interface Command {
  name: string
  description: string
  cmd: (cmd: string, msg: Message) => Promise<void>
}

export async function matchCommand (msg: Message): Promise<void> {
  const match: RegExpMatchArray | null = msg.content.match(commandMatcher)
  if (match !== null) {
    const command = commandMap.get(match[1])?.cmd
    if (command !== undefined) {
      await command(match[1], msg)
    } else {
      console.log(match)
      await msg.channel.send('Unknown command.').catch((e: Error) => console.error(e.stack))
    }
  }
}

export const commandMap: Map<string, Command> = new Map()

export function setCommands (): void {
  if (commandMap.size === 0) {
    commandMap.set('help', helpCommand)
    commandMap.set('disablechannel', disableChannelCommand)
    commandMap.set('enablechannel', enableChannelCommand)
    for (const e of actionMap) {
      commandMap.set(e[0], e[1])
    }
  }
}