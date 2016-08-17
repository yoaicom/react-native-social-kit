import React, {Component} from 'react';
import {View, Text, TouchableOpacity, PixelRatio, StyleSheet} from 'react-native';

import WeixinSDK from  './WeixinSDK';
import WeiboSDK from './WeiboSDK';
import QQSDK from './QQSDK';


import sdk from 'react-native-social-kit';
let Ali = sdk.Ali;


export default class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <View
        style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor: 'white'}}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={this.weixinPress.bind(this)}
        >
          <Text
            style={styles.text}
          >微信</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={this.weiboPress.bind(this)}
        >
          <Text
            style={styles.text}
          >微博</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={this.qqPress.bind(this)}
        >
          <Text
            style={styles.text}
          >QQ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={this.aliPress.bind(this)}
        >
          <Text
            style={styles.text}
          >Ali</Text>
        </TouchableOpacity>
      </View>
    )
  }

  weixinPress() {
    const {navigator} = this.props;

    if (navigator) {
      navigator.push({
        name: 'WeixinSDK',
        component: WeixinSDK,
        params: {
          title: '微信'
        }
      })
    }
  }

  weiboPress() {
    const {navigator} = this.props;

    if (navigator) {
      navigator.push({
        name: 'WeiboSDK',
        component: WeiboSDK,
        params: {
          title: '微博'
        }
      })
    }
  }

  qqPress() {
    const {navigator} = this.props;

    if (navigator) {
      navigator.push({
        name: 'QQSDK',
        component: QQSDK,
        params: {
          title: 'QQ'
        }
      })
    }
  }

  aliPress() {
    Ali.pay({} ,
      (data) => {console.log(JSON.stringify(data));},
      (data) => {console.log(JSON.stringify((data)));}
    )
  }

}

var styles = StyleSheet.create({
  button: {
    width: 300,
    height: 50,
    backgroundColor: 'green',
    justifyContent: 'space-around',
    borderWidth: 1 / PixelRatio.get(),
    marginBottom: 5
  },
  text: {fontSize: 25, fontWeight: 'bold', alignSelf: 'center'}
})