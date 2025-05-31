import { Schema } from '../../data/resource'

export const handler: Schema["GetGreeting"]["functionHandler"] = async (event) => {
  
  const { context } = event.arguments

  if (event.identity && 'claims' in event.identity) {
    const { claims } = event.identity
    const username = event.identity.claims.email || 'anonymous'
    const givenName = event.identity.claims.given_name || 'unknown'
    return `Hello, ${givenName}! (username: ${username}), welcome to ${context}`
  }

  return `Hello, whoever you are, welcome to ${context}`
}