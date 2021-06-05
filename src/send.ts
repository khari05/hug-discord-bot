import { CommandInteraction, Message } from 'discord.js'

export async function sendMessage (input: Message | CommandInteraction, reply, ephemeral: boolean): Promise<void> {
  if (input instanceof Message) {
    await input.channel.send(reply)
  } else if (input instanceof CommandInteraction) {
    await input.reply(reply, { ephemeral: ephemeral })
  }
}

export async function sendGif (msg: string, input: Message | CommandInteraction, link: string): Promise<void> {
  if (input instanceof Message) {
    await input.channel.send({
      content: msg,
      files: [{
        attachment: link,
        name: 'tenor.gif'
      }]
    })
  } else {
    await input.reply({
      content: msg,
      files: [{
        attachment: link,
        name: 'tenor.gif'
      }]
    })
  }
}
