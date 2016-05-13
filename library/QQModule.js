'use strict';

import {NativeModules} from 'react-native';

const QQ = NativeModules.QQ;

export function authorize(config:JSON, callback) {
  QQ.authorize(config, callback);
}
