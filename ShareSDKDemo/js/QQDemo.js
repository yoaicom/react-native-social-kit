'use strict';

import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';

import {QQ} from 'react-native-social-kit';

export default class Demo extends Component {


  componentDidMount() {
    QQ.registerApp('222222', this.callback);
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <TouchableOpacity
          onPress={this.auth.bind(this)}
          style={{height: 50, alignItems: 'center', justifyContent: 'center'}}>
          <Text>用户授权</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.share.bind(this)}
          style={{height: 50, alignItems: 'center', justifyContent: 'center'}}>
          <Text>分享</Text>
        </TouchableOpacity>
      </View>
    );
  }

  auth() {
    QQ.authorize(null, this.callback);
  }

  share() {
    QQ.share({
      scene: 'qzone',
      title: 'This is a title',
      description: 'This is a description',
      thumb: 'http://static.yoaicdn.com/shoppc/images/head_jiang_d37ff69.png',
      //webpage: 'http://www.baidu.com',
      //image: '/storage/emulated/0/sina/weibo/weibo/1.jpg',
      music: 'http://www.baidu.com',
      data: 'http://so1.111ttt.com:8282/2016/1/09/12/202121628190.mp3'
    }, this.callback);
  }

  callback(result) {
    console.log("result..." + JSON.stringify(result));
    setTimeout(() => {
      Alert.alert(
        'Alert',
        JSON.stringify(result),
        [
          {text: 'OK'}
        ]
      );
    }, 1000);
  }
}
