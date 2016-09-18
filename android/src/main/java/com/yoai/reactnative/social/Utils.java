package com.yoai.reactnative.social;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.util.Log;

import com.tencent.mm.sdk.modelmsg.WXMediaMessage;

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

  public static Bitmap bitmap(String uri) {
    byte[] imageData = toByteArray(uri);
    if (imageData != null) {
      Bitmap bitmap = BitmapFactory.decodeByteArray(imageData, 0, imageData.length);
      return bitmap;
    }
    return null;
  }

  public static Bitmap thumb(Bitmap bmp, int maxLength) {
    if (bmp != null) {
      int scale = (int) Math.ceil(Math.sqrt(bmp.getWidth() * bmp.getHeight() * 1f / maxLength));
      if (scale <= 1) {
        return bmp;
      }
      return Bitmap.createScaledBitmap(bmp, bmp.getWidth() / scale, bmp.getHeight() / scale, true);
    }
    return null;
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
