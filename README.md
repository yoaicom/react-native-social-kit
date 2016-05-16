# react-native-social-kit
此项目志在提供对第三方社交SDK的功能封装，方便开发者在React Native应用中使用诸如授权、分享等功能。 

目前仅支持授权功能,仅覆盖微信、新浪微博、QQ。  

**项目仍在开发中，功能不稳定，请耐心等待。**

# 安装
`npm install react-native-social-kit@latest --save`  

# 配置  
## iOS

需要使用Cocoapods来管理依赖。  
添加
 ```
 pod "react-native-social-sdk", :path => '../node_modules/react-native-social-kit'
 ```
到Podfile，然后执行命令`pod install`。

##### 微信

在**Xcode**中选中**TARGETS**，在**info**标签栏的**URL Types**项目下添加子项，子项的**URL Schemes**为你所注册的应用程序的AppId。

##### 微博

在**Xcode**中选中**TARGETS**，在**info**标签栏的**URL Types**项目下添加子项，子项的**URL Schemes**为“wb” ＋ 你所注册的应用程序的App Key，如“wb204543436852”。

在你的app的plist中添加如下键值对：

```
<key>LSApplicationQueriesSchemes</key>
<array>
    <string>sinaweibohd</string>
    <string>sinaweibo</string>
    <string>weibosdk</string>
    <string>weibosdk2.5</string>
</array>
```

##### QQ

在**Xcode**中选中**TARGETS**，在**info**标签栏的**URL Types**项目下添加子项，子项的**URL Schemes**为“tencent” ＋ 你所注册的应用程序的App Key，如“tencent222222”。

在你的app的plist中添加如下键值对：

```
<key>LSApplicationQueriesSchemes</key>
<array>
    <string>mqzone</string>
	<string>wtloginmqq2</string>
	<string>mqqopensdkapiV3</string>
	<string>mqqwpa</string>
	<string>mqqopensdkapiV2</string>
	<string>mqqOpensdkSSoLogin</string>
	<string>mqq</string>
</array>
```



## Android

```
// file: settings.gradle
...
include ':react-native-social-kit'
project(':react-native-social-kit').projectDir = new File(settingsDir, '../node_modules/react-native-social-kit/android')
```

```
// file: app/build.gradle
...
dependencies {
    ...
    compile project(':react-native-social-kit')
}
```

##### 微信

在你的包名相应目录下新建一个wxapi目录，并在该wxapi目录下新增一个***WXEntryActivity***类，该类继承自***com.yoai.reactnative.socialsdk.weixin.WXEntryActivity***。

在AndroidManifest.xml里添加：

```
<activity
  android:name=".wxapi.WXEntryActivity"
  android:exported="true"
  android:label="@string/app_name"
  android:theme="@android:style/Theme.Translucent.NoTitleBar"
  />
```

##### 微博

不需要额外配置

##### QQ

在AndroidManifest.xml里添加：

```
<activity
  android:name="com.tencent.tauth.AuthActivity"
  android:launchMode="singleTask"
  android:noHistory="true">
  <intent-filter>
    <action android:name="android.intent.action.VIEW"/>
    <category android:name="android.intent.category.DEFAULT"/>
    <category android:name="android.intent.category.BROWSABLE"/>

    <data android:scheme="tencent222222"/>
  </intent-filter>
</activity>
```

***注意其中的“tencent222222”格式为“tencent”＋你所注册的应用程序的App Key，记得替换。***



# 使用

In your JavaScript code:

```javascript
import SocialKit from 'react-native-social-kit';
const {Weibo, Weixin, QQ} = SocialKit;
```

or simply

```javascript
import {Weibo, Weixin, QQ} from 'react-native-social-kit';
```
Then, use it like:

```javascript
Weibo.authorize({
  appId: '3928876547',
  redirectUrl: 'https://api.weibo.com/oauth2/default.html'
}, (data) => {
  if (data.error) {
    //发生了错误
  } else if (data.cancel) {
    //用户取消了授权
  } else {
    console.log(JSON.stringify(data));
  }
});
```



