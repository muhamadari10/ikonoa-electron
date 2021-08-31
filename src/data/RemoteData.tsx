import { getAccessToken } from "./auth/AuthData"

export interface ProductRequest {
  description: string
}

export function postApi<Param, Return>(url: string, body: Param): Promise<Return> {
  let accessToken = getAccessToken()

  const requestInit: RequestInit = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + accessToken
    }
  }
  return api<Param, Return>(url, requestInit)
}

export function postApiNoToken<Param, Return>(url: string, body: Param): Promise<Return> {
  const requestInit: RequestInit = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
  return api<Param, Return>(url, requestInit)
}

export function getApi<Param, Return>(url: string): Promise<Return> {
  let accessToken = getAccessToken()

  const requestInit: RequestInit = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + accessToken, 
    }
  }
  return api<Param, Return>(url, requestInit)
}

function api<Param, Return>(url: string, requestInit: RequestInit): Promise<Return> {
  return fetch(url, requestInit)
    .then(response => {
      if (!response.ok) {
        console.log('error not okay ' + JSON.stringify(response))
        throw response
      }
      return response.json()
    })
}
