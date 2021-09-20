import { CommandInteraction, Message, MessageEmbed } from 'discord.js'

export async function sendMessage (input: Message | CommandInteraction, reply: any, ephemeral: boolean): Promise<void> {
  if (input instanceof Message) {
    await input.channel.send({ content: (typeof reply === 'string') ? reply : undefined, embeds: (reply instanceof MessageEmbed) ? [reply] : undefined })
  } else if (input instanceof CommandInteraction) {
    await input.reply({ content: (typeof reply === 'string') ? reply : undefined, embeds: (reply instanceof MessageEmbed) ? [reply] : undefined, ephemeral: ephemeral })
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
