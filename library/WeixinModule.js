import {NativeModules} from 'react-native';
const Weixin = NativeModules.Weixin;

export function registerApp(appId:String, callback) {
  Weixin.registerApp(appId, callback);
}

export function pay(config:JSON, callback) {
  Weixin.pay(config, callback);
}

export function openWeixinApp(callback) {
  Weixin.openWeixinApp(callback);
}

export function authorize(config:JSON, callback) {
  Weixin.authorize(config, callback);
}

export function share(config:JSON, callback) {
  Weixin.share(config, callback);
}