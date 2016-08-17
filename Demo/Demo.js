'use strict';

import React, {
  Component
} from 'react';
import {
  View,
  Text,
  Navigator
} from 'react-native';

import Home from './Home';

export default class Demo1 extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    let defaultName = 'homePage';
    let defaultComponent = Home;
    return (
      <Navigator
        initialRoute={{name:defaultName,component:defaultComponent}}
        configureScene={(route) => {
          return Navigator.SceneConfigs.HorizontalSwipeJumpFromRight;
        }}
        renderScene={(route,navigator) => {
          let Component = route.component;
          return (
            <Component
              {...route.params}
              navigator = {navigator}
            />
          )
        }}
      />
    )
  }
}

