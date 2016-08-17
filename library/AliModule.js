import {NativeModules} from 'react-native';

const Ali = NativeModules.Ali;

export function pay(config:JSON, callback,resultCallback) {
  Weixin.registerApp(config, callback,resultCallback);
}

