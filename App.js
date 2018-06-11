import React, {Component} from 'react'
import {ApolloProvider} from 'react-apollo'
import {ApolloClient} from 'apollo-client'
import {HttpLink} from 'apollo-link-http'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {ApolloLink} from 'apollo-client-preset'

import {AUTH_TOKEN} from './src/constants'

import App from './src'

const httpLink = new HttpLink({
  uri: 'http://localhost:4000'
})

const client = new ApolloClient({
  link: httpLink,
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
