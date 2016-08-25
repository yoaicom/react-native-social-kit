/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
  AppRegistry,
} from 'react-native';

import Demo from './Demo';
import WeixinDemo from './js/WeixinDemo';

class demo extends Component {
  render() {
    return (
      <WeixinDemo/>
    );
  }
}

AppRegistry.registerComponent('demo', () => demo);