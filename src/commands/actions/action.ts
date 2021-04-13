import { Command } from '../../command.js'

export interface Action {
  command: Command
  type: ActionType
  phrase: (a: string, b: string) => string
  key: string
  links: Links
}

export interface Links {
  filled: boolean
  type: ActionType
  f?: string[]
  m?: string[]
  ff?: string[]
  mf?: string[]
  mm?: string[]
}

export enum ActionType {
  singleUser,
  multiUser
}
