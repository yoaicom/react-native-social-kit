//
//  QQModule.m
//  ReactAppBase
//
//  Created by 张天 on 16/3/8.
//  Copyright © 2016年 YOAI. All rights reserved.
//

#import "QQModule.h"

static RCTResponseSenderBlock authCallback;

@implementation QQModule

+ (BOOL)handleOpenURL:(NSURL *)url {
  NSLog(@"%@", @"qq handle");
  return [TencentOAuth HandleOpenURL:url];
}

// QQSDK要求必须在主线程调用授权方法

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE(QQ);
//注册App
RCT_EXPORT_METHOD(registerApp : (NSDictionary *)config : (RCTResponseSenderBlock)callback) {
  NSLog(@"%@", @"注册QQ");
  self.tencentOAuth = [[TencentOAuth alloc] initWithAppId:[config objectForKey:@"appId"] andDelegate:self];
}

//判断是否安装了QQ
RCT_EXPORT_METHOD(iphoneQQInstalled : (RCTResponseSenderBlock)callback) {

  NSString *result = [NSString stringWithFormat:@"%d", [TencentOAuth iphoneQQInstalled]];

  callback(@[result]);
}
//判断是否支持SSO授权登录QQ
RCT_EXPORT_METHOD(iphoneQQSupportSSOLogin : (RCTResponseSenderBlock)callback) {

  NSString *result = [NSString stringWithFormat:@"%d", [TencentOAuth iphoneQQSupportSSOLogin]];

  callback(@[result]);
}
//判断是否安装了QQZone
RCT_EXPORT_METHOD(iphoneQZoneInstalled : (RCTResponseSenderBlock)callback) {

  NSString *result = [NSString stringWithFormat:@"%d", [TencentOAuth iphoneQZoneInstalled]];

  callback(@[result]);
}
//判断是否支持SSO授权登录QQZone
RCT_EXPORT_METHOD(iphoneQZoneSupportSSOLogin : (RCTResponseSenderBlock)callback) {

  NSString *result = [NSString stringWithFormat:@"%d", [TencentOAuth iphoneQZoneSupportSSOLogin]];

  callback(@[result]);
}
//用来获得当前sdk的版本号
RCT_EXPORT_METHOD(sdkVersion : (RCTResponseSenderBlock)callback) {

  NSString *result = [TencentOAuth sdkVersion];

  callback(@[result]);
}
//用来获得当前sdk的小版本号
RCT_EXPORT_METHOD(sdkSubVersion : (RCTResponseSenderBlock)callback) {

  NSString *result = [TencentOAuth sdkSubVersion];

  callback(@[result]);
}
//获取手机QQ版本号
RCT_EXPORT_METHOD(iphoneQQVersion : (RCTResponseSenderBlock)callback) {

  NSString *result = [NSString stringWithFormat:@"%d", [TencentOAuth iphoneQQVersion]];

  callback(@[result]);
}

- (BOOL)onTencentReq:(TencentApiReq *)req {
  NSLog(@"%s", __FUNCTION__);
  NSLog(@"%@", @"接收req");
  return YES;
}

- (BOOL)onTencentResp:(TencentApiResp *)resp {
  NSLog(@"%s", __FUNCTION__);
  NSLog(@"%@", @"接收resp");
  return YES;
}
//视频
RCT_EXPORT_METHOD(sendVideo : (NSDictionary *)config : (RCTResponseSenderBlock)callback) {

  NSLog(@"%@", @"qq视频分享");

  QQApiVideoObject *videoObject =
  [QQApiAudioObject objectWithURL:[NSURL URLWithString:[config objectForKey:@"url"]]
                            title:[config objectForKey:@"title"]
                      description:[config objectForKey:@"description"]
                  previewImageURL:[NSURL URLWithString:[config objectForKey:@"previewImageURL"]]];

  [videoObject setFlashURL:[NSURL URLWithString:[config objectForKey:@"flashURL"]]];

  [self sendReqWithObject:videoObject config:config callback:callback];
}
//音频
RCT_EXPORT_METHOD(sendMusic : (NSDictionary *)config : (RCTResponseSenderBlock)callback) {

  NSLog(@"%@", @"qq音乐分享");

  QQApiAudioObject *audioObject =
  [QQApiAudioObject objectWithURL:[NSURL URLWithString:[config objectForKey:@"url"]]
                            title:[config objectForKey:@"title"]
                      description:[config objectForKey:@"description"]
                  previewImageURL:[NSURL URLWithString:[config objectForKey:@"previewImageURL"]]];

  [audioObject setFlashURL:[NSURL URLWithString:[config objectForKey:@"flashURL"]]];

  [self sendReqWithObject:audioObject config:config callback:callback];
}
//网页链接
RCT_EXPORT_METHOD(sendWebPage : (NSDictionary *)config : (RCTResponseSenderBlock)callback) {

  NSLog(@"%@", @"qq网页分享");

  QQApiNewsObject *newsObject = [QQApiNewsObject objectWithURL:[NSURL URLWithString:[config objectForKey:@"url"]]
                                                         title:[config objectForKey:@"title"]
                                                   description:[config objectForKey:@"description"]
                                               previewImageURL:[NSURL URLWithString:[config objectForKey:@"previewImageURL"]]];

  [self sendReqWithObject:newsObject config:config callback:callback];
}
//多图收藏
RCT_EXPORT_METHOD(sendImageArray : (NSDictionary *)config : (RCTResponseSenderBlock)callback) {

  NSLog(@"%@", @"qq多图分享");

  NSArray *array = [config objectForKey:@"imageArray"];
  NSMutableArray *images = [NSMutableArray arrayWithCapacity:array.count];
  NSData *data = [NSData dataWithContentsOfFile:array[0]];

  [array enumerateObjectsUsingBlock:^(NSString *obj, NSUInteger idx, BOOL *_Nonnull stop) {
    NSData *data = [NSData dataWithContentsOfFile:obj];
    [images addObject:data];
  }];

  QQApiImageObject *imageObject = [QQApiImageObject objectWithData:data
                                                  previewImageData:[config objectForKey:@"previewImagePath"]
                                                             title:[config objectForKey:@"title"]
                                                       description:[config objectForKey:@"description"]
                                                    imageDataArray:images];

  [imageObject setCflag:kQQAPICtrlFlagQQShareFavorites];

  [self sendReqWithObject:imageObject config:config callback:callback];
}
//图片
RCT_EXPORT_METHOD(sendImage : (NSDictionary *)config : (RCTResponseSenderBlock)callback) {

  NSLog(@"%@", @"qq图片分享");

  NSData *data = [NSData dataWithContentsOfFile:[config objectForKey:@"imagePath"]];
  NSData *previewImageData = [NSData dataWithContentsOfFile:[config objectForKey:@"previewImagePath"]];

  QQApiImageObject *imageObject = [QQApiImageObject objectWithData:data
                                                  previewImageData:previewImageData
                                                             title:[config objectForKey:@"title"]
                                                       description:[config objectForKey:@"description"]];

  [self sendReqWithObject:imageObject config:config callback:callback];
}
//纯文本
RCT_EXPORT_METHOD(sendText : (NSDictionary *)config : (RCTResponseSenderBlock)callback) {

  NSLog(@"%@", @"qq文本分享");

  QQApiTextObject *message = [QQApiTextObject objectWithText:[config objectForKey:@"text"]];

  [self sendReqWithObject:message config:config callback:callback];
}
//授权登录
RCT_EXPORT_METHOD(authorize : (NSDictionary *)config : (RCTResponseSenderBlock)callback) {

  NSLog(@"申请QQ授权");

  authCallback = callback;

  NSMutableArray *permissions = [config objectForKey:@"permissions"];
  if (permissions.count == 0) {
    NSArray *defaultPermissions =
    [NSArray arrayWithObjects:kOPEN_PERMISSION_GET_USER_INFO, kOPEN_PERMISSION_GET_SIMPLE_USER_INFO, kOPEN_PERMISSION_ADD_SHARE, nil];
    [permissions addObjectsFromArray:defaultPermissions];
  }

  [self.tencentOAuth authorize:permissions];
}

- (void)sendReqWithObject:(QQApiObject *)object config:(NSDictionary *)config callback:(RCTResponseSenderBlock)callback {

  NSString *scene = [config objectForKey:@"scene"];

  NSMutableString *resultCode;

  SendMessageToQQReq *req = [SendMessageToQQReq reqWithContent:object];

  if ([scene isEqualToString:@"Qzone"]) {
    resultCode = [NSMutableString stringWithFormat:@"%d", [QQApiInterface SendReqToQZone:req]];
  }
  if ([scene isEqualToString:@"QQGroup"]) {
    resultCode = [NSMutableString stringWithFormat:@"%d", [QQApiInterface SendReqToQQGroupTribe:req]];
  } else {
    resultCode = [NSMutableString stringWithFormat:@"%d", [QQApiInterface sendReq:req]];
  }

  callback(@[resultCode]);
}

- (void)tencentDidLogin {

  NSLog(@"授权登录");

  [self.tencentOAuth getUserInfo];

  if (self.tencentOAuth.accessToken && self.tencentOAuth.accessToken.length != 0) {
    NSLog(@"%@", self.tencentOAuth.accessToken);
    NSString *openId = self.tencentOAuth.openId;
    NSString *accessToken = self.tencentOAuth.accessToken;
    NSInteger expiresInSecond = [self.tencentOAuth.expirationDate timeIntervalSinceNow];

    NSMutableDictionary *results = [[NSMutableDictionary alloc] initWithCapacity:4];

    if (openId) {
      [results setValue:openId forKey:@"openId"];
    }
    if (accessToken) {
      [results setValue:accessToken forKey:@"accessToken"];
    }
    if (expiresInSecond > 0) {
      [results setValue:[NSNumber numberWithInteger:expiresInSecond] forKey:@"expiresInSecond"];
    }

    authCallback(@[results]);
    authCallback = nil;
  }
}

- (void)getUserInfoResponse:(APIResponse *)response {
  NSLog(@"获取用户信息");

  NSLog(@"%@", response.jsonResponse);
}

- (void)tencentDidNotLogin:(BOOL)cancelled {

  NSMutableDictionary *error = [[NSMutableDictionary alloc] init];
  if (cancelled) {
    [error setValue:[NSNumber numberWithBool:YES] forKey:@"cancel"];
  } else {
    [error setValue:@"不知名原因导致登陆失败" forKey:@"error"];
  }

  authCallback(@[error]);
  authCallback = nil;
}

- (void)tencentDidNotNetWork {

  NSMutableDictionary *error = [[NSMutableDictionary alloc] init];
  [error setValue:@"当前网络不可用,请设置网络" forKey:@"error"];

  authCallback(@[error]);
  authCallback = nil;
}

- (void)dealloc {
  NSLog(@"%@结束了", self.class);
}

@end
