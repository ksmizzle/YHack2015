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

var TagItems = require('./TagItems');
var moment = require('moment');

var FlightItem = React.createClass({
  getInitialState: function() {
    return {
      open: false
    }
  },

  render: function() {
    if (this.state.open) {
      return this.renderOpen();
    } else {
      return this.renderClosed();
    }
  },

  renderClosed: function() {
    return (
      <TouchableOpacity onPress={this.onPress}>
    
        <View style={styles.flightItem}>
          <Text style={styles.price}>${Math.round(this.props.flight.totalfare)}</Text>

          <Text style={[styles.text, styles.origin]}>{this.props.flight.origincode}</Text>

          <Image
            source={{uri: 'http://i.imgur.com/113gexf.png'}} 
            style={styles.arrowLogo} 
          />

          <Text style={[styles.text, styles.destination]}>{this.props.flight.destinationcode}</Text>
          
          <Text style={styles.date}>{moment(this.props.flight.date).format('MMM. D')}</Text>

        </View>

      </TouchableOpacity>
    );
  },

  renderOpen: function() {
    return (
      <TouchableOpacity onPress={this.onPress}>
    
        <View style={[styles.flightItem, styles.flightItemOpen]}>
          <Text style={styles.price}>${Math.round(this.props.flight.totalfare)}</Text>

          <Text style={[styles.text, styles.origin]}>{this.props.flight.origincode}</Text>

          <Image
            source={{uri: 'http://i.imgur.com/113gexf.png'}} 
            style={styles.arrowLogo} 
          />

          <Text style={[styles.text, styles.destination]}>{this.props.flight.destinationcode}</Text>
          
          <Text style={styles.date}>{moment(this.props.flight.date).format('MMM. D')}</Text>

        </View>
        <View style={[styles.flightItem, styles.flightItemOpenMiddle]}>
          <Text style={styles.geographic}>{this.props.flight.destinationgeographicregion}, Nonstop</Text>
        </View>
        <View style={[styles.flightItem, styles.flightItemOpenLower]}>
          <TagItems tags={this.props.flight.destinationtype} />
        </View>
      </TouchableOpacity>
    );
  },

  onPress: function() {
    this.setState({ open: !this.state.open })
  }
});

const WHITE = '#FFFFFF'

var styles = StyleSheet.create({
  text: {
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'DIN-Medium'
  },

  price: {
    color: WHITE,
    fontSize: 20,
    fontWeight: 'bold',
    width: 90,
    paddingLeft: 10,
    fontFamily: 'DIN-Medium',
    paddingTop: 3
  },

  origin: {
    textAlign: 'right',
    width: 50,
    color: WHITE
  },

  destination: {
    textAlign: 'left',
    width: 50,
    color: WHITE
  },

  date: {
    color: WHITE,
    paddingRight: 10,
    flex: 1,
    textAlign: 'right',
    fontFamily: 'DIN-Medium'

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

  flightItemOpen: {
    borderBottomColor: '#0659A9',
    paddingBottom: 0
  },

  flightItemOpenMiddle: {
    borderTopColor: '#0659A9',
    borderBottomColor: '#0659A9',
    paddingBottom: 0
  },

  flightItemOpenLower: {
    borderTopColor: '#0659A9',
  },

  geographic: {
    color: WHITE,
    fontFamily: 'DIN-Medium'
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
  }
});

module.exports = FlightItem