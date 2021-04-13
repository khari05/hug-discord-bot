import { Message, MessageEmbed, User } from 'discord.js'
import { Command, commandMap } from '../command.js'
import { prefix } from '../index.js'
import { isChannelDisabled } from '../disabled.js'

export const helpCommand: Command = {
  name: 'help',
  description: 'Shows the help menu',
  cmd: help
}

function helpMenuEmbed (author: User): MessageEmbed {
  const embed = new MessageEmbed({
    title: 'HugBot Help',
    color: '#FF80AB',
    footer: {
      text: `Requested by ${author.tag}`,
      icon_url: author.avatarURL() ?? undefined
    },
    timestamp: new Date()
  })

  for (const e of commandMap) {
    embed.addField(`${prefix}${e[1].name}`, e[1].description, true)
  }

  return embed
}

async function help (cmd: string, msg: Message): Promise<void> {
  if (isChannelDisabled(msg.channel.id)) {
    await msg.channel.send('Sorry, that command is disabled in this channel.')
  } else {
    await msg.channel.send(helpMenuEmbed(msg.author))
  }
}
