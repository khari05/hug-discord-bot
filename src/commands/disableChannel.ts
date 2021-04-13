import { Message } from 'discord.js'
import { Command } from '../command.js'
import { addChannel, isChannelDisabled } from '../disabled.js'

export const disableChannelCommand: Command = {
  name: 'disablechannel',
  description: 'Disable gifs in this channel',
  cmd: disableChannel
}

async function disableChannel (cmd: string, msg: Message): Promise<void> {
  if (msg.member?.hasPermission('MANAGE_CHANNELS') ?? false) {
    if (isChannelDisabled(msg.channel.id)) {
      await msg.channel.send('This channel is already disabled')
    } else {
      addChannel(msg.channel.id)
      await msg.channel.send('This channel is now disabled')
    }
  } else {
    await msg.channel.send('You don\'t have permission to run that command.')
  }
}
