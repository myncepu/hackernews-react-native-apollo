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
  StyleSheet,
} from 'react-native'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag'

import Link from './link'

class LinkList extends Component {
  render() {
    const {feedQuery} = this.props

    if (feedQuery && feedQuery.loading) {
      return (
        <Text>Loading</Text>
      )
    }

    if (feedQuery && feedQuery.error) {
      return (
        <Text>{feedQuery.error.message}</Text>
      )
    }

    const linksToRender = feedQuery.feed.links
    return (
      <View style={styles.linkList}>
        {
          linksToRender.map(link => (
            <Link key={link.id} link={link} />
          ))
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
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
