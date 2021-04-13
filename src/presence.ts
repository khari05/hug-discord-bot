import { Client } from 'discord.js'
import { prefix } from '.'

export async function updatePresence (client: Client): Promise<void> {
  await client.user?.setPresence({
    activity: {
      name: `${client.guilds.cache.size} guilds | ${prefix}help`,
      type: 'WATCHING'
    }
  })
}
