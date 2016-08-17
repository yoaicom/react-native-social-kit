import {NativeModules} from 'react-native';

const Weixin = NativeModules.Weixin;

export function registerApp(config:JSON, callback) {
  Weixin.registerApp(config, callback);
}
export function pay(config:JSON, callback) {
  Weixin.pay(config, callback);
}
export function isWXAppInstalled(callback) {
  Weixin.isWXAppInstalled(callback);
}
export function isWXAppSupportApi(callback) {
  Weixin.isWXAppSupportApi(callback);
}
export function getWXAppInstallUrl(callback) {
  Weixin.getWXAppInstallUrl(callback);
}
export function getApiVersion(callback) {
  Weixin.getApiVersion(callback);
}
export function openWXApp(callback) {
  Weixin.openWXApp(callback);
}
export function authorize(config:JSON, callback) {
  Weixin.authorize(config, callback);
}
export function shareText(config:JSON, callback) {
  Weixin.sendText(config, callback);
}
export function shareImage(config:JSON, callback) {
  Weixin.sendImage(config, callback);
}
export function shareWeb(config:JSON, callback) {
  Weixin.sendWeb(config, callback);
}
export function shareMusic(config:JSON, callback) {
  Weixin.sendMusic(config, callback);
}
export function shareVideo(config:JSON, callback) {
  Weixin.sendVideo(config, callback);
}
export function shareApp(config:JSON, callback) {
  Weixin.sendApp(config, callback);
}
export function shareNonGif(config:JSON, callback) {
  Weixin.sendNonGif(config, callback);
}
export function shareGif(config:JSON, callback) {
  Weixin.sendGif(config, callback);
}
export function shareFile(config:JSON, callback) {
  Weixin.sendFile(config, callback);
}
