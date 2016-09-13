package com.yoai.reactnative.social.ali;

import com.alipay.sdk.app.PayTask;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.yoai.reactnative.social.Utils;

import java.util.Map;

public class AliModule extends ReactContextBaseJavaModule {

  private static final String TAG = "AliModule";

  public AliModule(ReactApplicationContext reactContext) {
    super(reactContext);

  }

  @Override
  public String getName() {
    return "Ali";
  }

  @ReactMethod
  public void pay(final ReadableMap config, final Callback callback) {
    info("pay...");

    final String orderStr = config.getString("orderStr");

    new Thread(new Runnable() {
      @Override
      public void run() {
        PayTask payTask = new PayTask(getCurrentActivity());
        Map<String, String> result = payTask.payV2(orderStr, true);
        String resultStatus = result.get("resultStatus");

        final WritableMap writableMap = new WritableNativeMap();
        if ("9000".equals(resultStatus)) {
          writableMap.putBoolean("success", true);
        } else if ("6001".equals(resultStatus)) {
          writableMap.putBoolean("cancel", true);
        } else {
          String error = "errCode=" + resultStatus;
          writableMap.putString("error", error);
        }
        callback.invoke(writableMap);
      }
    }).start();
  }

  private void info(String msg) {
    Utils.info(TAG, msg);
  }
}
