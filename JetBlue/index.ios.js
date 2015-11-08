/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  Image,
  ListView,
  StyleSheet,
  Text,
  View,
  ScrollView
} = React;

var FlightItem = require('./FlightItem');
var FlightDropdown = require('./FlightDropdown');
var InfiniteScrollView = require('react-native-infinite-scroll-view');
var DEFAULT_SIZE = 20;

var REQUEST_URL = "http://162.243.8.248:3000/api/flights?"
var JetBlue = React.createClass({
  getInitialState: function() {
    this._data = [];

    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
      isLoadingTail: false,
      user: 'user1',
      skip: 0
    };
  },

  componentDidMount: function() {
    this.fetchData();
  },

  fetchData: function() {
    console.log(REQUEST_URL + 'username=' + this.state.user + '&size=' + DEFAULT_SIZE + '&skip=' + this.state.skip);
    fetch(REQUEST_URL + 'username=' + this.state.user + '&size=' + DEFAULT_SIZE + '&skip=' + this.state.skip)
      .then((response) => response.json())
      .then((responseData) => {
        this._data = this._data.concat(responseData);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(this._data),
          loaded: true,
        });

        this.state.skip += DEFAULT_SIZE;
      })
      .done();
  },

  render: function() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <View style={{flex: 1, backgroundColor: '#0659A9'}}>
        <View style={styles.top}>
          <FlightDropdown setUser={this.setUser}/>
          
          
        </View>
        
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderFlight}
          style={styles.listView}
          onEndReached={this.onEndReached} />
      </View>
      
    );
  },

  renderLoadingView: function() {
    return (
      <View style={styles.container}>
        <Text>
          Loading flights...
        </Text>
      </View>
    );
  },

  renderFlight: function(flight) {
    return <FlightItem flight={flight}/>;
  },

  onEndReached: function() {
    if (this.state.isLoadingTail) {
      // We're already fetching
      return;
    }

    this.setState({
      isLoadingTail: true
    });

    this.setState({
      isLoadingTail: false
    });

    this.fetchData()
  },

  setUser: function(user) {
    this.setState({
      user: user, 
      skip: 0, 
      loaded: false
    });

    this._data = [];
    this.fetchData();
  }
});

var styles = StyleSheet.create({

  top: {
    paddingTop: 20,
    height: 200,
    backgroundColor: 'white'
  },
  container: {
    flex: 1,
    // remove width and height to override fixed static size
    width: null,
    height: null,
    // make the background transparent so you actually see the image
    backgroundColor: 'transparent',
  },
  listView: {
    backgroundColor: '#0659A9',
  },
});

AppRegistry.registerComponent('JetBlue', () => JetBlue);
