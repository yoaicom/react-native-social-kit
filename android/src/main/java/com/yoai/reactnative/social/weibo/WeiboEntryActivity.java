package com.yoai.reactnative.social.weibo;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

public class WeiboEntryActivity extends Activity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    WeiboModule.handleIntent(getIntent());

    finish();
  }

  @Override
  protected void onNewIntent(Intent intent) {
    super.onNewIntent(intent);

    setIntent(intent);
    WeiboModule.handleIntent(intent);

    finish();
  }
}
