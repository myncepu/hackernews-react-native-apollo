import React, {Component} from 'react'
import {ApolloProvider} from 'react-apollo'
import {ApolloClient} from 'apollo-client'
import {HttpLink} from 'apollo-link-http'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {from} from 'apollo-client-preset'
import { setContext } from 'apollo-link-context'
import { getUser, loadUserAsync } from 'react-native-authentication-helpers'

import App from './src'

const httpLink = new HttpLink({
  uri: 'http://localhost:4000'
})


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
  link: from([authMiddleware, httpLink]),
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
