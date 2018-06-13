/*
 * link.js
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

class Link extends Component {
  _voteForLink = async() => {
    //TODO: implement later
  }
  render() {
    return (
      <View>
        <Text style={styles.link}>
          {this.props.link.description}({this.props.link.url})
        </Text>
      </View>
    )
  }
}

const borderWidthRatio = 10
const styles = StyleSheet.create({
  link: {
    fontSize: 20,
    borderColor: 'tomato',
    borderWidth: StyleSheet.hairlineWidth * borderWidthRatio,
    margin: 5,
  },
})

export default Link
