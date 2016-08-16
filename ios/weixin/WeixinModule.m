//
//  WeixinModule.m
//  Demo
//
//  Created by 张天 on 16/8/1.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#define BUFFER_SIZE 1024 * 100

#import "RCTImageLoader.h"
#import "WeixinModule.h"

static RCTResponseSenderBlock authCallback;
static RCTResponseSenderBlock shareCallback;
static RCTResponseSenderBlock payCallback;

@implementation WeixinModule

@synthesize bridge = _bridge;

+ (BOOL)handleOpenURL:(NSURL *)url {
  WeixinModule *module = [[WeixinModule alloc] init];
  return [WXApi handleOpenURL:url delegate:module];
}

RCT_EXPORT_MODULE(Weixin);
//注册App
RCT_EXPORT_METHOD(registerApp
                  : (NSDictionary *)config
                  : (RCTResponseSenderBlock)callback) {
  NSString *appId = [config objectForKey:@"appId"];
  [WXApi registerApp:appId];
}
//判断微信是否登录
RCT_EXPORT_METHOD(isWXAppInstalled : (RCTResponseSenderBlock)callback) {
  NSString *result =
      [NSString stringWithFormat:@"%d", [WXApi isWXAppInstalled]];

  callback(@[ result ]);
}
//判断微信是否支持Api
RCT_EXPORT_METHOD(isWXAppSupportApi : (RCTResponseSenderBlock)callback) {
  NSString *result =
      [NSString stringWithFormat:@"%d", [WXApi isWXAppSupportApi]];

  callback(@[ result ]);
}
//打开微信
RCT_EXPORT_METHOD(openWXApp : (RCTResponseSenderBlock)callback) {
  NSString *result = [NSString stringWithFormat:@"%d", [WXApi openWXApp]];

  callback(@[ result ]);
}
//获取微信的iTunes安装地址
RCT_EXPORT_METHOD(getWXAppInstallUrl : (RCTResponseSenderBlock)callback) {
  NSString *result = [WXApi getWXAppInstallUrl];

  callback(@[ result ]);
}
//获取Api版本
RCT_EXPORT_METHOD(getApiVersion : (RCTResponseSenderBlock)callback) {
  NSString *result = [WXApi getApiVersion];

  callback(@[ result ]);
}

//支付
RCT_EXPORT_METHOD(pay
                  : (NSDictionary *)config
                  : (RCTResponseSenderBlock)callback) {

  payCallback = callback;

  NSString *urlString = [config objectForKey:@"url"];
  //解析服务端返回json数据
  NSError *error;
  //加载一个NSURL对象
  NSURLRequest *request =
      [NSURLRequest requestWithURL:[NSURL URLWithString:urlString]];
  //将请求的url数据放到NSData对象中
  NSData *response = [NSURLConnection sendSynchronousRequest:request
                                           returningResponse:nil
                                                       error:nil];
  if (response != nil) {
    NSMutableDictionary *dict = NULL;
    // IOS5自带解析类NSJSONSerialization从response中解析出数据放到字典中
    dict = [NSJSONSerialization JSONObjectWithData:response
                                           options:NSJSONReadingMutableLeaves
                                             error:&error];

    NSLog(@"url:%@", urlString);
    if (dict != nil) {
      NSMutableString *retcode = [dict objectForKey:@"retcode"];
      if (retcode.intValue == 0) {
        NSMutableString *stamp = [dict objectForKey:@"timestamp"];

        //调起微信支付
        PayReq *req = [[PayReq alloc] init];
        req.partnerId = [dict objectForKey:@"partnerid"];
        req.prepayId = [dict objectForKey:@"prepayid"];
        req.nonceStr = [dict objectForKey:@"noncestr"];
        req.timeStamp = stamp.intValue;
        req.package = [dict objectForKey:@"package"];
        req.sign = [dict objectForKey:@"sign"];
        [WXApi sendReq:req];
        //日志输出
        NSLog(@"appid=%@\npartid=%@\nprepayid=%@\nnoncestr=%@\ntimestamp=%"
              @"ld\npackage=%@\nsign=%@",
              [dict objectForKey:@"appid"], req.partnerId, req.prepayId,
              req.nonceStr, (long)req.timeStamp, req.package, req.sign);
        //        callback(@[ @"" ]);
      } else {
        //        callback(@[ [dict objectForKey:@"retmsg"] ]);
      }
    } else {
      //      callback(@[ @"服务器返回错误，未获取到json对象" ]);
    }
  } else {
    //    return callback(@[ @"服务器返回错误" ]);
  }
}

//授权登录
RCT_EXPORT_METHOD(authorize
                  : (NSDictionary *)config
                  : (RCTResponseSenderBlock)callback) {

  authCallback = callback;

  SendAuthReq *req = [[SendAuthReq alloc] init];
  req.scope = [config objectForKey:@"scope"];
  req.state = [config objectForKey:@"state"];
  //第三方向微信终端发送一个SendAuthReq消息结构
  [WXApi sendReq:req];
}

//文件
RCT_EXPORT_METHOD(sendFile
                  : (NSDictionary *)config
                  : (RCTResponseSenderBlock)callback) {
  shareCallback = callback;

  WXMediaMessage *message = [self getMessageWithConfig:config];

  WXFileObject *fileObject = [WXFileObject object];
  fileObject.fileExtension = [config objectForKey:@"fileExtension"];
  fileObject.fileData =
      [NSData dataWithContentsOfFile:[config objectForKey:@"filePath"]];

  message.mediaObject = fileObject;

  [self getThumbImageWithConfig:config andSendMessage:message];
}

// gif表情
RCT_EXPORT_METHOD(sendGif
                  : (NSDictionary *)config
                  : (RCTResponseSenderBlock)callback) {
  shareCallback = callback;

  WXMediaMessage *message = [self getMessageWithConfig:config];

  WXEmoticonObject *emoObject = [WXEmoticonObject object];
  emoObject.emoticonData =
      [NSData dataWithContentsOfFile:[config objectForKey:@"gifPath"]];

  message.mediaObject = emoObject;

  [self getThumbImageWithConfig:config andSendMessage:message];
}

//图片表情
RCT_EXPORT_METHOD(sendNonGif
                  : (NSDictionary *)config
                  : (RCTResponseSenderBlock)callback) {
  shareCallback = callback;

  WXMediaMessage *message = [self getMessageWithConfig:config];

  WXEmoticonObject *emoObject = [WXEmoticonObject object];

  emoObject.emoticonData =
      [NSData dataWithContentsOfFile:[config objectForKey:@"nonGifPath"]];

  message.mediaObject = emoObject;

  [self getThumbImageWithConfig:config andSendMessage:message];
}

// App
RCT_EXPORT_METHOD(sendApp
                  : (NSDictionary *)config
                  : (RCTResponseSenderBlock)callback) {
  shareCallback = callback;

  WXMediaMessage *message = [self getMessageWithConfig:config];

  WXAppExtendObject *appObject = [WXAppExtendObject object];
  appObject.extInfo = [config objectForKey:@"extInfo"];
  appObject.url = [config objectForKey:@"url"];

  Byte *pBuffer = (Byte *)malloc(BUFFER_SIZE);
  memset(pBuffer, 0, BUFFER_SIZE);
  NSData *data = [NSData dataWithBytes:pBuffer length:BUFFER_SIZE];
  free(pBuffer);

  appObject.fileData = data;

  message.mediaObject = appObject;

  [self getThumbImageWithConfig:config andSendMessage:message];
}

//视频
RCT_EXPORT_METHOD(sendVideo
                  : (NSDictionary *)config
                  : (RCTResponseSenderBlock)callback) {
  shareCallback = callback;

  WXMediaMessage *message = [self getMessageWithConfig:config];

  WXVideoObject *videoObject = [WXVideoObject object];
  videoObject.videoUrl = [config objectForKey:@"videoUrl"];
  videoObject.videoLowBandUrl = [config objectForKey:@"videoLowBandUrl"];

  message.mediaObject = videoObject;

  [self getThumbImageWithConfig:config andSendMessage:message];
}

//音乐
RCT_EXPORT_METHOD(sendMusic
                  : (NSDictionary *)config
                  : (RCTResponseSenderBlock)callback) {
  shareCallback = callback;

  WXMediaMessage *message = [self getMessageWithConfig:config];

  WXMusicObject *musicObject = [WXMusicObject object];
  musicObject.musicUrl = [config objectForKey:@"musicUrl"];
  musicObject.musicDataUrl = [config objectForKey:@"musicDataUrl"];
  musicObject.musicLowBandUrl = [config objectForKey:@"musicLowBandUrl"];
  musicObject.musicLowBandDataUrl =
      [config objectForKey:@"musicLowBandDataUrl"];

  message.mediaObject = musicObject;

  [self getThumbImageWithConfig:config andSendMessage:message];
}

//网页link
RCT_EXPORT_METHOD(sendWeb
                  : (NSDictionary *)config
                  : (RCTResponseSenderBlock)callback) {

  shareCallback = callback;
  WXMediaMessage *message = [self getMessageWithConfig:config];

  WXWebpageObject *webpageObject = [WXWebpageObject object];
  webpageObject.webpageUrl = [config objectForKey:@"webpageUrl"];

  message.mediaObject = webpageObject;

  [self getThumbImageWithConfig:config andSendMessage:message];
}

// 纯图片
RCT_EXPORT_METHOD(sendImage
                  : (NSDictionary *)config
                  : (RCTResponseSenderBlock)callback) {

  shareCallback = callback;

  WXMediaMessage *message = [self getMessageWithConfig:config];

  WXImageObject *imageObject = [WXImageObject object];
  imageObject.imageData =
      [NSData dataWithContentsOfFile:[config objectForKey:@"imagePath"]];

  message.mediaObject = imageObject;

  [self getThumbImageWithConfig:config andSendMessage:message];
}

// 纯文本
RCT_EXPORT_METHOD(sendText
                  : (NSDictionary *)config
                  : (RCTResponseSenderBlock)callback) {
  shareCallback = callback;

  //分享方式选择(对话,朋友圈,收藏)
  int scene = [self judgeSceneTypeWithConfig:config];

  SendMessageToWXReq *req = [[SendMessageToWXReq alloc] init];
  req.text = [config objectForKey:@"text"];
  req.bText = YES;
  req.scene = scene;
  [WXApi sendReq:req];
}

- (WXMediaMessage *)getMessageWithConfig:(NSDictionary *)config {
  WXMediaMessage *message = [WXMediaMessage message];
  message.title = [config objectForKey:@"title"];
  message.description = [config objectForKey:@"description"];
  return message;
}

- (void)getThumbImageWithConfig:(NSDictionary *)config
                 andSendMessage:(WXMediaMessage *)message {
  NSString *thumbImage = [config objectForKey:@"thumbImage"];
  __weak typeof(self) weakSelf = self;
  if (thumbImage.length && _bridge.imageLoader) {
    NSURLRequest *request =
        [NSURLRequest requestWithURL:[NSURL URLWithString:thumbImage]];
    [_bridge.imageLoader
        loadImageWithURLRequest:request
                           size:CGSizeMake(100, 100)
                          scale:1
                        clipped:FALSE
                     resizeMode:RCTResizeModeStretch
                  progressBlock:nil
                completionBlock:^(NSError *error, UIImage *image) {
                  [message setThumbImage:image];
                  [weakSelf sendReqWithMessage:message config:config];
                }];
  } else {
    [message setThumbImage:nil];
    [weakSelf sendReqWithMessage:message config:config];
  }
}

- (void)sendReqWithMessage:(WXMediaMessage *)message
                    config:(NSDictionary *)config {

  int scene = [self judgeSceneTypeWithConfig:config];

  SendMessageToWXReq *req = [[SendMessageToWXReq alloc] init];
  req.bText = NO;
  req.message = message;
  req.scene = scene;

  [WXApi sendReq:req];
}

- (int)judgeSceneTypeWithConfig:(NSDictionary *)config {

  NSString *sceneName = [config objectForKey:@"scene"];

  if ([sceneName isEqualToString:@"WXSceneTimeline"]) {
    return 1;
  } else if ([sceneName isEqualToString:@"WXSceneFavorite"]) {
    return 2;
  } else
    return 0;
}

- (void)onReq:(BaseReq *)req {
  NSLog(@"收到req");
}

- (void)onResp:(BaseResp *)resp {
  if ([resp isKindOfClass:[SendAuthResp class]]) {
    SendAuthResp *authResp = (SendAuthResp *)resp;
    NSString *code = authResp.code;
    NSString *country = authResp.country;
    NSString *lang = authResp.lang;
    NSString *state = authResp.state;

    NSMutableDictionary *results =
        [[NSMutableDictionary alloc] initWithCapacity:4];
    if (code) {
      [results setObject:code forKey:@"code"];
    }
    if (country) {
      [results setObject:country forKey:@"country"];
    }
    if (lang) {
      [results setObject:lang forKey:@"lang"];
    }
    if (state) {
      [results setObject:state forKey:@"state"];
    }

    authCallback(@[ results ]);
    authCallback = nil;
  } else if ([resp isKindOfClass:[SendMessageToWXResp class]]) {
    SendMessageToWXResp *messageResp = (SendMessageToWXResp *)resp;
    NSString *errCode = [NSString stringWithFormat:@"%d", messageResp.errCode];
    NSString *errStr = messageResp.errStr;
    NSString *type = [NSString stringWithFormat:@"%d", messageResp.type];
    NSString *lang = messageResp.lang;
    NSString *country = messageResp.country;

    NSMutableDictionary *results =
        [[NSMutableDictionary alloc] initWithCapacity:5];
    if (errCode) {
      [results setObject:errCode forKey:@"errCode"];
    }
    if (errStr) {
      [results setObject:errStr forKey:@"errStr"];
    }
    if (type) {
      [results setObject:type forKey:@"type"];
    }
    if (lang) {
      [results setObject:lang forKey:@"lang"];
    }
    if (country) {
      [results setObject:country forKey:@"country"];
    }

    shareCallback(@[ results ]);
    shareCallback = nil;
  } else if ([resp isKindOfClass:[PayResp class]]) {
    PayResp *payResp = (PayResp *)resp;

    NSString *errCode = [NSString stringWithFormat:@"%d", payResp.errCode];
    NSString *errStr = payResp.errStr;
    NSString *type = [NSString stringWithFormat:@"%d", payResp.type];
    NSString *returnKey = payResp.returnKey;

    NSMutableDictionary *results =
        [[NSMutableDictionary alloc] initWithCapacity:5];
    if (errCode) {
      [results setObject:errCode forKey:@"errCode"];
    }
    if (errStr) {
      [results setObject:errStr forKey:@"errStr"];
    }
    if (type) {
      [results setObject:type forKey:@"type"];
    }
    if (returnKey) {
      [results setObject:returnKey forKey:@"returnKey"];
    }

    payCallback(@[ results ]);
  }
}

- (void)dealloc {
  NSLog(@"%@结束了", self.class);
}

@end