import { Client, Message } from 'discord.js'
import { Command } from '../command.js'

export const inviteCommand: Command = {
  name: 'invite',
  description: 'Get the invite link for the bot',
  cmd: invite
}

async function invite (cmd: string, msg: Message, client: Client): Promise<void> {
  await msg.channel.send(`https://discord.com/api/oauth2/authorize?client_id=${client.user?.id ?? ''}&permissions=51200&scope=bot`)
}
