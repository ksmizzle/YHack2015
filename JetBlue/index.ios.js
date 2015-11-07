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
} = React;

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
    const data = [
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
          destinationType: "Family"
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
          destinationType: "Romance"
        }
      }
    ]

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
    return (
      <View style={styles.flightItem}>
        <Text style={styles.price}>${flight.price}</Text>

        <Text style={[styles.text, styles.origin]}>{flight.tripData.origin.airportCode}</Text>

        <Image
          source={{uri: 'http://i.imgur.com/113gexf.png'}} 
          style={styles.arrowLogo} 
        />

        <Text style={[styles.text, styles.destination]}>{flight.tripData.destination.airportCode}</Text>
        
        <Text style={styles.date}>{flight.date}</Text>
      </View>
    );
  },
});

const WHITE = '#FFFFFF'

var styles = StyleSheet.create({
  text: {
    color: WHITE,
    fontWeight: 'bold'
  },

  price: {
    color: WHITE,
    fontSize: 20,
    fontWeight: 'bold',
    width: 100,
    paddingLeft: 5
  },

  origin: {
    textAlign: 'right',
    width: 50
  },

  destination: {
    textAlign: 'left',
    width: 50
  },

  date: {
    color: WHITE,
    paddingRight: 5,
    flex: 1,
    textAlign: 'right'
  },

  flightItem: {
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0659A9',
    borderWidth: 0.5,
    borderColor: WHITE,
    color: WHITE
  },
  
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },

  arrowLogo: {
    width: 20,
    height: 20,
    marginLeft: 10,
    marginRight: 10
  },

  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
});

AppRegistry.registerComponent('JetBlue', () => JetBlue);