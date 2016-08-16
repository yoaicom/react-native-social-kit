'use strict';

import React, {
  Component
} from 'react';
import {
  View,
  Text,
  PixelRatio,
  Image
} from 'react-native';

let resolveAssetSource = require('resolveAssetSource');

import sdk from 'react-native-social-kit';
import WeixinSDK from './WeixinSDK';
import WeiboSDK from './WeiboSDK';
import QQSDK from './QQSDK';

var Weixin = sdk.Weixin;
var Weibo = sdk.Weibo;
var QQ = sdk.QQ;

let path = require('./jpg/res2.jpg');
let thumbImage = "file://" + resolveAssetSource(path).uri;
let thumbnail = resolveAssetSource(path).uri;
let imageUrl = resolveAssetSource(require('./jpg/tampon0.jpg')).uri;
let imageUrl1 = resolveAssetSource(require('./jpg/tampon1.jpg')).uri;
let imageUrl2 = resolveAssetSource(require('./jpg/tampon2.jpg')).uri;
let imageUrl3 = resolveAssetSource(require('./jpg/tampon3.jpg')).uri;

export default class Demo1 extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  render () {
    return(
      <QQSDK/>
    )
  }
}

