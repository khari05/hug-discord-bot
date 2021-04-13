import { readFileSync, writeFileSync } from 'fs'

const fileLocation: string = '/app/disabled.txt'
const disabled = readFileSync(fileLocation).toString().split('\n')

export function isChannelDisabled (id: string): boolean {
  return disabled.includes(id)
}

export function removeChannel (id: string): void {
  disabled.splice(disabled.indexOf(id), 1)
  writeFileSync(fileLocation, disabled.join('\n'))
}

export function addChannel (id: string): void {
  disabled.push(id)
  writeFileSync(fileLocation, disabled.join('\n'))
}
