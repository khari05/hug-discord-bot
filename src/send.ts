import { CommandInteraction, Message, MessageEmbed } from 'discord.js'

/**
 * a function to consolidate sending messages and replying to interactions.
 * @param input the original message or command interaction that called the parent function
 * @param reply the output that is about to be sent to the channel
 * @param ephemeral if the input is a command, does the bot reply with a dismissable message
 */
export async function sendMessage (input: Message | CommandInteraction, reply: string | MessageEmbed, ephemeral: boolean): Promise<void> {
  const message = {
    content: (typeof reply === 'string') ? reply : undefined,
    embeds: (reply instanceof MessageEmbed) ? [reply] : undefined
  }

  if (input instanceof Message) {
    await input.channel.send(message)
  } else if (input instanceof CommandInteraction) {
    await input.reply({ ...message, ephemeral: ephemeral })
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
