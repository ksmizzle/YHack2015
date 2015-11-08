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
  View
} = React;

var FlightItem = require('./FlightItem');

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
      isLoadingTail: false
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

    this.origData = data;
    this.data = data;

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
      <View style={styles.main}>
        <Image source={{uri: 'http://i.imgur.com/duZAEFt.png'}} style={styles.container}>
          <Text>Hello</Text>
        </Image>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderFlight}
          style={styles.listView}
          onEndReached={this.onEndReached}
        />
      </View>
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
      isLoadingTail: false,
      dataSource: this.getDataSource()
    });
  },

  getDataSource: function() {
    this.data = this.data.concat(this.origData);

    return this.state.dataSource.cloneWithRows(this.data);
  }
});

var styles = StyleSheet.create({
  main: {
    paddingTop: 20
  },

  listView: {
    backgroundColor: '#FFF',
  },

  container: {
    paddingTop: 212,
    height: 100,
    flex: 1,
    // remove width and height to override fixed static size
    width: null,
    height: null,
    // make the background transparent so you actually see the image
    backgroundColor: 'transparent',
  }
});

AppRegistry.registerComponent('JetBlue', () => JetBlue);