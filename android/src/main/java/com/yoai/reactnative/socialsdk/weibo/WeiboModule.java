package com.yoai.reactnative.socialsdk.weibo;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.sina.weibo.sdk.auth.AuthInfo;
import com.sina.weibo.sdk.auth.WeiboAuthListener;
import com.sina.weibo.sdk.auth.sso.SsoHandler;
import com.sina.weibo.sdk.exception.WeiboException;
import com.yoai.reactnative.socialsdk.Utils;

public class WeiboModule extends ReactContextBaseJavaModule implements ActivityEventListener{

  private static final String TAG = "WeiboModule";

  private SsoHandler ssoHandler;

  public WeiboModule(ReactApplicationContext reactContext) {
    super(reactContext);

    // Do we need to remove the listener later?
    reactContext.addActivityEventListener(this);
  }

  @Override
  public String getName() {
    return "Weibo";
  }

  @ReactMethod
  public void authorize(final ReadableMap config, final Callback result) {
    info("authorize...");

    if (config == null) {
      Log.e(TAG, "authorize...missing config");
      return;
    }

    if(!config.hasKey("appKey")) {
      Log.e(TAG, "authorize...missing appKey");
      return;
    }
    String appKey = config.getString("appKey");

    if(!config.hasKey("redirectUrl")) {
      Log.e(TAG, "authorize...missing redirectUrl");
      return;
    }
    String redirectUrl = config.getString("redirectUrl");

    String scope = "";
    if(!config.hasKey("scope")) {
      Log.i(TAG, "authorize...using empty scope");
    } else {
      scope = config.getString("scope");
    }

    AuthInfo authInfo = new AuthInfo(getCurrentActivity(), appKey, redirectUrl, scope);
    this.ssoHandler = new SsoHandler(getCurrentActivity(), authInfo);
    this.ssoHandler.authorize(new WeiboAuthListener() {
      @Override
      public void onComplete(Bundle bundle) {
        Log.d(TAG, "onComplete...bundle=" + bundle);
        if(bundle != null) {
          String userName = bundle.getString("userName");
          String uid = bundle.getString("uid");
          String access_token = bundle.getString("access_token");
          String refresh_token = bundle.getString("refresh_token");
          String expires_in = bundle.getString("expires_in");

          WritableMap writableMap = new WritableNativeMap();
          writableMap.putString("username", userName);
          writableMap.putString("uid", uid);
          writableMap.putString("accessToken", access_token);
          writableMap.putString("refreshToken", refresh_token);
          writableMap.putString("expiresInSec", expires_in);

          if(result != null) {
            result.invoke(writableMap);
          }
        } else {
          Log.e(TAG, "onComplete...null data from weibo");
        }
      }

      @Override
      public void onWeiboException(WeiboException e) {
        Log.e(TAG, "onWeiboException...");

        WritableMap writableMap = new WritableNativeMap();
        writableMap.putString("error", e != null ? e.getMessage() : "unknown error");
        if(result != null) {
          result.invoke(writableMap);
        }
      }

      @Override
      public void onCancel() {
        Log.d(TAG, "onCancel...");
        WritableMap writableMap = new WritableNativeMap();
        writableMap.putBoolean("cancel", true);
        if(result != null) {
          result.invoke(writableMap);
        }
      }
    });
  }

  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    if (ssoHandler != null) {
      ssoHandler.authorizeCallBack(requestCode, resultCode, data);
    }
  }

  private void info(String msg) {
    Utils.info(TAG, msg);
  }
}
