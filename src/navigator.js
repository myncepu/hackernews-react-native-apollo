/*
 * navigator.js
 * Copyright (C) 2018 yanpengqiang <yan2010@live.com>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react'
import { createBottomTabNavigator } from 'react-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'

import LinkList from './screens/linkList'
import CreateLink from './screens/createLink'
import Login from './screens/login'

export default createBottomTabNavigator({
  Login,
  LinkList,
  CreateLink,
}, {
  navigationOptions: ({navigation}) => ({
    tabBarIcon: ({focused, tintColor}) => {
      const { routeName } = navigation.state
      let iconName
      switch (routeName) {
        case 'LinkList':
          iconName = `ios-home${focused ? '' : '-outline'}`
          break
        case 'CreateLink':
          iconName = `ios-create${focused ? '' : '-outline'}`
          break
        case 'Login':
          iconName = `ios-person${focused ? '' : '-outline'}`
          break
      }
      return <Ionicons name={iconName} size={25} color={tintColor} />
    },
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    }
  })
})
