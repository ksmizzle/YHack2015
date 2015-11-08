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
  TouchableOpacity
} = React;

var FlightItem = require('./FlightItem');

var Testing = require('react-native').NativeModules.Testing;
Testing.addEvent();

var API_KEY = '7waqfqbprs7pajbz28mqf6vz';
var API_URL = 'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json';
var PAGE_SIZE = 25;
var PARAMS = '?apikey=' + API_KEY + '&page_limit=' + PAGE_SIZE;
var REQUEST_URL = API_URL + PARAMS;

var JetBlue = React.createClass({
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
    };
  },

  componentDidMount: function() {
    this.fetchData();
  },

  fetchData: function() {
    let data = [
      {
        date: "Jan. 19",
        price: 249,
        tripData: {
          origin: {
            airportCode: "BOS",
            geographicRegion: "Northeast",
            marketGroup: "East Coast"
          },
          destination: {
            airportCode: "IAD",
            geographicRegion: "Mid-Atlantic",
            marketGroup: "East Coast"
          },
          destinationType: ["Family", "Exploration", "Beach"],
          layover: "Nonstop"
        }
      },
      {
        date: "Feb. 4",
        price: 125,
        tripData: {
          origin: {
            airportCode: "ORD",
            geographicRegion: "Midwest",
            marketGroup: "Middle"
          },
          destination: {
            airportCode: "SFO",
            geographicRegion: "California",
            marketGroup: "West Coast"
          },
          destinationType: ["Romance", "Nightlife"],
          layover: "Nonstop"
        }
      }
    ]

    data = data.concat(data)
    data = data.concat(data)
    data = data.concat(data)
    data = data.concat(data)
    data = data.concat(data)


    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(data),
      loaded: true
    })

    /*
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.movies),
          loaded: true,
        });
      })
      .done();
      */
  },

  render: function() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderMovie}
        style={styles.listView}
      />
    );
  },

  renderLoadingView: function() {
    return (
      <View style={styles.container}>
        <Text>
          Loading movies...
        </Text>
      </View>
    );
  },

  renderMovie: function(flight) {
    return <FlightItem flight={flight}/>;
  },
});

var styles = StyleSheet.create({
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  }
});

AppRegistry.registerComponent('JetBlue', () => JetBlue);