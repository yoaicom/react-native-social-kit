/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Demo from './SocialKitDemo';

class demo extends Component {
  render() {
    return (
      <Demo />
    );
  }
}

AppRegistry.registerComponent('demo', () => demo);
