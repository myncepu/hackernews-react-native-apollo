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
  TouchableOpacity,
  AsyncStorage,
} from 'react-native'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import Ionicons from 'react-native-vector-icons/Ionicons'

import {timeDifferenceForDate} from '../utils/timeDifference'
import {AUTH_TOKEN} from '../constants'

class Link extends Component {
  state = {
    authToken: null,
    hasVoted: false,
  }

  _voteForLink = async() => {
    const linkId = this.props.link.id
    await this.props.voteMutation({
      variables: {
        linkId,
      },
      update: (store, {data: {vote}}) => {
        this.props.updaeStoreAfterVote(store, vote, linkId)
      },
    })
    this.setState({ hasVoted: !this.state.hasVoted })
  }

  componentDidMount = async () => {
    const authToken = await AsyncStorage.getItem(AUTH_TOKEN)
    this.setState({ authToken })
  }

  render() {
    const {authToken, hasVoted} = this.state
    const {link} = this.props

    return (
      <View style={styles.link}>
        <Text>
          {link.description}({link.url})
        </Text>
        <Text>
          {link.votes.length} votes | by {' '}
          {link.postedBy ? link.postedBy.name : 'Unknown'} {' '}
          {timeDifferenceForDate(link.createdAt)}
        </Text>
        {authToken && (
          <TouchableOpacity onPress={this._voteForLink}>
            <Ionicons name={hasVoted ? 'ios-thumbs-up' : 'ios-thumbs-up-outline'} size={25} color={'tomato'} />
          </TouchableOpacity>
        )}
      </View>
    )
  }
}

const borderWidthRatio = 10
const styles = StyleSheet.create({
  link: {
    borderColor: 'tomato',
    borderWidth: StyleSheet.hairlineWidth * borderWidthRatio,
    margin: 5,
  },
})

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote (linkId: $linkId) {
      id
      link {
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`
export default graphql(VOTE_MUTATION, {name: 'voteMutation'})(Link)
