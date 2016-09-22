import React ,{Component} from 'react';
import {ScrollView} from 'react-native';

import WeixinSDK from './WeixinSDK';
import WeiboSDK from './WeiboSDK';
import QQSDK from './QQSDK';

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