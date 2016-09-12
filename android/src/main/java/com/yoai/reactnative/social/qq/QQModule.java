package com.yoai.reactnative.social.qq;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.tencent.connect.common.Constants;
import com.tencent.connect.share.QQShare;
import com.tencent.connect.share.QzoneShare;
import com.tencent.tauth.IUiListener;
import com.tencent.tauth.Tencent;
import com.tencent.tauth.UiError;
import com.yoai.reactnative.social.Utils;

import org.json.JSONObject;

import java.lang.reflect.Array;
import java.util.ArrayList;

public class QQModule extends ReactContextBaseJavaModule implements ActivityEventListener {

  private static final String TAG = "QQModule";

  private Tencent tencent;
  private IUiListener listener;
  private IUiListener shareListener;

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
      this.shareListener = new IUiListener() {
        @Override
        public void onComplete(Object o) {
          writableMap.putBoolean("success", true);
          invokeCallback();
        }

        @Override
        public void onError(UiError uiError) {
          writableMap.putString("error", "errorCode=" + uiError.errorCode + " " + uiError.errorMessage);
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
        }
      };

      final Bundle params = new Bundle();
      if (config.hasKey("title")) {
        params.putString(QQShare.SHARE_TO_QQ_TITLE, config.getString("title"));
      }
      if (config.hasKey("description")) {
        params.putString(QQShare.SHARE_TO_QQ_SUMMARY, config.getString("description"));
      }
      if (config.hasKey("url")) {
        params.putString(QzoneShare.SHARE_TO_QQ_TARGET_URL, config.getString("url"));
      }
      if (config.hasKey("thumb")) {
        params.putString(QQShare.SHARE_TO_QQ_IMAGE_URL, config.getString("thumb"));
      }

      boolean shareToFriends = true;
      if (config.hasKey("image")) {
        // 分享单张图片
        params.putInt(QQShare.SHARE_TO_QQ_KEY_TYPE, QQShare.SHARE_TO_QQ_TYPE_IMAGE);
        params.putString(QQShare.SHARE_TO_QQ_IMAGE_LOCAL_URL, config.getString("image"));
      } else if (config.hasKey("audio")) {
        // 分享音乐
        params.putInt(QQShare.SHARE_TO_QQ_KEY_TYPE, QQShare.SHARE_TO_QQ_TYPE_AUDIO);
        params.putString(QQShare.SHARE_TO_QQ_AUDIO_URL, config.getString("audio"));

      } else {
        if (config.hasKey("scene") && "qzone".equalsIgnoreCase(config.getString("scene"))) {
          shareToFriends = false; // 分享到QQ空间
          params.putInt(QzoneShare.SHARE_TO_QZONE_KEY_TYPE, QzoneShare.SHARE_TO_QZONE_TYPE_IMAGE_TEXT);

          ArrayList<String> arrayList = new ArrayList<>();
          if (config.hasKey("thumb")) {
            arrayList.add(config.getString("thumb"));
            params.putStringArrayList(QzoneShare.SHARE_TO_QQ_IMAGE_URL, arrayList);
          }
        } else {
          params.putInt(QQShare.SHARE_TO_QQ_KEY_TYPE, QQShare.SHARE_TO_QQ_TYPE_DEFAULT);
        }
      }

      if (shareToFriends) {
        tencent.shareToQQ(getCurrentActivity(), params, this.shareListener);
      } else {
        tencent.shareToQzone(getCurrentActivity(), params, this.shareListener);
      }
    }
  }

  @ReactMethod
  public void shareImage(final ReadableMap config, final Callback callback) {
    info("shareImage...");
    if (config != null && tencent != null) {
      Bundle params = new Bundle();
      params.putInt(QQShare.SHARE_TO_QQ_KEY_TYPE, QQShare.SHARE_TO_QQ_TYPE_IMAGE);
      params.putString(QQShare.SHARE_TO_QQ_IMAGE_LOCAL_URL, config.getString("image"));

      this.shareListener = new IUiListener() {
        @Override
        public void onComplete(Object o) {
          Log.d(TAG, "onComplete..." + o.toString());
        }

        @Override
        public void onError(UiError uiError) {
          Log.e(TAG, "onError..." + uiError.errorMessage + " " + uiError.errorDetail + " " + uiError.errorCode);
        }

        @Override
        public void onCancel() {
          Log.d(TAG, "onCancel...");
        }
      };
      tencent.shareToQQ(getCurrentActivity(), params, this.shareListener);
    }
  }

  @ReactMethod
  public void shareMusic(final ReadableMap config, final Callback callback) {
    info("shareMusic...");
    if (config != null && tencent != null) {
      final Bundle params = new Bundle();
      params.putInt(QQShare.SHARE_TO_QQ_KEY_TYPE, QQShare.SHARE_TO_QQ_TYPE_AUDIO);
      params.putString(QQShare.SHARE_TO_QQ_TITLE, config.getString("title"));
      params.putString(QQShare.SHARE_TO_QQ_SUMMARY, config.getString("description"));
      params.putString(QQShare.SHARE_TO_QQ_TARGET_URL, config.getString("url"));
      params.putString(QQShare.SHARE_TO_QQ_IMAGE_URL, config.getString("image"));
      params.putString(QQShare.SHARE_TO_QQ_AUDIO_URL, config.getString("audio"));

      this.shareListener = new IUiListener() {
        @Override
        public void onComplete(Object o) {
          Log.d(TAG, "onComplete..." + o.toString());
        }

        @Override
        public void onError(UiError uiError) {
          Log.e(TAG, "onError..." + uiError.errorMessage + " " + uiError.errorDetail + " " + uiError.errorCode);
        }

        @Override
        public void onCancel() {
          Log.d(TAG, "onCancel...");
        }
      };
      tencent.shareToQQ(getCurrentActivity(), params, this.shareListener);
    }
  }

  @ReactMethod
  public void shareApp(final ReadableMap config, final Callback callback) {
    info("shareApp...");
    if (config != null && tencent != null) {
      final Bundle params = new Bundle();
      params.putInt(QQShare.SHARE_TO_QQ_KEY_TYPE, QQShare.SHARE_TO_QQ_TYPE_APP);
      params.putString(QQShare.SHARE_TO_QQ_TITLE, config.getString("title"));
      params.putString(QQShare.SHARE_TO_QQ_SUMMARY, config.getString("description"));
      params.putString(QQShare.SHARE_TO_QQ_IMAGE_URL, config.getString("image"));

      this.shareListener = new IUiListener() {
        @Override
        public void onComplete(Object o) {
          Log.d(TAG, "onComplete..." + o.toString());
        }

        @Override
        public void onError(UiError uiError) {
          Log.e(TAG, "onError..." + uiError.errorMessage + " " + uiError.errorDetail + " " + uiError.errorCode);
        }

        @Override
        public void onCancel() {
          Log.d(TAG, "onCancel...");
        }
      };
      tencent.shareToQQ(getCurrentActivity(), params, this.shareListener);
    }
  }

  @ReactMethod
  public void authorize(final ReadableMap config, final Callback result) {
    info("authorize...");

    if (tencent != null) {
      String scope = "";
      if (config != null) {
        if (config.hasKey("scope")) {
          scope = config.getString("scope");
        }
      }

      final WritableMap data = new WritableNativeMap();

      this.listener = new IUiListener() {
        @Override
        public void onComplete(Object o) {
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
      tencent.login(getCurrentActivity(), scope, this.listener);
    }
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    info("onActivityResult...requestCode=" + requestCode);
    if (this.listener != null) {
      if (requestCode == Constants.REQUEST_LOGIN) {
        Tencent.handleResultData(data, this.listener);
        this.listener = null;
      }
    }

    Tencent.onActivityResultData(requestCode, resultCode, data, this.shareListener);
  }

  private ArrayList<String> toStringArrayList(ReadableArray readableArray) {
    ArrayList<String> ret = new ArrayList<>();
    if (readableArray != null) {
      for (int i = 0; i < readableArray.size(); i++) {
        ret.add(readableArray.getString(i));
      }
    }
    return ret;
  }

  private void info(String msg) {
    Utils.info(TAG, msg);
  }
}
