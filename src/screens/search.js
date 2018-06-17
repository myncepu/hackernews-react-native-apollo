/*
 * search.js
 * Copyright (C) 2018 yanpengqiang <yan2010@live.com>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react'
import { View, Platform, ActivityIndicator, StyleSheet } from 'react-native'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'

import SearchLayout from '../components/react-navigation-addon-search-layout'
import LinkList from './components/linkList'

class SearchScreen extends React.Component {
  state = {
    links: [],
    searchText: '',
    loading: false,
  };

  render() {
    return (
      <SearchLayout
        headerBackgroundColor='green'
        headerTintColor="#fff"
        onChangeQuery={this._handleQueryChange}
        onSubmit={() => null}
        searchInputSelectionColor="#fff"
        searchInputTextColor={Platform.OS === 'android' ? '#fff' : 'black'}
        searchInputPlaceholderTextColor={
          Platform.OS === 'ios' ? '#898989' : '#fafafa'
        }>
        <LinkList
          hideNumbers={true}
          loading={this.state.loading}
          links={this.state.links}
          error={this.state.error}
          onVote={this._updateCacheAfterVote}
        />
        { this.state.loading &&
            <View style={styles.loading}>
              <ActivityIndicator
                animating
                size='large'
              />
            </View>
        }
      </SearchLayout>
    )
  }

  _handleQueryChange = searchText => {
    // this.setState({ searchText })
    this._executeSearch(searchText)
  }

  _updateCacheAfterVote = (store, createVote, linkId) => {
    const votedLinkId = this.state.links.findIndex(link => link.id === linkId)
    const votedLink = this.state.links[votedLinkId]
    let links = [...this.state.links]
    links[votedLinkId] = {
      ...votedLink,
      votes: createVote.link.votes,
    }

    this.setState({
      links,
    })
  };

  _executeSearch = async (searchText) => {
    // const { searchText } = this.state
    if (!searchText) {
      this.setState({ links: [] })
      return
    }

    try {
      this.setState({ loading: true })
      const result = await this.props.client.query({
        query: ALL_LINKS_SEARCH_QUERY,
        variables: { searchText },
      })
      const links = result.data.feed.links
      this.setState({ links })
    } finally {
      this.setState({ loading: false })
    }
  };
}

const ALL_LINKS_SEARCH_QUERY = gql`
  query AllLinksSearchQuery($searchText: String!) {
    feed(filter: $searchText)
    {
      links {
        id
        url
        createdAt
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
  }
`

const styles = StyleSheet.create({
  loading: {
    position: 'absolute', 
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  }
})

export default withApollo(SearchScreen)
