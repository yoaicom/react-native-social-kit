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
        <TouchableOpacity
          onPress={this.shareImage.bind(this)}
          style={{height: 50, alignItems: 'center', justifyContent: 'center'}}>
          <Text>分享图片</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.shareMusic.bind(this)}
          style={{height: 50, alignItems: 'center', justifyContent: 'center'}}>
          <Text>分享音乐</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.shareApp.bind(this)}
          style={{height: 50, alignItems: 'center', justifyContent: 'center'}}>
          <Text>分享应用</Text>
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
      url: 'http://www.baidu.com',
      thumb: 'http://static.yoaicdn.com/shoppc/images/head_jiang_d37ff69.png',
      //image: '/storage/emulated/0/sina/weibo/weibo/1.jpg',
      //audio: 'http://so1.111ttt.com:8282/2016/1/09/12/202121628190.mp3?tflag=1473670058&pin=a3471cd1a4c7e2abddb3e44d89c88cf7&ip=219.237.242.22'
    }, this.callback);
  }

  shareImage() {
    QQ.shareImage({
      image: '/storage/emulated/0/sina/weibo/weibo/1.jpg'
    }, this.callback);
  }

  shareMusic() {
    QQ.shareMusic({
      title: 'This is a title',
      description: 'This is a description',
      url: 'http://www.weibo.com',
      image: 'http://static.yoaicdn.com/shoppc/images/banner1_27511cd.jpg@!yoai_img_max',
      audio: 'http://www.baidu.com'
    }, this.callback);
  }

  shareApp() {
    QQ.shareApp({
      title: 'This is a title',
      description: 'This is a description',
      image: 'http://static.yoaicdn.com/shoppc/images/banner1_27511cd.jpg@!yoai_img_max',
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

