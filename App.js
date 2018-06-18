import React, {Component} from 'react'
import {ApolloProvider} from 'react-apollo'
import {ApolloClient} from 'apollo-client'
import {HttpLink} from 'apollo-link-http'
import {InMemoryCache} from 'apollo-cache-inmemory'
import { from, split } from 'apollo-client-preset'
import { setContext } from 'apollo-link-context'
import { getUser, loadUserAsync } from 'react-native-authentication-helpers'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

import App from './src'

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000',
  options: {
    reconnect: true,
    // 可不可以也用authMiddleware
    // connectionParams: {
    // }
  }
})

const httpLink = new HttpLink({
  uri: 'http://localhost:4000',
})

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink
)

// 异步方式设置header
const authMiddleware = setContext(async (req, { headers }) => {
  await loadUserAsync()
  const token = getUser() && getUser().token

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    },
  }
})


const client = new ApolloClient({
  link: from([authMiddleware, link]),
  cache: new InMemoryCache(),
})

export default class ApolloApp extends Component {
  render() {
    return (
      <ApolloProvider client={client} >
        <App />
      </ApolloProvider>
    )
  }
}
