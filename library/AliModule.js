import {NativeModules} from 'react-native';

const Ali = NativeModules.Ali;

export function pay(config:JSON, callback,resultCallback) {
  Ali.pay(config, callback,resultCallback);
}

