import { CommandInteraction, GuildMember, Message } from 'discord.js'
import { Command } from '../command'
import { disabled, removeChannel } from '../disabled'
import { sendMessage } from '../send'

export const enableChannelCommand: Command = {
  name: 'enablechannel',
  description: 'Enable gifs in this channel',
  options: [],
  cmd: enableChannel
}

async function enableChannel (cmd: string, msg: Message | CommandInteraction): Promise<void> {
  if (msg.member instanceof GuildMember && (msg.member?.permissions.has('MANAGE_CHANNELS') ?? false)) {
    if (disabled.includes(msg.channel?.id ?? '')) {
      removeChannel(msg.channel?.id ?? '')
      await sendMessage(msg, 'This channel is now enabled', true)
    } else {
      await sendMessage(msg, 'This channel is already enabled', true)
    }
  } else {
    await sendMessage(msg, 'You don\'t have permission to run that command.', true)
  }
}
