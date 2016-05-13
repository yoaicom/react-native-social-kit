package com.yoai.reactnative.socialsdk.qq;

import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.tencent.connect.common.Constants;
import com.tencent.tauth.IUiListener;
import com.tencent.tauth.Tencent;
import com.tencent.tauth.UiError;
import com.yoai.reactnative.socialsdk.Utils;

import org.json.JSONObject;

public class QQModule extends ReactContextBaseJavaModule implements ActivityEventListener {

  private static final String TAG = "QQModule";

  private IUiListener listener;

  public QQModule(ReactApplicationContext reactContext) {
    super(reactContext);

    // Do we need to remove the listener later?
    reactContext.addActivityEventListener(this);

  }

  @Override
  public String getName() {
    return "QQ";
  }

  @ReactMethod
  public void authorize(final ReadableMap config, final Callback result) {
    info("authorize...");

    if (config == null) {
      Log.e(TAG, "authorize...missing config");
      return;
    }

    if (!config.hasKey("appId")) {
      Log.e(TAG, "authorize...missing appId");
      return;
    }
    String appId = config.getString("appId");

    String scope = "";
    if (!config.hasKey("scope")) {
      Log.i(TAG, "authorize...using empty scope");
    } else {
      scope = config.getString("scope");
    }

    final WritableMap data = new WritableNativeMap();

    this.listener = new IUiListener() {
      @Override
      public void onComplete(Object o) {
        if (o instanceof JSONObject) {
          JSONObject jsonObject = (JSONObject) o;
          String openId = jsonObject.optString("openid", null);
          String accessToken = jsonObject.optString("access_token", null);
          int expiresInSec = jsonObject.optInt("expires_in", 0);
          if (openId != null) {
            data.putString("openId", openId);
          }
          if (accessToken != null) {
            data.putString("accessToken", accessToken);
          }
          if (expiresInSec > 0) {
            data.putInt("expiresInSec", expiresInSec);
          }
        }
        result.invoke(data);
      }

      @Override
      public void onError(UiError uiError) {
        Log.e(TAG, "onError..." + uiError.errorMessage + " " + uiError.errorDetail + " " + uiError.errorCode);
        String error = "errorCode=" + uiError.errorCode;
        if (uiError.errorMessage != null) {
          error += ", message=" + uiError.errorMessage;
        }
        if (uiError.errorDetail != null) {
          error += ", detail=" + uiError.errorDetail;
        }
        data.putString("error", error);
        result.invoke(data);
      }

      @Override
      public void onCancel() {
        Log.d(TAG, "onCancel...");
        data.putBoolean("cancel", true);
        result.invoke(data);
      }
    };
    Tencent tencent = Tencent.createInstance(appId, getReactApplicationContext().getApplicationContext());
    tencent.login(getCurrentActivity(), scope, this.listener);
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    if (this.listener != null) {
      if (requestCode == Constants.REQUEST_LOGIN) {
        Tencent.handleResultData(data, this.listener);
        this.listener = null;
      }
    }
  }

  private void info(String msg) {
    Utils.info(TAG, msg);
  }
}
