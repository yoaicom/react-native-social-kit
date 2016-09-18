import {NativeModules} from 'react-native';

const QQ = NativeModules.QQ;

export function registerApp(appId:String, callback) {
  QQ.registerApp(appId, callback);
}

export function authorize(config:JSON, callback) {
  QQ.authorize(config, callback);
}

export function share(config:JSON, callback) {
  QQ.share(config, callback);
}