package com.yoai.reactnative.social;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.yoai.reactnative.social.qq.QQModule;
import com.yoai.reactnative.social.weibo.WeiboModule;
import com.yoai.reactnative.social.weixin.WeixinModule;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class SocialPackage implements ReactPackage {

  @Override
  public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
    return Arrays.<NativeModule>asList(
      new WeixinModule(reactContext),
      new WeiboModule(reactContext),
      new QQModule(reactContext)
    );
  }

  @Override
  public List<Class<? extends JavaScriptModule>> createJSModules() {
    return Collections.emptyList();
  }

  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    return Collections.emptyList();
  }
}
