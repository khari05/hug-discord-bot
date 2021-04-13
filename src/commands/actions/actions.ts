import { Action, ActionType } from './action.js'
import { sendAction } from './send.js'

export const actionMap: Map<string, Action> = new Map([
  ['hug', {
    command: { name: 'hug', description: 'Hug another user', cmd: sendAction },
    type: ActionType.multiUser,
    phrase: (a, b) => `${a}*** hugs ***${b}`,
    key: 'hug',
    links: { filled: false }
  }],
  ['kiss', {
    command: { name: 'kiss', description: 'Kiss another user', cmd: sendAction },
    type: ActionType.multiUser,
    phrase: (a, b) => `${a}*** kisses ***${b}`,
    key: 'kiss',
    links: { filled: false }
  }],
  ['headpat', {
    command: { name: 'headpat', description: 'Pat another user', cmd: sendAction },
    type: ActionType.multiUser,
    phrase: (a, b) => `${a}*** pats ***${b}`,
    key: 'pat',
    links: { filled: false }
  }],
  ['cuddle', {
    command: { name: 'cuddle', description: 'Cuddle with another user', cmd: sendAction },
    type: ActionType.multiUser,
    phrase: (a, b) => `${a}*** cuddles ***${b}`,
    key: 'snuggle',
    links: { filled: false }
  }],
  ['holdhands', {
    command: { name: 'holdhands', description: 'Hold hands with another user', cmd: sendAction },
    type: ActionType.multiUser,
    phrase: (a, b) => `${a}*** holds hands with ***${b}`,
    key: 'handhold',
    links: { filled: false }
  }],
  ['cry', {
    command: { name: 'cry', description: 'Cry', cmd: sendAction },
    type: ActionType.singleUser,
    phrase: (a, b) => `${a}*** cries***`,
    key: 'cry',
    links: { filled: false }
  }]
])
