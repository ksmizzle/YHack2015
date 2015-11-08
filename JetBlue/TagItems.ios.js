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

var TagItem = require('./TagItem');

var TagItems = React.createClass({
  render: function() {
    return (
      <View style={styles.items}>
        {this.props.tags.map(function(tag) {
          return <TagItem tag={tag} />;
        })}
      </View>
    );
  }
});

const WHITE = '#FFFFFF'

var styles = StyleSheet.create({
  items: {
    flexDirection: 'row'
  }
});

module.exports = TagItems