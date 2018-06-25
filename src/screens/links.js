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
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { withUser } from 'react-native-authentication-helpers'

import LinkList from './components/linkList'
import HeaderActions from './components/HeaderActions'

const NEW_LINK_SUBSCRIPTION = gql`
  subscription {
    newLink {
      node {
        id
        url
        description
        createdAt
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
export const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
  feed(first: $first, skip: $skip, orderBy: $orderBy) {
    count
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

class Links extends Component {
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

  componentDidMount() {
    this._subscribeToNewVotes()
  }

  componentWillUnmount() {
    this._unsubscribe()
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

  _subscribeToNewVotes = () => {
    this._unsubscribe = this.props.feedQuery.subscribeToMore({
      document: NEW_LINK_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const newAllLInks = [
          subscriptionData.data.newLink.node,
          ...prev.feed.links
        ]

        const next = Object.assign({}, prev, {
          links: {
            newAllLInks
          }
        })

        return next
      }
    })
  }

  _handleLoadMore = () => {
    this.props.loadMoreLinks()
  }

  render() {
    const { loading, error, feed } = this.props.feedQuery
    // console.log('this.props.feedQuery', Object.getOwnPropertyNames(this.props.feedQuery))

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

    return (
      <LinkList
        error={error}
        loading={loading}
        links={feed.links}
        canLoadMore={ feed && feed.count > feed.links.length }
        onLoadMore={this._handleLoadMore}
        onRefresh={this._handleRefresh}
        onVote={this._updateCacheAfterVote}
        renderEmptyList={() => (
          <View style={styles.noLinksContainer}>
            <Text style={styles.noLinksText}>
              No links have been posted yet! Sign in and post one to be the
              first.
            </Text>
          </View>
        )}
      />
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

const LINKS_PER_PAGE = 5

const LinkWithUser = withUser(Links)
export default graphql(FEED_QUERY, {
  name: 'feedQuery',
  options: () => ({
    variables: {
      first: LINKS_PER_PAGE,
      skip: 0,
      orderBy: 'createdAt_DESC',
    },
  }),
  props: ({ feedQuery, ownProps }) => {
    let skip = 0
    if (feedQuery.feed) {
      skip = feedQuery.feed.links.length
    }

    return {
      feedQuery,
      ...ownProps,
      loadMoreLinks: () => {
        return feedQuery.fetchMore({
          variables: {
            first: LINKS_PER_PAGE,
            skip,
            orderBy: 'createdAt_DESC',
          },
          updateQuery: (previous, { fetchMoreResult }) => {
            if (!fetchMoreResult.feed) {
              return previous
            }
            const newAllLinks = [...previous.feed.links, ...fetchMoreResult.feed.links]
            const newFeed = Object.assign({}, previous.feed, {
              links: newAllLinks,
            })
            const next = Object.assign({}, previous, {
              feed: { ...newFeed },
            })
            return next
          },
        })
      },
    }
  },
})(LinkWithUser)
