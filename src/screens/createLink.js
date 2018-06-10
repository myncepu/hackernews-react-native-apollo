/*
 * createLink.js
 * Copyright (C) 2018 yanpengqiang <yan2010@live.com>
 *
 * Distributed under terms of the MIT license.
 */
import React, {Component} from 'react'
import {
  View,
  TextInput,
  Button,
  StyleSheet,
} from 'react-native'
import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

class CreateLink extends Component {
  state = {
    description: '',
    url: '',
  }

  _createLink = async () => {
    const {description, url} = this.state
    await this.props.postMutation({
      variables: {
        description,
        url,
      }
    })
  }

  render() {
    return (
      <View style={s.form}>
        <View style={s.inputs}>
          <TextInput
            style={s.input}
            value={this.state.description}
            onChangeText={description => this.setState({ description })}
            placeholder='A description for the link'
          />
          <TextInput
            style={s.input}
            value={this.state.url}
            onChangeText={url => this.setState({ url })}
            placeholder='The URL for the link'
          />
        </View>
        <Button title='Submit' onPress={this._createLink} />
      </View>
    )
  }
}

const s = StyleSheet.create({
  form: {
    flex: 1,
  },
  inputs: {
    width: '100%',
    margin: 30,
    alignItems: 'stretch',
  },
  input: {
    fontSize: 20,
    margin: 20,
    borderColor: 'gray',
    borderWidth: StyleSheet.hairlineWidth,
  },
})

// 1
const POST_MUTATION = gql`
  # 2
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`

export default graphql(POST_MUTATION, {name: 'postMutation'})(CreateLink)
