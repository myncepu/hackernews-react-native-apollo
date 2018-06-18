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
import {Mutation} from 'react-apollo'

import {FEED_QUERY} from './links'

export default class CreateLink extends Component {
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
      },
    })
    this.props.navigation.navigate('LinkList')
  }

  render() {
    return (
      <Mutation mutation={POST_MUTATION} >
        {(postMutation) => (
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
            <Button
              title='Submit'
              onPress={() => {
                const {description, url} = this.state
                postMutation({
                  variables: { description, url },
                  update: (store, { data: { post } }) => {
                    const data = store.readQuery({ query: FEED_QUERY })
                    data.feed.links.splice(0, 0, post)
                    store.writeQuery({
                      query: FEED_QUERY,
                      data,
                    })
                  }
                })
                this.props.navigation.navigate('LinkList')
              }}
            />
          </View>
        )}
      </Mutation>
    )
  }
}

const s = StyleSheet.create({
  form: {
    flex: 1,
  },
  inputs: {
    width: '80%',
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
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
    }
  }
`

// export default graphql(POST_MUTATION, {name: 'postMutation'})(CreateLink)
