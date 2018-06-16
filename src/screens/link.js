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
} from 'react-native'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { withUser } from 'react-native-authentication-helpers'

import {timeDifferenceForDate} from '../utils/timeDifference'

class Link extends Component {
  state = {
    hasVoted: false,
  }

  componentDidMount() {
    if (!this.props.user) {
      return
    }

    const hasVoted = !!this.props.link.votes.find(
      vote => vote.user.id === this.props.user.id
    )

    this.setState({ hasVoted })
  }

  _voteForLink = async() => {
    if (this.state.hasVoted) {
      alert('You already voted for this link.')
      return
    }

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

  render() {
    const {hasVoted} = this.state
    const {link, user} = this.props

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
        {user && (
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
export default graphql(VOTE_MUTATION, {name: 'voteMutation'})(withUser(Link))
