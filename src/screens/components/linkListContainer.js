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
} from 'react-native'
import { withUser } from 'react-native-authentication-helpers'

import LinkListComponent from './linkList'
import { FEED_QUERY } from '../links'

class LinkListContainer extends Component {
  state = {
    hasVoted: false,
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

  componentDidMount() {
    this.props.subscribeToNewLinks()
  }

  render() {
    const { loading, error, data } = this.props

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

    // console.log('data', data)
    return (
      <LinkListComponent
        error={error}
        loading={loading}
        links={data.feed.links}
        canLoadMore={ data && data.feed.count > data.feed.length }
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

export default withUser(LinkListContainer)
