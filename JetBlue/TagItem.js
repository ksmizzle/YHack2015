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

var TagItem = React.createClass({
  render: function() {
    return (
      <View>
        <Text style={styles.text}>{this.props.tag}</Text>
      </View>
    );
  }
});

const WHITE = '#FFFFFF'

var styles = StyleSheet.create({
  text: {
    backgroundColor: 'orange',
    color: WHITE,
    fontFamily: 'DIN-Medium',
    marginLeft: 5,
    marginRight: 5,
    padding: 5,
    borderRadius: 2,
    fontSize: 11
  }
});

module.exports = TagItem