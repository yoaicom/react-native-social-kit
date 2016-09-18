import {NativeModules} from 'react-native';

const Weibo = NativeModules.Weibo;

export function registerApp(appId:String, callback) {
  Weibo.registerApp(appId, callback);
}

export function openWeiboApp(callback) {
  Weibo.openWeiboApp(callback);
}

export function authorize(config:JSON, callback) {
  Weibo.authorize(config, callback);
}

export function share(config:JSON, callback) {
  Weibo.share(config, callback);
}

