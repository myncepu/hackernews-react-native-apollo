/*
 * authLoading.js
 * Copyright (C) 2018 yanpengqiang <yan2010@live.com>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react'
import {
  View,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
} from 'react-native'
import { loadUserAsync } from 'react-native-authentication-helpers'


export default class AuthLoadingScreen extends React.Component {
  constructor() {
    super()
    this._bootstrapAsync()
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const user = await loadUserAsync()

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(user ? 'App' : 'Auth')
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
