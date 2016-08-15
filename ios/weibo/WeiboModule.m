#import "WeiboModule.h"

static RCTResponseSenderBlock authCallback;
static RCTResponseSenderBlock shareCallback;
@implementation WeiboModule

RCT_EXPORT_MODULE(Weibo);
//注册
RCT_EXPORT_METHOD(registerApp : (NSDictionary *)config : (RCTResponseSenderBlock)callback) {
  NSLog(@"%@", @"注册微博");
  NSString *appKey = [config objectForKey:@"appKey"];
  [WeiboSDK registerApp:appKey];
}
//判断微博客户端是否安装
RCT_EXPORT_METHOD(isWeiboAppInstalled : (RCTResponseSenderBlock)callback) {
  NSString *result = [NSString stringWithFormat:@"%d", [WeiboSDK isWeiboAppInstalled]];

  callback(@[result]);
}
//判断微博是否支持分享
RCT_EXPORT_METHOD(isCanShareInWeiboAPP : (RCTResponseSenderBlock)callback) {
  NSString *result = [NSString stringWithFormat:@"%d", [WeiboSDK isCanShareInWeiboAPP]];

  callback(@[result]);
}
//判断是否支持SSO授权
RCT_EXPORT_METHOD(isCanSSOInWeiboApp : (RCTResponseSenderBlock)callback) {
  NSString *result = [NSString stringWithFormat:@"%d", [WeiboSDK isCanSSOInWeiboApp]];

  callback(@[result]);
}
//打开微博
RCT_EXPORT_METHOD(openWeiboApp : (RCTResponseSenderBlock)callback) {
  NSString *result = [NSString stringWithFormat:@"%d", [WeiboSDK openWeiboApp]];

  callback(@[result]);
}
//获取微博的App安装Url
RCT_EXPORT_METHOD(getWeiboAppInstallUrl : (RCTResponseSenderBlock)callback) {
  NSString *result = [WeiboSDK getWeiboAppInstallUrl];

  callback(@[result]);
}
//获取微博SDK版本号
RCT_EXPORT_METHOD(getSDKVersion : (RCTResponseSenderBlock)callback) {
  NSString *result = [WeiboSDK getSDKVersion];

  callback(@[result]);
}

//授权
RCT_EXPORT_METHOD(authorize : (NSDictionary *)config : (RCTResponseSenderBlock)callback) {
  NSLog(@"authorize...");

  [WeiboSDK enableDebugMode:YES];

  authCallback = callback;
  WBAuthorizeRequest *request = [WBAuthorizeRequest request];
  request.redirectURI = [config objectForKey:@"redirectUrl"];
  request.scope = [config objectForKey:@"scope"];
  [WeiboSDK sendRequest:request];
}
//视频链接+文字
RCT_EXPORT_METHOD(sendVideo : (NSDictionary *)config : (RCTResponseSenderBlock)callback) {
  shareCallback = callback;

  WBMessageObject *message = [self getMessageWithConfig:config];

  WBVideoObject *videoObject = [WBVideoObject object];

  videoObject.objectID = [config objectForKey:@"objectID"];
  videoObject.title = [config objectForKey:@"title"];
  videoObject.description = [config objectForKey:@"description"];
  videoObject.thumbnailData = [NSData dataWithContentsOfFile:[config objectForKey:@"thumbnail"]];

  videoObject.videoUrl = [config objectForKey:@"videoUrl"];
  videoObject.videoStreamUrl = [config objectForKey:@"videoStreamUrl"];
  videoObject.videoLowBandUrl = [config objectForKey:@"videoLowBandUrl"];
  videoObject.videoLowBandStreamUrl = [config objectForKey:@"videoLowBandStreamUrl"];

  message.mediaObject = videoObject;

  [self sendRequestWithMessage:message config:config];
}
//音乐链接+文字
RCT_EXPORT_METHOD(sendMusic : (NSDictionary *)config : (RCTResponseSenderBlock)callback) {

  shareCallback = callback;



  WBMessageObject *message = [self getMessageWithConfig:config];

  WBMusicObject *musicObject = [WBMusicObject object];

  musicObject.objectID = [config objectForKey:@"objectID"];
  musicObject.title = [config objectForKey:@"title"];
  musicObject.description = [config objectForKey:@"description"];
  musicObject.thumbnailData = [NSData dataWithContentsOfFile:[config objectForKey:@"thumbnail"]];

  musicObject.musicUrl = [config objectForKey:@"musicUrl"];
  musicObject.musicLowBandUrl = [config objectForKey:@"musicLowBandUrl"];
  musicObject.musicStreamUrl = [config objectForKey:@"musicStreamUrl"];
  musicObject.musicLowBandStreamUrl = [config objectForKey:@"musicLowBandStreamUrl"];

  message.mediaObject = musicObject;

  [self sendRequestWithMessage:message config:config];
}
//网页链接+文字
RCT_EXPORT_METHOD(sendWebPage : (NSDictionary *)config : (RCTResponseSenderBlock)callback) {

  shareCallback = callback;

  WBMessageObject *message = [self getMessageWithConfig:config];

  WBWebpageObject *webObject = [WBWebpageObject object];
  webObject.objectID = [config objectForKey:@"objectID"];
  webObject.title = [config objectForKey:@"title"];
  webObject.description = [config objectForKey:@"description"];
  webObject.thumbnailData = [NSData dataWithContentsOfFile:[config objectForKey:@"thumbnail"]];
  webObject.webpageUrl = [config objectForKey:@"webpageUrl"];

  message.mediaObject = webObject;

  [self sendRequestWithMessage:message config:config];
}
//图文
RCT_EXPORT_METHOD(sendImage : (NSDictionary *)config : (RCTResponseSenderBlock)callback) {
  shareCallback = callback;

  WBMessageObject *message = [self getMessageWithConfig:config];

  WBImageObject *imageObject = [WBImageObject object];
  imageObject.imageData = [NSData dataWithContentsOfFile:[config objectForKey:@"imagePath"]];
  message.imageObject = imageObject;

  [self sendRequestWithMessage:message config:config];
}

// 1纯文本
RCT_EXPORT_METHOD(sendText : (NSDictionary *)config : (RCTResponseSenderBlock)callback) {
  shareCallback = callback;

  WBMessageObject *message = [self getMessageWithConfig:config];

  [self sendRequestWithMessage:message config:config];
}

- (WBMessageObject *)getMessageWithConfig:(NSDictionary *)config {

  WBMessageObject *message = [WBMessageObject message];
  message.text = [config objectForKey:@"text"];
  return message;
}

- (void)sendRequestWithMessage:(WBMessageObject *)message config:(NSDictionary *)config {

  WBAuthorizeRequest *shareRequest = [WBAuthorizeRequest request];
  shareRequest.redirectURI = [config objectForKey:@"redirectURI"];
  shareRequest.scope = [config objectForKey:@"scope"];

  WBSendMessageToWeiboRequest *request =
  [WBSendMessageToWeiboRequest requestWithMessage:message authInfo:shareRequest access_token:nil];
  [WeiboSDK sendRequest:request];
}

- (void)didReceiveWeiboRequest:(WBBaseRequest *)request {
  NSLog(@"didReceiveWeiboRequest...");
}

- (void)didReceiveWeiboResponse:(WBBaseResponse *)response {
  NSLog(@"didReceiveWeiboResponse...");
  if ([response isKindOfClass:WBAuthorizeResponse.class]) {
    WBAuthorizeResponse *authorizeResponse = (WBAuthorizeResponse *)response;
    NSString *uid = authorizeResponse.userID;
    NSString *accessToken = authorizeResponse.accessToken;
    NSString *refreshToken = authorizeResponse.refreshToken;
    NSInteger expiresInSeconds = [authorizeResponse.expirationDate timeIntervalSinceNow];
    NSLog(@"didReceiveWeiboResponse...uid=%@, accessToken=%@, refreshToken=%@, expiresInSeconds=%zd", uid, accessToken,
          refreshToken, expiresInSeconds);

    NSMutableDictionary *results = [NSMutableDictionary dictionaryWithCapacity:4];
    if (uid) {
      [results setValue:uid forKey:@"uid"];
    }
    if (accessToken) {
      [results setValue:accessToken forKey:@"accessToken"];
    }
    if (refreshToken) {
      [results setValue:refreshToken forKey:@"refreshToken"];
    }
    if (expiresInSeconds > 0) {
      [results setValue:[NSNumber numberWithInteger:expiresInSeconds] forKey:@"expiresInSeconds"];
    }

    authCallback(@[results]);
    authCallback = nil;
  } else if ([response isKindOfClass:WBSendMessageToWeiboResponse.class]) {

    WBSendMessageToWeiboResponse *shareResponse = (WBSendMessageToWeiboResponse *)response;
    NSDictionary *userInfo = shareResponse.userInfo;
    NSDictionary *requestUserInfo = shareResponse.requestUserInfo;
    NSString *statusCode = [NSString stringWithFormat:@"%d", (int)response.statusCode];

    NSMutableDictionary *results = [[NSMutableDictionary alloc] initWithCapacity:3];

    if (userInfo) {
      [results setObject:userInfo forKey:@"userInfo"];
    }
    if (requestUserInfo) {
      [results setObject:requestUserInfo forKey:@"requestUserInfo"];
    }
    if (statusCode) {
      [results setObject:statusCode forKey:@"statusCode"];
    }

    shareCallback(@[results]);
  }
}

+ (BOOL)handleOpenURL:(NSURL *)url {
  NSLog(@"URL :%@ ", url);

  WeiboModule *weiboModule = [[WeiboModule alloc] init];
  return [WeiboSDK handleOpenURL:url delegate:weiboModule];
}

@end
