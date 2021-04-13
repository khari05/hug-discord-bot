import { Message } from 'discord.js'
import { Command } from '../command.js'
import { isChannelDisabled, removeChannel } from '../disabled.js'

export const enableChannelCommand: Command = {
  name: 'enablechannel',
  description: 'Enable gifs in this channel',
  cmd: enableChannel
}

async function enableChannel (cmd: string, msg: Message): Promise<void> {
  if (msg.member?.hasPermission('MANAGE_CHANNELS') ?? false) {
    if (isChannelDisabled(msg.channel.id)) {
      removeChannel(msg.channel.id)
      await msg.channel.send('This channel is now enabled')
    } else {
      await msg.channel.send('This channel is already enabled')
    }
  } else {
    await msg.channel.send('You don\'t have permission to run that command.')
  }
}
