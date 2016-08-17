import {NativeModules} from 'react-native';

const Weibo = NativeModules.Weibo;

export function registerApp(config:JSON, callback) {
  Weibo.registerApp(config, callback);
}
export function isWeiboAppInstalled(callback) {
  Weibo.isWeiboAppInstalled(callback);
}
export function isCanShareInWeiboAPP(callback) {
  Weibo.isCanShareInWeiboAPP(callback);
}
export function isCanSSOInWeiboApp(callback) {
  Weibo.isCanSSOInWeiboApp(callback);
}
export function openWeiboApp(callback) {
  Weibo.openWeiboApp(callback);
}
export function getWeiboAppInstallUrl(callback) {
  Weibo.getWeiboAppInstallUrl(callback);
}
export function getSDKVersion(callback) {
  Weibo.getSDKVersion(callback);
}
export function authorize(config:JSON, callback) {
  Weibo.authorize(config, callback);
}
export function shareText(config:JSON, callback) {
  Weibo.sendText(config, callback);
}
export function shareImage(config:JSON, callback) {
  Weibo.sendImage(config, callback);
}
export function shareWebPage(config:JSON, callback) {
  Weibo.sendWebPage(config, callback);
}
export function shareMusic(config:JSON, callback) {
  Weibo.sendMusic(config, callback);
}
export function shareVideo(config:JSON, callback) {
  Weibo.sendVideo(config, callback);
}


