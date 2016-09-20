'use strict';

import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';

import {Weibo} from 'react-native-social-kit';

export default class Demo extends Component {


  componentDidMount() {
    Weibo.registerApp('2641053562', this.callback);
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
          onPress={this.openWeiboApp.bind(this)}
          style={{height: 50, alignItems: 'center', justifyContent: 'center'}}>
          <Text>打开微博</Text>
        </TouchableOpacity>

      </View>
    );
  }

  auth() {
    Weibo.authorize({
      scope: ''
    }, this.callback);
  }

  share() {
    Weibo.share({
      text: 'Hello World, 你好!',
      image: 'http://static.yoaicdn.com/shoppc/images/cover_img_e1e9e6b.jpg',
      // video: 'http://www.yoai.com/know_tampons.html',
      title: '这是一个音乐标题',
      description: '这是一个描述',
      thumb: 'http://tva4.sinaimg.cn/crop.0.0.180.180.50/6306d074jw1e8qgp5bmzyj2050050aa8.jpg',
      // thumb: thumbnail,
      // webpage: 'http://www.baidu.com',
      // music: 'http://www.baidu.com',
      //data: 'http://so1.111ttt.com:8282/2016/1/09/12/202121628190.mp3',
      data: 'http://v.yoai.com/femme_tampon_tutorial.mp4',
      // duration: 100
    }, this.callback);
  }

  openWeiboApp() {
    Weibo.openWeiboApp(this.callback);
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

