'use strict';

import React, {
  Component
} from 'react';
import {
  View,
  Text,
  PixelRatio,
  Image
} from 'react-native';

let resolveAssetSource = require('resolveAssetSource');

import sdk from 'react-native-social-kit';
import WeixinSDK from './WeixinSDK';
import WeiboSDK from './WeiboSDK';

var Weixin = sdk.Weixin;
var Weibo = sdk.Weibo;
var QQ = sdk.QQ;

let path = require('./jpg/res2.jpg');
let thumbImage = "file://" + resolveAssetSource(path).uri;
let thumbnail = resolveAssetSource(path).uri;
let imageUrl = resolveAssetSource(require('./jpg/tampon0.jpg')).uri;
let imageUrl1 = resolveAssetSource(require('./jpg/tampon1.jpg')).uri;
let imageUrl2 = resolveAssetSource(require('./jpg/tampon2.jpg')).uri;
let imageUrl3 = resolveAssetSource(require('./jpg/tampon3.jpg')).uri;

export default class Demo1 extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  render () {
    return(
      <WeiboSDK/>
    )
  }
}

class Demo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: "",
      path: ""
    };
  }

  QQAuth() {
    QQ.authorize({permissions: []}, (data)=> {
      this.setState({data: JSON.stringify(data)})
    })
  }

  WeixinAuth() {
    Weixin.authorize({scope: "snsapi_userinfo", state: "123"}, (data) => {
      this.setState({data: JSON.stringify(data)})
    })

  }

  WeiboAuth() {
    Weibo.authorize({redirectUrl: "https://api.weibo.com/oauth2/default.html", scope: "all"}, (data)=> {
      this.setState({data: JSON.stringify(data)})
    })
  }


  componentWillMount() {
    QQ.registerApp({
        appId: "222222"
      },
      (data) => {
      });
    Weibo.registerApp({
      appKey: "2641053562"
    }, (data) => {
    });
    Weixin.registerApp({
      appId: "wx1dd0b08688eecaef"
    }, (data) => {
    });


  }

  /** 微信分享
   * @param text 分享内容
   * @param bText 多媒体or纯文本
   * @param scene  对话: "WXSceneSession"  朋友圈: "WXSceneTimeline" 收藏: "WXSceneFavorite"
   * @param callback 分享后的回调
   * @returns
   */
  shareTextToWXReq() {
    Weixin.shareText({
      text: "你好这里是有爱官网",
      scene: "WXSceneSession",
    }, (data) => {
      this.setState({data: JSON.stringify(data)})
    });
  }

  shareImageToWXReq() {
    try {
      Weixin.shareImage({
        text: "你好这里是有爱官网",
        scene: "WXSceneSession",
        imagePath: resolveAssetSource(require('./jpg/tampon0.jpg')).uri,
        thumbImage: thumbImage
      }, (data) => {
        this.setState({data: JSON.stringify(data)})
      });
    } catch (e) {
      console.log("获取图片失败");
    }
  }

  shareWebToWXReq() {
    try {

      Weixin.shareWeb({
        title: "网页分享",
        description: "这是一个网页分享",
        scene: "WXSceneSession",
        webpageUrl: "http://www.yoai.com/",
        thumbImage: thumbImage
      }, (data) => {
        this.setState({data: JSON.stringify(data)})
      });
    } catch (e) {
      console.log("网页分享失败");
    }

  }

  shareMusicToWXReq() {
    try {

      Weixin.shareMusic({
        title: "音乐分享",
        description: "这是一个音乐分享",
        musicUrl: "http://y.qq.com/#type=song&id=103347",
        musicDataUrl: "http://stream20.qqmusic.qq.com/32464723.mp3",
        scene: "WXSceneSession",
        thumbImage: thumbImage
      }, (data) => {
        this.setState({data: JSON.stringify(data)})
      });
    } catch (e) {
      console.log("音乐分享失败");
    }

  }

  shareVideoToWXReq() {

    Weixin.shareVideo({
      title: "视频分享",
      description: "这是一个视频分享",
      videoUrl: "http://v.youku.com/v_show/id_XNTUxNDY1NDY4.html",
      scene: "WXSceneTimeline",
      thumbImage: thumbImage
    }, (data) => {
      this.setState({data: JSON.stringify(data)})
    });
  }

  shareAppToWXReq() {

    Weixin.shareApp({
      title: "App分享",
      description: "这是一个App分享",
      extInfo: "<xml>extend info</xml>",
      url: "http://weixin.qq.com",
      scene: "",
      thumbImage: thumbImage
    }, (data) => {
      this.setState({data: JSON.stringify(data)})
    });
  }

  shareNonGifToWXReq() {

    Weixin.shareNonGif({
      title: "图片表情分享",
      description: "这是一个图片表情分享",
      scene: "WXSceneSession",
      thumbImage: thumbImage,
      nonGifPath: resolveAssetSource(require('./jpg/res7.jpg')).uri
    }, (data) => {
      this.setState({data: JSON.stringify(data)})
    });
  }

  shareGifToWXReq() {

    Weixin.shareGif({
      title: "gif表情分享",
      description: "这是一个gif表情分享",
      scene: "WXSceneSession",
      thumbImage: thumbImage,
      gifPath: resolveAssetSource(require('./jpg/res6.gif')).uri,
    }, (data) => {
      this.setState({data: JSON.stringify(data)})
    });
  }

  shareFileToWXReq() {

    Weixin.shareFile({
      title: "文件分享",
      description: "这是一个文件分享",
      scene: "WXSceneFavorite",
      thumbImage: thumbImage,
      filePath: resolveAssetSource(require('./jpg/ML.pdf')).uri,
    }, (data) => {
      this.setState({data: JSON.stringify(data)})
    });
  }


  isWXAppInstalled() {
    Weixin.isWXAppInstalled((data) => {
      console.log("isWXAppInstalled=" + data);
    })
  }

  isWXAppSupportApi() {
    Weixin.isWXAppSupportApi((data) => {
      console.log("isWXAppSupportApi=" + data);
    })
  }

  getWXAppInstallUrl() {
    Weixin.getWXAppInstallUrl((data) => {
      console.log("getWXAppInstallUrl=" + data);
    })
  }

  getApiVersion() {
    Weixin.getApiVersion((data) => {
      console.log("getApiVersion=" + data);
    })
  }

  openWXApp() {
    Weixin.openWXApp((data) => {
      console.log("openWXApp=" + data);
    })
  }


  /** 微博分享
   * @param
   * @param
   * @returns
   */
  shareTextToWeibo() {
    Weibo.shareText({
      text: "这里是一个微博文本分享的文本",
      redirectURI: "https://api.weibo.com/oauth2/default.html",
      scope: "all",
    }, (data) => {
      this.setState({data: JSON.stringify(data)})
    });
  }

  shareImageToWeibo() {
    Weibo.shareImage({
      text: "这里是一个微博文本分享的文本",
      imagePath: resolveAssetSource(require('./jpg/tampon0.jpg')).uri,
      redirectURI: "https://api.weibo.com/oauth2/default.html",
      scope: "all",
    }, (data) => {
      this.setState({data: JSON.stringify(data)})
    });
  }

  shareWebPageToWeibo() {
    Weibo.shareWebPage({
      text: "这里是一个微博网页分享的文本",
      objectID: "identifier1",
      title: "微博网页分享",
      description: "这是一个微博网页分享的示例",
      thumbnail: thumbnail,
      webpageUrl: "http://sina.cn?a=1",
      redirectURI: "https://api.weibo.com/oauth2/default.html",
      scope: "all",
    }, (data) => {
      this.setState({data: JSON.stringify(data)})
    });
  }

  shareMusicToWeibo() {
    Weibo.shareMusic({
      text: "这里是一个微博音乐分享的文本",
      objectID: "identifier1",
      title: "微博音乐分享",
      description: "这是一个微博音乐分享的示例",
      thumbnail: thumbnail,
      musicUrl: "http://y.qq.com/#type=song&id=103347",
      musicLowBandUrl: "http://stream20.qqmusic.qq.com/32464723.mp3",
      redirectURI: "https://api.weibo.com/oauth2/default.html",
      scope: "all",
    }, (data) => {
      this.setState({data: JSON.stringify(data)})
    });
  }

  shareVideoToWeibo() {
    Weibo.shareVideo({
      text: "这里是一个微博视频分享的文本",
      objectID: "identifier1",
      title: "微博视频分享",
      description: "这是一个微博视频分享的示例",
      thumbnail: thumbnail,
      videoUrl: "http://v.youku.com/v_show/id_XNTUxNDY1NDY4.html",
      redirectURI: "https://api.weibo.com/oauth2/default.html",
      scope: "all",
    }, (data) => {
      this.setState({data: JSON.stringify(data)})
    });
  }

  isWeiboAppInstalled() {
    Weibo.isWeiboAppInstalled((data) => {
      console.log("isWeiboAppInstalled = " + data);
    })
  }

  isCanShareInWeiboAPP() {
    Weibo.isCanShareInWeiboAPP((data) => {
      console.log("isCanShareInWeiboAPP = " + data);
    })
  }
  isCanSSOInWeiboApp() {
    Weibo.isCanSSOInWeiboApp((data) => {
      console.log("isCanSSOInWeiboApp = " + data);
    })
  }
  openWeiboApp() {
    Weibo.openWeiboApp((data) => {
      console.log("openWeiboApp = " + data);
    })
  }
  getWeiboAppInstallUrl() {
    Weibo.getWeiboAppInstallUrl((data) => {
      console.log("getWeiboAppInstallUrl = " + data);
    })
  }
  getSDKVersion() {
    Weibo.getSDKVersion((data) => {
      console.log("getSDKVersion = " + data);
    })
  }

  /** QQ分享
   * @param
   * @param
   * @returns
   */
  shareTextToQQ() {
    QQ.shareText({
      text: "这里是一个QQ文本分享的文本",
      scene: 'Qzone'
    }, (data) => {
      this.setState({data: JSON.stringify(data)})
    });
  }

  shareImageToQQ() {
    QQ.shareImage({
      title: "QQ图片分享",
      description: "这里是一个QQ图片分享的文本",
      scene: 'QQGroup',
      imagePath: resolveAssetSource(require('./jpg/tampon0.jpg')).uri,
      previewImagePath: thumbnail,
    }, (data) => {
      this.setState({data: JSON.stringify(data)})
    });
  }

  shareImageArrayToQQ() {
    QQ.shareImageArray({
      title: "QQ多图分享",
      description: "这里是一个QQ多图分享的文本",
      scene: 'Qzone',
      previewImagePath: thumbnail,
      imageArray: [imageUrl, imageUrl1, imageUrl2, imageUrl3, imageUrl],
      previewImageURL: thumbImage,
      url: "http://a.hiphotos.baidu.com/zhidao/pic/item/ac6eddc451da81cb91b89bd25666d01609243156.jpg",
    }, (data) => {
      this.setState({data: JSON.stringify(data)})
    });
  }

  shareWebPageToQQ() {
    QQ.shareWebPage({
      title: "QQ网页分享",
      description: "这是一个QQ网页分享的示例",
      url: "http://sina.cn?a=1",
      previewImageURL: thumbImage,
      // previewImageURL: "http://a.hiphotos.baidu.com/zhidao/pic/item/ac6eddc451da81cb91b89bd25666d01609243156.jpg",
      // scene: 'Qzone',
    }, (data) => {
      this.setState({data: JSON.stringify(data)})
    });
  }

  shareMusicToQQ() {
    QQ.shareMusic({
      title: "QQ音乐分享",
      description: "这是一个QQ音乐分享的示例",
      url: "http://y.qq.com/#type=song&id=103347",
      previewImageURL: thumbImage,
      // previewImageURL: "http://a.hiphotos.baidu.com/zhidao/pic/item/ac6eddc451da81cb91b89bd25666d01609243156.jpg",
      flashURL: "http://player.video.qiyi.com/0bb2ae16923822161de984728ac5c415/0/0/v_19rrmdkfh4.swf-albumId=517678900-tvId=517678900-isPurchase=0-cnId=6",
      // scene: 'Qzone',
    }, (data) => {
      this.setState({data: JSON.stringify(data)})
    });
  }

  shareVideoToQQ() {
    QQ.shareVideo({
      title: "QQ视频分享",
      description: "这是一个QQ视频分享的示例",
      url: "http://y.qq.com/#type=song&id=103347",
      previewImageURL: thumbImage,
      // previewImageURL: "http://a.hiphotos.baidu.com/zhidao/pic/item/ac6eddc451da81cb91b89bd25666d01609243156.jpg",
      flashURL: "http://player.video.qiyi.com/0bb2ae16923822161de984728ac5c415/0/0/v_19rrmdkfh4.swf-albumId=517678900-tvId=517678900-isPurchase=0-cnId=6",
      // scene: 'Qzone',
    }, (data) => {
      this.setState({data: JSON.stringify(data)})
    });
  }


  iphoneQQInstalled() {
    QQ.iphoneQQInstalled( (data) =>{
      console.log("iphoneQQInstalled = " + data);
    })
  }

  iphoneQQSupportSSOLogin() {
    QQ.iphoneQQSupportSSOLogin( (data) =>{
      console.log("iphoneQQSupportSSOLogin = " + data);
    })
  }
  iphoneQZoneInstalled() {
    QQ.iphoneQZoneInstalled( (data) =>{
      console.log("iphoneQZoneInstalled = " + data);
    })
  }
  iphoneQZoneSupportSSOLogin() {
    QQ.iphoneQZoneSupportSSOLogin( (data) =>{
      console.log("iphoneQZoneSupportSSOLogin = " + data);
    })
  }
  sdkVersion() {
    QQ.sdkVersion( (data) =>{
      console.log("sdkVersion = " + data);
    })
  }
  sdkSubVersion() {
    QQ.sdkSubVersion( (data) =>{
      console.log("sdkSubVersion = " + data);
    })
  }
  iphoneQQVersion() {
    QQ.iphoneQQVersion( (data) =>{
      console.log("iphoneQQVersion = " + data);
    })
  }

  render() {
    return (
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <Text
          style={{width: 200,height:20,borderWidth:1/PixelRatio.get(),textAlign:'center'}}
          onPress={this.iphoneQQInstalled.bind(this)}
        >发送纯文本</Text>
        <Text
          style={{width: 200,height:20,borderWidth:1/PixelRatio.get(),textAlign:'center'}}
          onPress={this.iphoneQQSupportSSOLogin.bind(this)}
        >发送图片</Text>
        <Text
          style={{width: 200,height:20,borderWidth:1/PixelRatio.get(),textAlign:'center'}}
          onPress={this.iphoneQZoneInstalled.bind(this)}
        >发送链接</Text>
        <Text
          style={{width: 200,height:20,borderWidth:1/PixelRatio.get(),textAlign:'center'}}
          onPress={this.iphoneQZoneSupportSSOLogin.bind(this)}
        >发送音乐</Text>
        <Text
          style={{width: 200,height:20,borderWidth:1/PixelRatio.get(),textAlign:'center'}}
          onPress={this.sdkVersion.bind(this)}
        >发送视频</Text>
        <Text
          style={{width: 200,height:20,borderWidth:1/PixelRatio.get(),textAlign:'center'}}
          onPress={this.sdkSubVersion.bind(this)}
        >发送App</Text>
        <Text
          style={{width: 200,height:20,borderWidth:1/PixelRatio.get(),textAlign:'center'}}
          onPress={this.iphoneQQVersion.bind(this)}
        >发送NonGif</Text>
        <Text
          style={{width: 200,height:20,borderWidth:1/PixelRatio.get(),textAlign:'center'}}
          onPress={this.isCanShareInWeiboAPP.bind(this)}
        >发送Gif</Text>
        <Text
          style={{width: 200,height:20,borderWidth:1/PixelRatio.get(),textAlign:'center'}}
          onPress={this.isCanSSOInWeiboApp.bind(this)}
        >发送File</Text>
        <Text
          style={{width: 200,height:20,borderWidth:1/PixelRatio.get(),textAlign:'center'}}
          onPress={this.openWeiboApp.bind(this)}
        >登陆授权</Text>
        <Text style={{borderWidth:1/PixelRatio.get()}}>{this.state.data}</Text>
        <Text style={{borderWidth:1/PixelRatio.get()}}>{this.state.path}</Text>

        <Image
          style={{width:1,height:1}}
          source={require('./jpg/tampon0.jpg')}
        />

      </View>
    );
  }
}

