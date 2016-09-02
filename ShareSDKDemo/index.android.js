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
import WeiboDemo from './js/WeiboDemo';

class demo extends Component {
  render() {
    return (
      <WeiboDemo />
    );
  }
}

AppRegistry.registerComponent('demo', () => demo);