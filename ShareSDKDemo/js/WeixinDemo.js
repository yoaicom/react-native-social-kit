'use strict';

import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';

import {Weixin} from 'react-native-social-kit';

import resolveAssetSource from 'resolveAssetSource';

export default class Demo extends Component {

  componentDidMount() {
    Weixin.registerApp('wx1dd0b08688eecaef', this.callback);
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
          onPress={this.shareText.bind(this)}
          style={{height: 50, alignItems: 'center', justifyContent: 'center'}}>
          <Text>文字分享</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.shareImage.bind(this)}
          style={{height: 50, alignItems: 'center', justifyContent: 'center'}}>
          <Text>图片分享</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.shareMusic.bind(this)}
          style={{height: 50, alignItems: 'center', justifyContent: 'center'}}>
          <Text>音乐分享</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.shareVideo.bind(this)}
          style={{height: 50, alignItems: 'center', justifyContent: 'center'}}>
          <Text>视频分享</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.shareWebpage.bind(this)}
          style={{height: 50, alignItems: 'center', justifyContent: 'center'}}>
          <Text>网页分享</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.pay.bind(this)}
          style={{height: 50, alignItems: 'center', justifyContent: 'center'}}>
          <Text>支付</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.openWeixinApp.bind(this)}
          style={{height: 50, alignItems: 'center', justifyContent: 'center'}}>
          <Text>打开微信</Text>
        </TouchableOpacity>
      </View>
    );
  }

  shareText() {
    Weixin.share({
      text: 'Hello World, 你好!',
      //scene: 'session'
      //scene: 'favorite'
      //scene: 'timeline'
    }, this.callback);
  }

  shareImage() {
    Weixin.share({
      image: "file://" +resolveAssetSource(require('./image/femme.jpg')).uri,
      scene: 'session'
    }, this.callback);
  }

  shareMusic() {
    Weixin.share({
      music: 'http://www.baidu.com',
      data: 'http://so1.111ttt.com:8282/2016/1/09/12/202121628190.mp3',
      title: 'Take Me Back',
      description: 'Christopher / Matom',
      scene: 'session',
      thumb: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000001XhYUk0mBpQf.jpg'
    }, this.callback);
  }

  shareVideo() {
    Weixin.share({
      video: 'http://v.yoai.com/femme_tampon_tutorial.mp4',
      title: '非秘棉条使用教学',
      description: '90秒学会',
      scene: 'session',
      thumb: 'http://static.yoaicdn.com/shoppc/images/cover_img_e1e9e6b.jpg'
    }, this.callback);
  }

  shareWebpage() {
    Weixin.share({
      webpage: 'http://www.yoai.com',
      title: '有爱商城',
      description: '一家着眼于日常生活的科技公司',
      scene: 'session',
      thumb: 'http://static.yoaicdn.com/shoppc/images/banner5_9005f94.jpg@!yoai_img_middle'
    }, this.callback);
  }

  auth() {
    Weixin.authorize(null, this.callback);
  }

  pay() {
    Weixin.pay({
      appId: 'wxb4ba3c02aa476ea1',
      partnerId: '1305176001',
      prepayId: 'wx20160825110537d87d6c1bc40918186006',
      package: 'Sign=WXPay',
      nonceStr: '66b7fef4fe75bbebb3b8685fd6939234',
      timeStamp: '1472094337',
      sign: '616424E003D84D6876B8F5E5F5D3CD17'
    }, this.callback);
  }

  openWeixinApp() {
    Weixin.openWeixinApp(this.callback);
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

