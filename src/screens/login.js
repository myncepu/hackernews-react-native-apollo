/*
 * login.js
 * Copyright (C) 2018 yanpengqiang <yan2010@live.com>
 *
 * Distributed under terms of the MIT license.
 */
import React, {Component} from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import {graphql, compose} from 'react-apollo'
import gql from 'graphql-tag'
import { setUser, getUser, clearUser } from 'react-native-authentication-helpers'

class Login extends Component {
  state = {
    hasRegister: true,
    email: '',
    password: '',
    name: '',
  }

  _confirm = async () => {
    const {name, email, password, hasRegister} = this.state
    if (hasRegister) {
      const result = await this.props.loginMutation({
        variables: {
          email,
          password,
        }
      })
      const token = result.data.login.token
      const id = result.data.login.user.id
      this._saveUserData(id, token)
    } else {
      const result = await this.props.signupMutation({
        variables: {
          name,
          email,
          password,
        }
      })
      const token = result.data.signup.token
      const id = result.data.signup.user.id
      this._saveUserData(id, token)
    }
    this.props.navigation.navigate('Links')
  }

  _saveUserData = (id, token) => {
    setUser({ id, token })
  }

  _logout = () => {
    clearUser()
  }

  render() {
    const hasLogin = getUser() != null
    if (hasLogin) {
      return (
        <View style={s.container}>
          <TouchableOpacity style={s.button} onPress={this._logout}>
            <Text style={{ color: 'white', fontSize: 20 }}>
              logout
            </Text>
          </TouchableOpacity>
        </View>
      )
    }

    if (!hasLogin) {
      return (
        <View style={s.container}>
          <Text style={s.large}>
            {this.state.hasRegister ? 'Login' : 'Sign up'}
          </Text>
          {!this.state.hasRegister && (
            <TextInput
              value={this.state.name}
              style={s.input}
              onChangeText={name => this.setState({name})}
              placeholder='Your name'
            />
          )}
          <TextInput
            value={this.state.email}
            style={s.input}
            onChangeText={email => this.setState({email})}
            placeholder='Your email address'
          />
          <TextInput
            secureTextEntry
            value={this.state.password}
            style={s.input}
            onChangeText={password => this.setState({password})}
            placeholder='Your password'
          />
          <TouchableOpacity style={s.button} onPress={this._confirm}>
            <Text style={{ color: 'white', fontSize: 20 }}>
              {this.state.hasRegister ? 'Login' : 'Create account'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.buttonOutline}
            onPress={() => {this.setState({ hasRegister: !this.state.hasRegister })}}
          >
            <Text style={{ color: 'tomato', fontSize: 20 }}>
              {this.state.hasRegister ? 'Need to create an accound?' : 'Already have an account?'}
            </Text>
          </TouchableOpacity>
        </View>
      )
    }
  }
}

const borderWidthRadio = 5
const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  large: {
    fontSize: 30,
    alignSelf: 'flex-start',
    color: 'tomato',
    marginVertical: 30,
  },
  input: {
    marginVertical: 10,
    padding: 5,
    fontSize: 20,
    borderWidth: StyleSheet.hairlineWidth * borderWidthRadio,
    borderColor: 'tomato',
  },
  button: {
    marginVertical: 10,
    backgroundColor: 'tomato',
    alignItems: 'center',
    padding: 5,
  },
  buttonOutline: {
    marginVertical: 10,
    borderColor: 'tomato',
    borderWidth: StyleSheet.hairlineWidth * borderWidthRadio,
    alignItems: 'center',
    padding: 5,
  },
})

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
      user {
        id
      }
    }
  }
`
const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
      }
    }
  }
`

export default compose(
  graphql(SIGNUP_MUTATION, {name: 'signupMutation'}),
  graphql(LOGIN_MUTATION, {name: 'loginMutation'}),
)(Login)
