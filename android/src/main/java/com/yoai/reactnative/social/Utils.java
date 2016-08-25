package com.yoai.reactnative.social;

import android.graphics.Bitmap;
import android.net.Uri;
import android.util.Log;

import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

public class Utils {

  public static final boolean DEBUG = true;

  public static void info(String tag, String msg) {
    if (DEBUG) {
      Log.i(tag, msg);
    }
  }

  public static byte[] toByteArray(final Bitmap bmp, boolean recycle) {
    byte[] result = null;
    if (bmp != null) {
      ByteArrayOutputStream output = new ByteArrayOutputStream();
      bmp.compress(Bitmap.CompressFormat.JPEG, 85, output);
      result = output.toByteArray();
      if (recycle) {
        bmp.recycle();
      }
    }
    return result;
  }

  public static byte[] toByteArray(final String uri) {
    try {
      if (Uri.parse(uri).getScheme() != null) {
        return toByteArray(new URL(uri).openStream());
      } else {
        return toByteArray(new FileInputStream(uri));
      }
    } catch (Exception e) {
    }
    return null;
  }

  public static byte[] toByteArray(InputStream is) {
    byte[] ret = null;
    try {
      ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
      int ch;
      while ((ch = is.read()) != -1) {
        byteArrayOutputStream.write(ch);
      }
      ret = byteArrayOutputStream.toByteArray();
      byteArrayOutputStream.close();
    } catch (Exception e) {
    } finally {
      try {
        is.close();
      } catch (IOException e) {
      }
    }
    return ret;
  }
}
