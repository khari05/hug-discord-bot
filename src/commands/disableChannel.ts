import { CommandInteraction, GuildMember, Message } from 'discord.js'
import { Command } from '../command.js'
import { addChannel, disabled } from '../disabled.js'
import { sendMessage } from '../send.js'

export const disableChannelCommand: Command = {
  name: 'disablechannel',
  description: 'Disable gifs in this channel',
  options: [],
  cmd: disableChannel
}

async function disableChannel (cmd: string, msg: Message | CommandInteraction): Promise<void> {
  if (msg.member instanceof GuildMember && (msg.member?.permissions.has('MANAGE_CHANNELS') ?? false)) {
    if (disabled.includes(msg.channel?.id ?? '')) {
      await sendMessage(msg, 'This channel is already disabled', true)
    } else {
      addChannel(msg.channel?.id ?? '')
      await sendMessage(msg, 'This channel is now disabled', true)
    }
  } else {
    await sendMessage(msg, 'You don\'t have permission to run that command.', true)
  }
}
