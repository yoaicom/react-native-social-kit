package com.yoai.reactnative.socialsdk.weixin;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

public class WXEntryActivity extends Activity {

  private static final String TAG = "WXEntryActivity";

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    WeixinModule.handleIntent(getIntent());

    finish();
  }

  @Override
  protected void onNewIntent(Intent intent) {
    super.onNewIntent(intent);

    setIntent(intent);
    WeixinModule.handleIntent(intent);

    finish();
  }
}
