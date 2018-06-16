/*
 * linkList.js
 * Copyright (C) 2018 yanpengqiang <yan2010@live.com>
 *
 * Distributed under terms of the MIT license.
 */
import React, { Component } from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Platform,
} from 'react-native'
import {Query} from 'react-apollo'
import gql from 'graphql-tag'
import { withUser } from 'react-native-authentication-helpers'

import Link from './components/link'
import HeaderActions from './components/HeaderActions'

class LinkList extends Component {
  state = {
    hasVoted: false,
  }

  static navigationOptions = props => {
    return {
      headerTitle: (
        <View>
          <Text>Link List</Text>
        </View>
      ),
      headerRight: (
        <HeaderActions.Right
          navigation={props.navigation}
          onCreateLink={() => {
            return null
          }}
        />
      ),
      ...Platform.select({
        ios: {
          headerLeft: <HeaderActions.Left navigation={props.navigation} />,
        },
      }),
    }
  }

  _updateCacheAfterVote = (store, createVote, linkId) => {
    // 1
    const data = store.readQuery({ query: FEED_QUERY })
    // 2
    const votedLink = data.feed.links.find(link => link.id === linkId)
    votedLink.votes = createVote.link.votes
    // 3
    store.writeQuery({query: FEED_QUERY, data})
  }

  render() {
    return (
      <Query query={FEED_QUERY}>
        {({ loading, error, data }) => {
          if (loading) {
            return (
              <View style={styles.container}>
                <ActivityIndicator size='large' color='tomato' />
              </View>
            )
          }

          if (error) {
            return (
              <View style={styles.container}>
                <Text>{error.message}</Text>
              </View>
            )
          }

          const linksToRender = data.feed.links

          return (
            <View style={styles.container}>
              <View style={styles.linkList}>
                <FlatList
                  data={linksToRender}
                  keyExtractor={(item) => {
                    return item.id
                  }}
                  renderItem={({item}) => {
                    return (
                      <Link
                        key={item.id}
                        link={item}
                        updaeStoreAfterVote={this._updateCacheAfterVote}
                      />
                    )
                  }}
                />
              </View>
            </View>
          )
        }}
      </Query>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  linkList: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
})

export const FEED_QUERY = gql`
  query FeedQuery{
    feed {
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
           id
          }
        }
      }
    }
  }
`

export default withUser(LinkList)
