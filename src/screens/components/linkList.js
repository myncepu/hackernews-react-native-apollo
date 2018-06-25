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
  StyleSheet,
  FlatList,
} from 'react-native'
import Touchable from 'react-native-platform-touchable'

import Link from './link'
import Colors from '../../constants/Colors'

class LinkList extends Component {

  _renderFooter = () => {
    if (!this.props.canLoadMore || !this.props.onLoadMore) {
      return null
    }

    return (
      <Touchable style={styles.loadMoreButton} onPress={this.props.onLoadMore}>
        <Text style={styles.loadMoreText}>Load more</Text>
      </Touchable>
    )
  }

  render() {
    return (
      <View style={styles.linkList}>
        <FlatList
          data={this.props.links}
          keyExtractor={ link => link.id }
          onRefresh={this.props.onRefresh}
          refreshing={!!this.props.refreshing}
          ListFooterComponent={this._renderFooter}
          renderItem={({ item, index }) => {
            return (
              <Link
                index={index}
                link={item}
                hideNumbers={this.props.hideNumbers}
                updateStoreAfterVote={this.props.onVote}
              />
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
  loadMoreButton: {
    marginTop: 5,
    paddingVertical: 15,
    backgroundColor: Colors.almostWhite,
    borderColor: Colors.lightGrey,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadMoreText: {
    color: Colors.darkGrey,
  },
})

export default LinkList
