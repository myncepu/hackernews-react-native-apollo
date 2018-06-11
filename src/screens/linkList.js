/*
 * linkList.js
 * Copyright (C) 2018 yanpengqiang <yan2010@live.com>
 *
 * Distributed under terms of the MIT license.
 */
import React, {Component} from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from 'react-native'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag'

import Link from './link'

class LinkList extends Component {
  render() {
    const {feedQuery} = this.props

    if (feedQuery && feedQuery.loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size='large' color='tomato' />
        </View>
      )
    }

    if (feedQuery && feedQuery.error) {
      return (
        <View style={styles.container}>
          <Text>{feedQuery.error.message}</Text>
        </View>
      )
    }

    const linksToRender = feedQuery.feed
    return (
      <View style={styles.linkList}>
        <FlatList
          data={linksToRender.links}
          keyExtractor={(item) => {
            return item.id
          }}
          renderItem={({item}) => {
            return (
              <Link key={item.id} link={item} />
            )
          }}
        />
      </View>
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

const FEED_QUERY = gql`
  query FeedQuery{
    feed {
      links {
        id
        createdAt
        url
        description
      }
    }
  }
`

export default graphql(FEED_QUERY, {name: 'feedQuery'})(LinkList)
