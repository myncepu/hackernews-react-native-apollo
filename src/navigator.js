/*
 * navigator.js
 * Copyright (C) 2018 yanpengqiang <yan2010@live.com>
 *
 * Distributed under terms of the MIT license.
 */
import { Animated } from 'react-native'
import {
  createStackNavigator,
  createSwitchNavigator
} from 'react-navigation'

import LinkList from './screens/linkList'
import CreateLink from './screens/createLink'
import Login from './screens/login'
import AuthLoadingScreen from './screens/authLoading'
import SearchScreen from './screens/search'
import Colors from './constants/Colors'

const MainStack = createStackNavigator(
  {
    Links: {
      screen: LinkList,
    },
    CreateLink: {
      screen: CreateLink,
    },
    Authentication: {
      screen: Login,
    },
  },
  {
    initialRouteName: 'Links',
    cardStyle: {
      backgroundColor: Colors.almostWhite,
    },
    navigationOptions: () => ({
      headerBackTitle: 'Back',
      headerPressColorAndroid: Colors.white,
      headerStyle: {
        backgroundColor: Colors.orange,
      },
      headerTintColor: Colors.white,
    }),
  }
)

const AppNavigator = createStackNavigator(
  {
    Main: {
      screen: MainStack,
    },
    Search: {
      screen: SearchScreen,
    },
  },
  {
    initialRouteName: 'Main',
    cardStyle: {
      backgroundColor: Colors.almostWhite,
    },
    headerMode: 'none',
    transitionConfig: () => ({
      transitionSpec: {
        duration: 0,
        timing: Animated.timing,
      },
    }),
    navigationOptions: {
      gesturesEnabled: false,
    }
  }
)

export default createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppNavigator,
    Auth: Login,
  },
  {
    initialRouteName: 'AuthLoading',
  }
)
