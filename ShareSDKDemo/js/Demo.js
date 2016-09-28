import React ,{Component} from 'react';
import {ScrollView} from 'react-native';

import WeixinSDK from './WeixinDemo';
import WeiboSDK from './WeiboDemo';
import QQSDK from './QQDemo';

export default class Demo extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  render () {
    return(
      <ScrollView>
        <WeixinSDK/>
        <WeiboSDK/>
        <QQSDK/>
      </ScrollView>
    )
  }
}