'use strict';

import React, {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  NativeModules
} from 'react-native';

//import SocialKit from 'react-native-social-kit';

import {Weibo, Weixin, QQ} from 'react-native-social-kit';

export default class Demo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  weiboAuth() {
    Weibo.authorize({
      appId: '3928876547',
      redirectUrl: 'https://api.weibo.com/oauth2/default.html'
    }, (data) => {
      if (data.error) {
        //发生了错误

      } else if (data.cancel) {
        //用户取消了授权
      } else {
        this.setState({
          weiboAuthResult: JSON.stringify(data)
        });
      }
    });
  }

  weixinAuth() {
    Weixin.authorize({
      appId: 'wx1dd0b08688eecaef'
    }, (data) => {
      this.setState({
        weixinAuthResult: JSON.stringify(data)
      });
    });
  }

  qqAuth() {
    QQ.authorize({
      appId: '222222'
    }, (data) => {
      this.setState({
        qqAuthResult: JSON.stringify(data)
      });
    });
  }

  render() {
    return (
      <View
        style={{flex: 1, backgroundColor: 'white', alignItems: 'center'}}>
        <TouchableOpacity
          style={{height: 48, alignItems: 'center', justifyContent: 'center'}}
          onPress={this.weiboAuth.bind(this)}>
          <Text>
            点击获取微博授权
          </Text>
        </TouchableOpacity>
        <View
          style={{borderColor: 'black', borderWidth: 1, margin: 1}}>
          <Text>
            {this.state.weiboAuthResult}
          </Text>
        </View>

        <TouchableOpacity
          style={{height: 48, alignItems: 'center', justifyContent: 'center'}}
          onPress={this.weixinAuth.bind(this)}>
          <Text>
            点击获取微信授权
          </Text>
        </TouchableOpacity>
        <View
          style={{borderColor: 'black', borderWidth: 1,  margin: 1}}>
          <Text>
            {this.state.weixinAuthResult}
          </Text>
        </View>

        <TouchableOpacity
          style={{height: 48, alignItems: 'center', justifyContent: 'center'}}
          onPress={this.qqAuth.bind(this)}>
          <Text>
            点击获取QQ授权
          </Text>
        </TouchableOpacity>
        <View
          style={{borderColor: 'black', borderWidth: 1,  margin: 1}}>
          <Text>
            {this.state.qqAuthResult}
          </Text>
        </View>
      </View>
    );
  }
}