import { Client, CommandInteraction, Message } from 'discord.js'
import { Command } from '../command.js'
import { sendMessage } from '../send.js'

export const inviteCommand: Command = {
  name: 'invite',
  description: 'Get the invite link for the bot',
  options: [],
  cmd: invite
}

async function invite (cmd: string, msg: Message | CommandInteraction, client: Client): Promise<void> {
  await sendMessage(msg, `https://discord.com/api/oauth2/authorize?client_id=${client.user?.id ?? ''}&permissions=51200&scope=bot%20applications.commands`, true)
}
