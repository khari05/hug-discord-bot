import axios, { AxiosResponse } from 'axios'
import { Action } from './action'
import { actionMap } from './actions'

const instance = axios.create({
  baseURL: 'https://curatedtenor.herokuapp.com/gifs',
  timeout: 10000
})

export async function fillLinks (): Promise<void> {
  const promises: Array<Promise<void>> = []
  actionMap.forEach((a, n) => {
    if (!a.links.filled) {
      promises.push(
        instance.get(`/${a.key}`)
          .then((response) => mapLinks(n, a, response, actionMap))
      )
    }
  })
  await Promise.all(promises)
}

function mapLinks (n: string, a: Action, response: AxiosResponse<any>, map: Map<string, Action>): void {
  map.set(n, {
    ...a,
    links: { filled: true, ...response.data }
  })
}
