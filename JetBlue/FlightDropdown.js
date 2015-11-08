/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
var React = require('react-native');
var {
  Component,
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;

var DropDown = require('react-native-dropdown');
var {
  Select,
  Option,
  OptionList,
  updatePosition
} = DropDown;

var FlightDropdown = React.createClass({
  componentDidMount: function() {
    updatePosition(this.refs['SELECT1']);

    updatePosition(this.refs['OPTIONLIST']);
  },

  _getOptionList: function() {
    return this.refs['OPTIONLIST'];
  },

  _user: function(user) {
    this.props.setUser(user);
  },

  render: function() {
    return (
      <View style={{ marginTop: 10, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
        <Select
          width={250}
          ref="SELECT1"
          optionListRef={this._getOptionList}
          defaultValue="user1"
          onSelect={this._user}>
          <Option>user1</Option>
          <Option>user2</Option>
          <Option>user3</Option>
        </Select>
        <OptionList ref="OPTIONLIST"/>
      </View>
    );
  }
});

module.exports = FlightDropdown