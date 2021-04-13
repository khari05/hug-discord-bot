import { DMChannel, Message, NewsChannel, TextChannel } from 'discord.js'
import { isChannelDisabled } from '../../disabled.js'
import { ActionType, Links } from './action.js'
import { actionMap } from './actions.js'

export async function sendAction (cmd: string, msg: Message): Promise<void> {
  const action = actionMap.get(cmd)

  if (isChannelDisabled(msg.channel.id)) {
    await msg.channel.send('Sorry, that command is disabled in this channel.')
  } else {
    if (action?.links !== undefined && action.links.filled) {
      let person2: string = 'themself'

      if (action.type === ActionType.multiUser) {
        const mention = msg.content.match(/<@!?\d+>+?/g)
        if (mention !== null) {
          const mentionIds: string[] = mention.map((a: string) => {
            const match = a.match(/\d+/)
            return match !== null ? match[0] : ''
          })
          if (mention.length === 1 && msg.author.id !== mentionIds[0]) {
            person2 = `<@${mentionIds[0]}>`
          } else if (mention.length === 2) {
            person2 = `<@${mentionIds[0]}> and <@${mentionIds[1]}>`
          } else if (mention.length > 2) {
            person2 = '***multiple people***'
          }
        } else if (msg.mentions.users.size === 1) {
          person2 = `<@${msg.mentions.users.first()?.id ?? ''}>`
        } else if (msg.content.match(/^.\w+\s(@everyone|@here)/) !== null) {
          person2 = '***the entire server***'
        }
      }

      const gifLink = getGif(msg.content, action.links)
      if (gifLink !== undefined) {
        await sendGif(
          action?.phrase(`<@${msg.author.id}>`, person2) ?? '',
          msg.channel,
          gifLink
        )
      }
    }
  }
}

async function sendGif (msg: string, channel: TextChannel | DMChannel | NewsChannel, link: string): Promise<void> {
  await channel.send({
    content: msg,
    files: [{
      attachment: link,
      name: 'tenor.gif'
    }]
  })
}

function getGif (msg: string, links: Links): string | undefined {
  if (links.type === ActionType.singleUser) {
    if (msg.match(/\sm[\s|$]/) !== null && links.m !== undefined) {
      return links.m[Math.floor(Math.random() * links.m.length)]
    } else if (links.f !== undefined) {
      return links.f[Math.floor(Math.random() * links.f.length)]
    } else if (links.f !== undefined && links.m !== undefined) {
      const allLinks = [...links.f, ...links.m]
      return allLinks[Math.floor(Math.random() * allLinks.length)]
    }
  } else {
    if (msg.match(/\sff[\s|$]/) !== null && links.ff !== undefined) {
      return links.ff[Math.floor(Math.random() * links.ff.length)]
    } else if (msg.match(/\smm[\s|$]/) !== null && links.mm !== undefined) {
      return links.mm[Math.floor(Math.random() * links.mm.length)]
    } else if (msg.match(/\smm[\s|$]/) !== null && links.mf !== undefined) {
      return links.mf[Math.floor(Math.random() * links.mf.length)]
    } else if (links.ff !== undefined && links.mf !== undefined && links.mm !== undefined) {
      const allLinks = [...links.ff, ...links.mf, ...links.mm]
      return allLinks[Math.floor(Math.random() * allLinks.length)]
    }
  }
  return undefined
}
