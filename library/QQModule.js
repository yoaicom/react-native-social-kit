'use strict';

import {NativeModules} from 'react-native';

const QQ = NativeModules.QQ;

export function registerApp(config:JSON, callback) {
  QQ.registerApp(config, callback);
}
export function iphoneQQInstalled(callback) {
  QQ.iphoneQQInstalled(callback);
}
export function iphoneQQSupportSSOLogin(callback) {
  QQ.iphoneQQSupportSSOLogin(callback);
}
export function iphoneQZoneInstalled(callback) {
  QQ.iphoneQZoneInstalled(callback);
}
export function iphoneQZoneSupportSSOLogin(callback) {
  QQ.iphoneQZoneSupportSSOLogin(callback);
}
export function sdkVersion(callback) {
  QQ.sdkVersion(callback);
}
export function sdkSubVersion(callback) {
  QQ.sdkSubVersion(callback);
}
export function iphoneQQVersion(callback) {
  QQ.iphoneQQVersion(callback);
}
export function authorize(config:JSON, callback) {
  QQ.authorize(config, callback);
}
export function shareText(config:JSON, callback) {
  QQ.sendText(config, callback);
}
export function shareImage(config:JSON, callback) {
  QQ.sendImage(config, callback);
}
export function shareImageArray(config:JSON, callback) {
  QQ.sendImageArray(config, callback);
}
export function shareWebPage(config:JSON, callback) {
  QQ.sendWebPage(config, callback);
}
export function shareMusic(config:JSON, callback) {
  QQ.sendMusic(config, callback);
}
export function shareVideo(config:JSON, callback) {
  QQ.sendVideo(config, callback);
}

