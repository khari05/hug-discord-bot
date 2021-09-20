import { CommandInteraction, DMChannel, Message, MessageEmbed, User } from 'discord.js'
import { Command, commandMap } from '../command.js'
import { prefix } from '../index.js'
import { disabled } from '../disabled.js'
import { sendMessage } from '../send.js'

export const helpCommand: Command = {
  name: 'help',
  description: 'Shows the help menu',
  options: [],
  cmd: help
}

function helpMenuEmbed (author: User | null): MessageEmbed {
  const embed = new MessageEmbed({
    title: 'HugBot Help',
    color: '#FF80AB',
    footer: {
      text: `Requested by ${author?.tag ?? ''}`,
      icon_url: author?.avatarURL() ?? undefined
    },
    timestamp: new Date()
  })

  for (const e of commandMap) {
    embed.addField(`${prefix}${e[1].name}`, e[1].description, true)
  }

  return embed
}

async function help (cmd: string, msg: Message | CommandInteraction): Promise<void> {
  if (disabled.includes(msg instanceof Message ? msg.channel.id : msg.channelId) && !(msg.channel instanceof DMChannel)) {
    await sendMessage(msg, 'Sorry, that command is disabled in this channel.', true)
  } else {
    await sendMessage(msg, helpMenuEmbed(msg instanceof CommandInteraction ? msg.user : msg.author), true)
  }
}
