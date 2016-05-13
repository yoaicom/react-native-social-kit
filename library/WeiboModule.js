'use strict';

import {NativeModules} from 'react-native';

const Weibo = NativeModules.Weibo;

export function authorize(config:JSON, callback) {
  Weibo.authorize(config, callback);
}
