package com.yoai.reactnative.social.weixin;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

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
import com.tencent.mm.sdk.modelmsg.SendMessageToWX;
import com.tencent.mm.sdk.modelmsg.WXAppExtendObject;
import com.tencent.mm.sdk.modelmsg.WXEmojiObject;
import com.tencent.mm.sdk.modelmsg.WXImageObject;
import com.tencent.mm.sdk.modelmsg.WXMediaMessage;
import com.tencent.mm.sdk.modelmsg.WXMusicObject;
import com.tencent.mm.sdk.modelmsg.WXTextObject;
import com.tencent.mm.sdk.modelmsg.WXVideoObject;
import com.tencent.mm.sdk.modelmsg.WXWebpageObject;
import com.tencent.mm.sdk.modelpay.PayReq;
import com.tencent.mm.sdk.modelpay.PayResp;
import com.tencent.mm.sdk.openapi.IWXAPI;
import com.tencent.mm.sdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.sdk.openapi.WXAPIFactory;
import com.yoai.reactnative.social.Utils;

import java.util.UUID;

public class WeixinModule extends ReactContextBaseJavaModule implements IWXAPIEventHandler {

  private static final String TAG = "WeixinModule";

  private IWXAPI api;

  private String authStateString;

  private Callback authCallback;
  private Callback shareCallback;
  private Callback payCallback;

  private static WeixinModule weixinModule;

  public WeixinModule(ReactApplicationContext reactContext) {
    super(reactContext);
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
  public void openWeixinApp(final Callback callback) {
    boolean result = false;
    if (api != null) {
      result = api.openWXApp();
    }
    if (callback != null) {
      callback.invoke(result);
    }
  }

  @ReactMethod
  public void registerApp(final String appId, final Callback callback) {
    boolean result = false;
    if (appId != null) {
      api = WXAPIFactory.createWXAPI(getCurrentActivity(), appId, true);
      result = api.registerApp(appId);
      if (callback != null) {
        WritableMap writableMap = new WritableNativeMap();
        writableMap.putBoolean("appRegistered", result);
        writableMap.putBoolean("weixinAppInstalled", api.isWXAppInstalled());
        writableMap.putBoolean("apiSupported", api.isWXAppSupportAPI());
        callback.invoke(writableMap);
      }
    }
  }

  @ReactMethod
  public void shareText(final ReadableMap config, final Callback callback) {
    info("shareText...");

    if (config != null && api != null) {
      this.shareCallback = callback;

      String text = config.getString("text");
      WXTextObject textObject = new WXTextObject();
      textObject.text = text;

      WXMediaMessage message = new WXMediaMessage();
      message.mediaObject = textObject;
      message.description = text;


      SendMessageToWX.Req req = new SendMessageToWX.Req();
      req.transaction = buildTransaction("text");
      req.message = message;
      req.scene = parseScene(config.getString("scene"));

      api.sendReq(req);
    }
  }

  @ReactMethod
  public void shareImage(final ReadableMap config, final Callback callback) {
    info("shareImage...");

    if (config != null && api != null) {
      this.shareCallback = callback;

      String uri = config.getString("uri");
      info("shareImage...uri=" + uri);

      WXImageObject imageObject = new WXImageObject();
      imageObject.imageData = Utils.toByteArray(uri);

      WXMediaMessage message = new WXMediaMessage();
      message.mediaObject = imageObject;
      message.thumbData = Utils.toByteArray(thumb(imageObject.imageData), true);
      message.title = config.getString("title");
      message.description = config.getString("description");

      SendMessageToWX.Req req = new SendMessageToWX.Req();
      req.transaction = buildTransaction("img");
      req.message = message;
      req.scene = parseScene(config.getString("scene"));

      api.sendReq(req);
    }
  }

  @ReactMethod
  public void shareMusic(final ReadableMap config, final Callback callback) {
    info("shareMusic...");

    if (config != null && api != null) {
      this.shareCallback = callback;

      WXMusicObject musicObject = new WXMusicObject();
      musicObject.musicUrl = config.getString("uri");

      WXMediaMessage message = new WXMediaMessage();
      message.mediaObject = musicObject;
      message.title = config.getString("title");
      message.description = config.getString("description");
      message.thumbData = Utils.toByteArray(config.getString("thumb"));

      SendMessageToWX.Req req = new SendMessageToWX.Req();
      req.transaction = buildTransaction("music");
      req.message = message;
      req.scene = parseScene(config.getString("scene"));

      api.sendReq(req);
    }
  }

  @ReactMethod
  public void shareVideo(final ReadableMap config, final Callback callback) {
    info("shareVideo...");

    if (config != null && api != null) {
      this.shareCallback = callback;

      WXVideoObject videoObject = new WXVideoObject();
      videoObject.videoUrl = config.getString("uri");

      WXMediaMessage message = new WXMediaMessage();
      message.mediaObject = videoObject;
      message.title = config.getString("title");
      message.description = config.getString("description");
      message.thumbData = Utils.toByteArray(config.getString("thumb"));

      SendMessageToWX.Req req = new SendMessageToWX.Req();
      req.transaction = buildTransaction("video");
      req.message = message;
      req.scene = parseScene(config.getString("scene"));

      api.sendReq(req);
    }
  }

  @ReactMethod
  public void shareWebpage(final ReadableMap config, final Callback callback) {
    info("shareWebpage...");

    if (config != null && api != null) {
      this.shareCallback = callback;

      WXWebpageObject webpageObject = new WXWebpageObject();
      webpageObject.webpageUrl = config.getString("uri");

      WXMediaMessage message = new WXMediaMessage();
      message.mediaObject = webpageObject;
      message.title = config.getString("title");
      message.description = config.getString("description");
      message.thumbData = Utils.toByteArray(config.getString("thumb"));

      SendMessageToWX.Req req = new SendMessageToWX.Req();
      req.transaction = buildTransaction("webpage");
      req.message = message;
      req.scene = parseScene(config.getString("scene"));

      api.sendReq(req);
    }
  }

  @ReactMethod
  public void shareAppData(final ReadableMap config, final Callback callback) {
    info("shareAppData");

    if (config != null && api != null) {
      this.shareCallback = callback;

      WXAppExtendObject appExtendObject = new WXAppExtendObject();
      appExtendObject.extInfo = config.getString("extra");

      WXMediaMessage message = new WXMediaMessage();
      message.mediaObject = appExtendObject;
      message.title = config.getString("title");
      message.description = config.getString("description");
      message.thumbData = Utils.toByteArray(config.getString("thumb"));

      SendMessageToWX.Req req = new SendMessageToWX.Req();
      req.transaction = buildTransaction("appdata");
      req.message = message;
      req.scene = parseScene(config.getString("scene"));

      api.sendReq(req);
    }
  }

  @ReactMethod
  public void shareEmoticon(final ReadableMap config, final Callback callback) {
    info("shareEmoticon");

    if (config != null && api != null) {
      this.shareCallback = callback;

      WXEmojiObject emojiObject = new WXEmojiObject();
      emojiObject.emojiData = Utils.toByteArray(config.getString("uri"));


      WXMediaMessage message = new WXMediaMessage();
      message.mediaObject = emojiObject;
      message.title = config.getString("title");
      message.description = config.getString("description");
      message.thumbData = Utils.toByteArray(thumb(emojiObject.emojiData), true);

      SendMessageToWX.Req req = new SendMessageToWX.Req();
      req.transaction = buildTransaction("emoticon");
      req.message = message;
      req.scene = parseScene(config.getString("scene"));

      api.sendReq(req);
    }
  }

  @ReactMethod
  public void pay(final ReadableMap config, final Callback callback) {
    info("pay...");

    if (config != null && api != null) {
      this.payCallback = callback;

      PayReq req = new PayReq();
      req.appId = config.getString("appId");
      req.partnerId = config.getString("partnerId");
      req.prepayId = config.getString("prepayId");
      req.packageValue = config.getString("package");
      req.nonceStr = config.getString("nonceStr");
      req.timeStamp = config.getString("timeStamp");
      req.sign = config.getString("sign");
      api.sendReq(req);
    }
  }

  private static Bitmap thumb(Bitmap bmp) {
    if (bmp != null) {
      int scale = (int) Math.ceil(Math.sqrt(bmp.getWidth() * bmp.getHeight() * 1f / WXMediaMessage.THUMB_LENGTH_LIMIT));
      return Bitmap.createScaledBitmap(bmp, bmp.getWidth() / scale, bmp.getHeight() / scale, true);
    }
    return null;
  }


  private static Bitmap thumb(byte[] imageData) {
    if (imageData != null) {
      Bitmap bitmap = BitmapFactory.decodeByteArray(imageData, 0, imageData.length);
      Bitmap thumb = thumb(bitmap);
      if (thumb != bitmap) {
        bitmap.recycle();
      }
      return thumb;
    }
    return null;
  }

  private static int parseScene(String scene) {
    if ("timeline".equals(scene)) {
      return SendMessageToWX.Req.WXSceneTimeline;
    } else if ("favorite".equals(scene)) {
      return SendMessageToWX.Req.WXSceneFavorite;
    } else {
      return SendMessageToWX.Req.WXSceneSession;
    }
  }

  @ReactMethod
  public void authorize(final ReadableMap config, final Callback callback) {
    info("authorize...");

    if (api != null) {
      this.authCallback = callback;

      // 微信官网文档：用于保持请求和回调的状态，授权请求后原样带回给第三方。该参数可用于防止csrf攻击（跨站请求伪造攻击），建议第三方带上该参数，可设置为简单的随机数加session进行校验.
      this.authStateString = UUID.randomUUID().toString();

      final SendAuth.Req req = new SendAuth.Req();
      req.scope = "snsapi_userinfo"; //微信授权登录只能使用"snsapi_userinfo"
      req.state = this.authStateString;
      api.sendReq(req);
    }
  }

  public static void handleIntent(Intent intent) {
    if (weixinModule != null && weixinModule.api != null) {
      weixinModule.api.handleIntent(intent, weixinModule);
    }
  }

  @Override
  public void onReq(BaseReq baseReq) {
    info("onReq...");
  }

  @Override
  public void onResp(BaseResp baseResp) {
    info("onResp...cls=" + baseResp.getClass() + ", type=" + baseResp.getType());
    if (baseResp instanceof SendAuth.Resp) {
      onAuthResp((SendAuth.Resp) baseResp);
    } else if (baseResp instanceof SendMessageToWX.Resp) {
      if (this.shareCallback != null) {
        WritableMap writableMap = parseResp(baseResp);
        this.shareCallback.invoke(writableMap);
        this.shareCallback = null;
      }
    } else if (baseResp instanceof PayResp) {
      if (this.payCallback != null) {
        this.payCallback.invoke(parseResp(baseResp));
        this.payCallback = null;
      }
    }
  }

  private static WritableMap parseResp(BaseResp resp) {
    WritableMap writableMap = new WritableNativeMap();
    if (resp.errCode == BaseResp.ErrCode.ERR_OK) {
      writableMap.putBoolean("success", true);
    } else if (resp.errCode == BaseResp.ErrCode.ERR_USER_CANCEL) {
      writableMap.putBoolean("cancel", true);
    } else {
      String error = resp.errStr != null ? resp.errStr : "";
      error += " errCode=" + resp.errCode;
      writableMap.putString("error", error);
    }
    return writableMap;
  }

  private void onAuthResp(SendAuth.Resp resp) {
    info("onResp...code=" + resp.code + ", country=" + resp.country + ", lang=" + resp.lang + ", state=" + resp.state + ", url=" + resp.url);
    if (this.authCallback != null) {
      WritableMap writableMap = parseResp(resp);

      if (resp.errCode == BaseResp.ErrCode.ERR_OK) {
        if (this.authStateString != null && this.authStateString.equals(resp.state)) {
          writableMap.putString("code", resp.code);
          writableMap.putString("country", resp.country);
          writableMap.putString("lang", resp.lang);
        } else {
          writableMap.putNull("success");
          writableMap.putString("error", "state not match");
        }
      }

      this.authCallback.invoke(writableMap);
      this.authCallback = null;
      this.authStateString = null;
    }
  }

  private String buildTransaction(final String type) {
    return (type == null) ? String.valueOf(System.currentTimeMillis()) : type + System.currentTimeMillis();
  }

  private void info(String msg) {
    Utils.info(TAG, msg);
  }
}
