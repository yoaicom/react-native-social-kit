package com.yoai.reactnative.social.qq;

import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.tencent.connect.share.QQShare;
import com.tencent.connect.share.QzoneShare;
import com.tencent.tauth.IUiListener;
import com.tencent.tauth.Tencent;
import com.tencent.tauth.UiError;
import com.yoai.reactnative.social.Utils;

import org.json.JSONObject;

import java.util.ArrayList;

public class QQModule extends ReactContextBaseJavaModule implements ActivityEventListener {

  private static final String TAG = "QQModule";

  private Tencent tencent;
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
  public void registerApp(final String appId, final Callback callback) {
    this.tencent = Tencent.createInstance(appId, getReactApplicationContext().getApplicationContext());
  }

  @ReactMethod
  public void share(final ReadableMap config, final Callback callback) {
    info("share...");
    if (config != null && tencent != null) {
      final WritableMap writableMap = new WritableNativeMap();
      listener = new IUiListener() {
        @Override
        public void onComplete(Object o) {
          writableMap.putBoolean("success", true);
          invokeCallback();
        }

        @Override
        public void onError(UiError uiError) {
          String error = "errorCode=" + uiError.errorCode;
          if (uiError.errorMessage != null) {
            error += ", message=" + uiError.errorMessage;
          }
          if (uiError.errorDetail != null) {
            error += ", detail=" + uiError.errorDetail;
          }
          writableMap.putString("error", error);
          invokeCallback();
        }

        @Override
        public void onCancel() {
          writableMap.putBoolean("cancel", true);
          invokeCallback();
        }

        private void invokeCallback() {
          if (callback != null) {
            callback.invoke(writableMap);
          }
          listener = null;
        }
      };

      final Bundle params = new Bundle();
      if (config.hasKey("title")) {
        params.putString(QQShare.SHARE_TO_QQ_TITLE, config.getString("title"));
      }
      if (config.hasKey("description")) {
        params.putString(QQShare.SHARE_TO_QQ_SUMMARY, config.getString("description"));
      }
      if (config.hasKey("thumb")) {
        params.putString(QQShare.SHARE_TO_QQ_IMAGE_URL, config.getString("thumb"));
      }

      boolean shareToFriends = true;
      if (config.hasKey("webpage")) {
        params.putInt(QQShare.SHARE_TO_QQ_KEY_TYPE, QQShare.SHARE_TO_QQ_TYPE_DEFAULT);
        params.putString(QzoneShare.SHARE_TO_QQ_TARGET_URL, config.getString("webpage"));

        if (config.hasKey("scene") && "qzone".equalsIgnoreCase(config.getString("scene"))) {
          shareToFriends = false; // 分享到QQ空间
          params.putInt(QzoneShare.SHARE_TO_QZONE_KEY_TYPE, QzoneShare.SHARE_TO_QZONE_TYPE_IMAGE_TEXT);

          ArrayList<String> arrayList = new ArrayList<>();
          if (config.hasKey("thumb")) {
            arrayList.add(config.getString("thumb"));
            params.putStringArrayList(QzoneShare.SHARE_TO_QQ_IMAGE_URL, arrayList);
          }
        }
      } else if (config.hasKey("image")) {
        // 分享单张图片
        params.putInt(QQShare.SHARE_TO_QQ_KEY_TYPE, QQShare.SHARE_TO_QQ_TYPE_IMAGE);
        params.putString(QQShare.SHARE_TO_QQ_IMAGE_LOCAL_URL, config.getString("image"));
      } else if (config.hasKey("music")) {
        // 分享音乐
        params.putInt(QQShare.SHARE_TO_QQ_KEY_TYPE, QQShare.SHARE_TO_QQ_TYPE_AUDIO);
        params.putString(QzoneShare.SHARE_TO_QQ_TARGET_URL, config.getString("music"));
        params.putString(QQShare.SHARE_TO_QQ_AUDIO_URL, config.getString("data"));
      }

      if (shareToFriends) {
        tencent.shareToQQ(getCurrentActivity(), params, listener);
      } else {
        tencent.shareToQzone(getCurrentActivity(), params, listener);
      }
    }
  }


  @ReactMethod
  public void authorize(final ReadableMap config, final Callback callback) {
    info("authorize...");

    if (tencent != null) {
      String scope = "";
      if (config != null) {
        if (config.hasKey("scope")) {
          scope = config.getString("scope");
        }
      }

      final WritableMap data = new WritableNativeMap();

      listener = new IUiListener() {
        @Override
        public void onComplete(Object o) {
          data.putBoolean("success", true);
          if (o instanceof JSONObject) {
            JSONObject jsonObject = (JSONObject) o;
            String openId = jsonObject.optString("openid", null);
            String accessToken = jsonObject.optString("access_token", null);
            int expiresInSeconds = jsonObject.optInt("expires_in", 0);
            if (openId != null) {
              data.putString("openId", openId);
            }
            if (accessToken != null) {
              data.putString("accessToken", accessToken);
            }
            if (expiresInSeconds > 0) {
              data.putInt("expiresInSeconds", expiresInSeconds);
            }
          }
          invokeCallback();
        }

        @Override
        public void onError(UiError uiError) {
          String error = "errorCode=" + uiError.errorCode;
          if (uiError.errorMessage != null) {
            error += ", message=" + uiError.errorMessage;
          }
          if (uiError.errorDetail != null) {
            error += ", detail=" + uiError.errorDetail;
          }
          data.putString("error", error);
          invokeCallback();
        }

        @Override
        public void onCancel() {
          data.putBoolean("cancel", true);
          invokeCallback();
        }

        private void invokeCallback() {
          if (callback != null) {
            callback.invoke(data);
          }
          listener = null;
        }
      };
      tencent.login(getCurrentActivity(), scope, listener);
    }
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    if (listener != null) {
      Tencent.onActivityResultData(requestCode, resultCode, data, listener);
    }
  }

  private void info(String msg) {
    Utils.info(TAG, msg);
  }
}
