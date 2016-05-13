'use strict';

import {NativeModules} from 'react-native';

const Weixin = NativeModules.Weixin;

export function authorize(config:JSON, callback) {
  Weixin.authorize(config, callback);
}
