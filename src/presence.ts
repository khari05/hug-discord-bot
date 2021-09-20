import { Client } from "discord.js";

export async function updatePresence (client: Client, prefix: string) {
  client.user?.setPresence({ activities: [{ name: `${client.guilds.cache.size} guilds | ${prefix}help`, type: 'WATCHING' }] })
}