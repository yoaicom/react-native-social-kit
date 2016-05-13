package com.yoai.reactnative.socialsdk.weixin;

import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.tencent.mm.sdk.modelbase.BaseReq;
import com.tencent.mm.sdk.modelbase.BaseResp;
import com.tencent.mm.sdk.modelmsg.SendAuth;
import com.tencent.mm.sdk.openapi.IWXAPI;
import com.tencent.mm.sdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.sdk.openapi.WXAPIFactory;
import com.yoai.reactnative.socialsdk.Utils;

import java.util.UUID;

public class WeixinModule extends ReactContextBaseJavaModule implements IWXAPIEventHandler {

  private static final String TAG = "WeixinModule";

  private IWXAPI api;

  private String authStateString;

  private Callback authCallback;

  private static WeixinModule weixinModule;

  public WeixinModule(ReactApplicationContext reactContext) {
    super(reactContext);
    info("construct WeixinModule...");
    weixinModule = this;
  }

  /**
   * @return the name of this module. This will be the name used to {@code require()} this module
   * from javascript.
   */
  @Override
  public String getName() {
    return "Weixin";
  }

  @ReactMethod
  public void authorize(final ReadableMap config, final Callback callback) {
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

    this.api = createAPI(appId);

    // 微信官网文档：用于保持请求和回调的状态，授权请求后原样带回给第三方。该参数可用于防止csrf攻击（跨站请求伪造攻击），建议第三方带上该参数，可设置为简单的随机数加session进行校验.
    this.authStateString = UUID.randomUUID().toString();
    this.authCallback = callback;

    final SendAuth.Req req = new SendAuth.Req();
    req.scope = "snsapi_userinfo"; //微信授权登录只能使用"snsapi_userinfo"
    req.state = this.authStateString;
    api.sendReq(req);
  }

  public static void handleIntent(Intent intent) {
    if(weixinModule != null && weixinModule.api != null) {
      weixinModule.api.handleIntent(intent, weixinModule);
    }
  }

  private void onAuthResp(SendAuth.Resp resp) {
    if (resp == null) {
      return;
    }
    if (this.authCallback == null) {
      Log.e(TAG, "onAuthResp...no callback available");
      return;
    }
    info("onResp...code=" + resp.code + ", country=" + resp.country + ", lang=" + resp.lang + ", state=" + resp.state + ", url=" + resp.url);

    WritableMap writableMap = new WritableNativeMap();
    if (resp.errCode == BaseResp.ErrCode.ERR_OK) {
      if (this.authStateString != null && this.authStateString.equals(resp.state)) {
        writableMap.putString("code", resp.code);
        writableMap.putString("country", resp.country);
        writableMap.putString("lang", resp.lang);
        writableMap.putString("state", resp.state);
      } else {
        Log.e(TAG, "onAuthResp...state not match!");
        writableMap.putString("error", "state not match");
      }
    } else {
      if (resp.errCode == BaseResp.ErrCode.ERR_AUTH_DENIED || resp.errCode == BaseResp.ErrCode.ERR_USER_CANCEL) {
        writableMap.putBoolean("cancel", true);
      } else {
        String error = (resp.errStr != null ? resp.errStr : "") + " errCode=" + resp.errCode;
        writableMap.putString("error", error);
      }
    }
    this.authCallback.invoke(writableMap);
    this.authCallback = null;
    this.authStateString = null;
  }

  private IWXAPI createAPI(final String appId) {
    IWXAPI api = WXAPIFactory.createWXAPI(getCurrentActivity(), appId, true);
    api.registerApp(appId);
    return api;
  }

  @Override
  public void onReq(BaseReq baseReq) {
    info("onReq...");
  }

  @Override
  public void onResp(BaseResp baseResp) {
    info("onResp...");
    if (baseResp instanceof SendAuth.Resp) {
      SendAuth.Resp resp = (SendAuth.Resp) baseResp;
      onAuthResp(resp);
    }
  }

  private void info(String msg) {
    Utils.info(TAG, msg);
  }
}
