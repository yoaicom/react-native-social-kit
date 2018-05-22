package com.yoai.reactnative.social.weibo;

import android.app.Activity;
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
import com.sina.weibo.sdk.api.BaseMediaObject;
import com.sina.weibo.sdk.api.ImageObject;
import com.sina.weibo.sdk.api.MusicObject;
import com.sina.weibo.sdk.api.TextObject;
import com.sina.weibo.sdk.api.VideoObject;
import com.sina.weibo.sdk.api.WebpageObject;
import com.sina.weibo.sdk.api.WeiboMultiMessage;
import com.sina.weibo.sdk.api.share.BaseResponse;
import com.sina.weibo.sdk.api.share.IWeiboHandler;
import com.sina.weibo.sdk.api.share.IWeiboShareAPI;
import com.sina.weibo.sdk.api.share.SendMessageToWeiboResponse;
import com.sina.weibo.sdk.api.share.SendMultiMessageToWeiboRequest;
import com.sina.weibo.sdk.api.share.WeiboShareSDK;
import com.sina.weibo.sdk.auth.AuthInfo;
import com.sina.weibo.sdk.auth.WeiboAuthListener;
import com.sina.weibo.sdk.auth.sso.SsoHandler;
import com.sina.weibo.sdk.constant.WBConstants;
import com.sina.weibo.sdk.exception.WeiboException;
import com.sina.weibo.sdk.utils.Utility;
import com.yoai.reactnative.social.Utils;

import static com.yoai.reactnative.social.Utils.*;

public class WeiboModule extends ReactContextBaseJavaModule implements ActivityEventListener {

  private static final String TAG = "WeiboModule";

  private volatile String appKey;
  private volatile SsoHandler ssoHandler;
  private volatile IWeiboShareAPI shareApi;
  private volatile Callback shareCallback;
  private volatile IWeiboHandler.Response responseHandler;

  private static WeiboModule weiboModule;

  public WeiboModule(ReactApplicationContext reactContext) {
    super(reactContext);
    weiboModule = this;

    // Do we need to remove the listener later?
    reactContext.addActivityEventListener(this);
  }

  /**
   * 延迟初始化,以保证在UI线程上初始化
   *
   * @return
   */
  private IWeiboHandler.Response responseHandler() {
    if (responseHandler == null) {
      responseHandler = new FakeActivity(); // 此调用必须在UI线程上,否则会报错
    }
    return responseHandler;
  }

  public static void handleIntent(Intent intent) {
    info("handleIntent...");
    if (weiboModule != null && weiboModule.shareApi != null) {
      weiboModule.shareApi.handleWeiboResponse(intent, weiboModule.responseHandler());
    }
  }

  @Override
  public String getName() {
    return "Weibo";
  }

  @ReactMethod
  public void openWeiboApp(final Callback callback) {
    boolean result = false;
    if (shareApi != null) {
      result = shareApi.launchWeibo(getCurrentActivity());
    }
    if (callback != null) {
      callback.invoke(result);
    }
  }

  @ReactMethod
  public void registerApp(final String appKey, final Callback callback) {
    this.appKey = appKey;
    this.shareApi = WeiboShareSDK.createWeiboAPI(getReactApplicationContext().getApplicationContext(), appKey);
    boolean result = this.shareApi.registerApp();
    if (callback != null) {
      info("registerApp...weiboSupportApi=" + shareApi.getWeiboAppSupportAPI());

      WritableMap writableMap = new WritableNativeMap();
      writableMap.putBoolean("appRegistered", result);
      writableMap.putBoolean("weiboAppInstalled", shareApi.isWeiboAppInstalled());
      writableMap.putBoolean("apiSupported", shareApi.isWeiboAppSupportAPI());
      callback.invoke(writableMap);
    }
  }

  @ReactMethod
  public void authorize(final ReadableMap config, final Callback callback) {
    info("authorize...");

    if (config != null && appKey != null && callback != null) {
      String scope = "";
      if (config.hasKey("scope")) {
        scope = config.getString("scope");
      }
      String redirectUrl = "https://api.weibo.com/oauth2/default.html";
      if (config.hasKey("redirectUrl")) {
        redirectUrl = config.getString("redirectUrl");
      }
      AuthInfo authInfo = new AuthInfo(getCurrentActivity(), appKey, redirectUrl, scope);
      ssoHandler = new SsoHandler(getCurrentActivity(), authInfo);

      WeiboAuthListener authListener = new WeiboAuthListener() {

        @Override
        public void onComplete(Bundle bundle) {
          Log.d(TAG, "onComplete...bundle=" + bundle);
          if (bundle != null) {
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
            writableMap.putString("expiresInSeconds", expires_in);

            callback.invoke(writableMap);
          } else {
            Log.e(TAG, "onComplete...null data from weibo");
          }

          ssoHandler = null;
        }

        @Override
        public void onWeiboException(WeiboException e) {
          Log.e(TAG, "onWeiboException...");

          WritableMap writableMap = new WritableNativeMap();
          writableMap.putString("error", e != null ? e.getMessage() : "unknown error");

          callback.invoke(writableMap);

          ssoHandler = null;
        }

        @Override
        public void onCancel() {
          Log.d(TAG, "onCancel...");
          WritableMap writableMap = new WritableNativeMap();
          writableMap.putBoolean("cancel", true);

          callback.invoke(writableMap);

          ssoHandler = null;
        }
      };

      this.ssoHandler.authorize(authListener);
    }
  }

  @ReactMethod
  public void share(final ReadableMap config, final Callback callback) {
    info("share...");

    if (config != null && shareApi != null) {
      this.shareCallback = callback;

      WeiboMultiMessage message = new WeiboMultiMessage();

      if (config.hasKey("text")) {
        String text = config.getString("text");
        TextObject textObject = new TextObject();
        textObject.text = text;
        message.textObject = textObject;
      }

      if (config.hasKey("image")) {
        String image = config.getString("image");
        ImageObject imageObject = new ImageObject();
        imageObject.imageData = Utils.toByteArray(image);
        message.imageObject = imageObject;
      }

      if (config.hasKey("webpage")) {
        WebpageObject mediaObject = new WebpageObject();
        parseCommon(config, mediaObject);
        mediaObject.identify = Utility.generateGUID();
        mediaObject.actionUrl = config.getString("webpage");
        message.mediaObject = mediaObject;
      } else if (config.hasKey("music")) {
        MusicObject musicObject = new MusicObject();
        parseCommon(config, musicObject);
        musicObject.identify = Utility.generateGUID();
        musicObject.actionUrl = config.getString("music");
        if (config.hasKey("data")) {
          musicObject.dataUrl = config.getString("data");
        }
        musicObject.duration = config.getInt("duration");
        message.mediaObject = musicObject;
      } else if (config.hasKey("video")) {
        VideoObject videoObject = new VideoObject();
        parseCommon(config, videoObject);
        videoObject.identify = Utility.generateGUID();
        videoObject.actionUrl = config.getString("video");
        if (config.hasKey("data")) {
          videoObject.dataUrl = config.getString("data");
        }
        videoObject.duration = config.getInt("duration");
        message.mediaObject = videoObject;
      }

      SendMultiMessageToWeiboRequest request = new SendMultiMessageToWeiboRequest();
      request.transaction = buildTransaction(null);
      request.multiMessage = message;

      shareApi.sendRequest(getCurrentActivity(), request);
    }
  }

  private void parseCommon(ReadableMap config, BaseMediaObject mediaObject) {
    if (config.hasKey("title")) {
      mediaObject.title = config.getString("title");
    }
    if (config.hasKey("description")) {
      mediaObject.description = config.getString("description");
    }
    if (config.hasKey("thumb")) {
      mediaObject.thumbData = toByteArray(thumb(bitmap(config.getString("thumb")), 32768), true);
    }
  }

  @Override
  public void onActivityResult(Activity activity,int requestCode, int resultCode, Intent data) {
    if (ssoHandler != null) {
      ssoHandler.authorizeCallBack(requestCode, resultCode, data);
    }
  }

  @Override
  public void onNewIntent(Intent intent) {
    
  }

  private static void info(String msg) {
    Utils.info(TAG, msg);
  }

  private String buildTransaction(final String type) {
    return (type == null) ? String.valueOf(System.currentTimeMillis()) : type + System.currentTimeMillis();
  }

  /**
   * 微博SDK需要传入的responseHandler为Activity类型,所以这里伪造一个假的Activity
   */
  private class FakeActivity extends Activity implements IWeiboHandler.Response {

    @Override
    public String getCallingPackage() {
      return getReactApplicationContext().getPackageName();
    }

    @Override
    public void onResponse(BaseResponse baseResponse) {
      info("onResponse...cls=" + baseResponse.getClass() + ", errCode=" + baseResponse.errCode);
      if (baseResponse instanceof SendMessageToWeiboResponse) {
        if (shareCallback != null) {
          shareCallback.invoke(parseResp(baseResponse));
          shareCallback = null;
        }
      }
    }
  }

  private static WritableMap parseResp(BaseResponse baseResponse) {
    WritableMap writableMap = new WritableNativeMap();
    if (baseResponse.errCode == WBConstants.ErrorCode.ERR_OK) {
      writableMap.putBoolean("success", true);
    } else if (baseResponse.errCode == WBConstants.ErrorCode.ERR_CANCEL) {
      writableMap.putBoolean("cancel", true);
    } else {
      String error = baseResponse.errMsg != null ? baseResponse.errMsg : "";
      error += " errCode=" + baseResponse.errCode;
      writableMap.putString("error", error);
    }
    return writableMap;
  }
}
