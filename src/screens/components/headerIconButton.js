/*
 * headerIconButton.js
 * Copyright (C) 2018 yanpengqiang <yan2010@live.com>
 *
 * Distributed under terms of the MIT license.
 */
import React, { Component } from 'react'
import { Platform, StyleSheet } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Touchable from 'react-native-platform-touchable'

import Colors from '../../constants/Colors'

export default class HeaderIconButton extends Component {
  render() {
    let presetIconName = this.props.name
    let presetIconSize = 25

    let presetIcon = IconNames[this.props.name]
    if (presetIcon) {
      presetIconName = presetIcon.name
      presetIconSize = presetIcon.size
    }

    return (
      <Touchable
        hitSlop={{
          top: 15,
          bottom: 15,
          left: 10,
          right: 10,
        }}
        background={Touchable.Ripple(Colors.white, true)}
        style={styles.button}
        onPress={this.props.onPress}>
        <Ionicons
          name={presetIconName}
          style={{ color: Colors.white }}
          size={presetIconSize}
        />
      </Touchable>
    )
  }
}

const IconNames = {
  ...Platform.select({
    ios: {
      create: {
        name: 'ios-add-outline',
        size: 33,
      },
      search: {
        name: 'ios-search-outline',
        size: 25,
      },
    },
    android: {
      create: {
        name: 'md-create',
        size: 25,
      },
      search: {
        name: 'md-search',
        size: 25,
      },
    },
  }),
  authenticate: {
    name: 'md-key',
    size: 25,
  },
  user: {
    name: 'md-person',
    size: 25,
  },
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginLeft: Platform.OS === 'ios' ? 12 : 17,
  },
})
