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
RCT_EXPORT_METHOD(registerApp : (NSString *)appId : (RCTResponseSenderBlock)callback) {
  NSLog(@"%@", @"注册QQ");
  BOOL appRegistered = NO;
  NSMutableDictionary *result = [NSMutableDictionary dictionaryWithCapacity:5];
  if (appId && appId.length > 0) {
    self.tencentOAuth = [[TencentOAuth alloc] initWithAppId:appId andDelegate:self];
    [result setValue:[NSNumber numberWithBool:[TencentOAuth iphoneQQInstalled]] forKey: @"iphoneQQInstalled"];
    [result setValue:[NSNumber numberWithBool:[TencentOAuth iphoneQZoneInstalled]] forKey: @"iphoneQZoneInstalled"];
    [result setValue:[NSNumber numberWithBool:[TencentOAuth iphoneQQSupportSSOLogin]] forKey: @"iphoneQQSupportSSOLogin"];
    [result setValue:[NSNumber numberWithBool:[TencentOAuth iphoneQZoneSupportSSOLogin]] forKey: @"iphoneQZoneSupportSSOLogin"];
    callback(@[result]);
  }
  
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

RCT_EXPORT_METHOD(share : (NSDictionary *)config : (RCTResponseSenderBlock)callback ) {
  QQApiObject *object;
  
  NSString *title = [config objectForKey:@"title"];
  NSString *description = [config objectForKey:@"description"];
  NSURL *previewImageURL = [NSURL URLWithString:[config objectForKey:@"thumb"]];

  NSURL *flashURL = [NSURL URLWithString:[config objectForKey:@"data"]];
  
  if ([config objectForKey:@"text"]) {
    object = (QQApiTextObject *)object;
    object = [QQApiTextObject objectWithText:[config objectForKey:@"text"]];
  } else if ([config objectForKey:@"image"]) {
    object = (QQApiImageObject *)object;
    NSString *imageUrl = [config objectForKey:@"image"];
    NSData *imageData;
    if ([[imageUrl substringToIndex:1] isEqualToString:@"/"]) {
      imageData = [NSData dataWithContentsOfFile:imageUrl];
    } else {
      imageData = [NSData dataWithContentsOfURL:[NSURL URLWithString:imageUrl]];
    }
    
    object = [QQApiImageObject objectWithData:imageData
                             previewImageData:imageData
                                        title:title
                                  description:description];
  } else if([config objectForKey:@"webpage"]) {
    object = (QQApiNewsObject *)object;
    object = (QQApiNewsObject *)[QQApiNewsObject objectWithURL:[NSURL URLWithString:[config objectForKey:@"webpage"]]
                                      title:title
                                description:description
                            previewImageURL:previewImageURL];
  } else if([config objectForKey:@"music"]) {
    object = (QQApiAudioObject *)object;
    object =
    (QQApiAudioObject *)[QQApiAudioObject objectWithURL:[NSURL URLWithString:[config objectForKey:@"music"]]
                              title:title
                        description:description
                    previewImageURL:previewImageURL];
    
    [(QQApiAudioObject *)object setFlashURL:flashURL];
    
  } else if([config objectForKey:@"video"]) {
    object = (QQApiVideoObject *)object;
    object =
    (QQApiVideoObject *)[QQApiVideoObject objectWithURL:[NSURL URLWithString:[config objectForKey:@"video"] ]
                              title:title
                        description:description
                    previewImageURL:previewImageURL];
    
    [(QQApiVideoObject *)object setFlashURL:flashURL];
  }
  
  NSString *scene = [config objectForKey:@"scene"];
  
  NSString *errorInfo;
  
  SendMessageToQQReq *req = [SendMessageToQQReq reqWithContent:object];
  
  if ([scene isEqualToString:@"qzone"]) {
    errorInfo = [self getErrorInfoWithInt: [QQApiInterface SendReqToQZone:req]];
  }  else {
    errorInfo = [self getErrorInfoWithInt:[QQApiInterface sendReq:req]];
  }
  callback(@[errorInfo]);
}

- (NSString *)getErrorInfoWithInt:(QQApiSendResultCode)code {
  NSString *errorInfo;
  switch (code) {
    case 0:
      errorInfo = @"SENDSUCESS";
      break;
    case 1:
      errorInfo = @"QQNOTINSTALLED";
      break;
    case 2:
      errorInfo = @"QQNOTSUPPORTAPI";
      break;
    case 3:
      errorInfo = @"MESSAGETYPEINVALID";
      break;
    case 4:
      errorInfo = @"MESSAGECONTENTNULL";
      break;
    case 5:
      errorInfo = @"MESSAGECONTENTINVALID";
      break;
    case 6:
      errorInfo = @"APPNOTREGISTED";
      break;
    case 7:
      errorInfo = @"APPSHAREASYNC";
      break;
    case 8:
      errorInfo = @"QQNOTSUPPORTAPI_WITH_ERRORSHOW";
      break;
    case -1:
      errorInfo = @"SENDFAILD";
      break;
    case 10000:
      errorInfo = @"QZONENOTSUPPORTTEXT";
      break;
    case 10001:
      errorInfo = @"QZONENOTSUPPORTIMAGE";
      break;
    default:
      break;
  }
  
  return errorInfo;
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

- (void)tencentDidLogin {
  
  NSLog(@"授权登录");
  
  [self.tencentOAuth getUserInfo];
  
  if (self.tencentOAuth.accessToken && self.tencentOAuth.accessToken.length != 0) {
    NSLog(@"%@", self.tencentOAuth.accessToken);
    NSString *openId = self.tencentOAuth.openId;
    NSString *accessToken = self.tencentOAuth.accessToken;
    NSInteger expiresInSecond = [self.tencentOAuth.expirationDate timeIntervalSinceNow];
    
    NSMutableDictionary *results = [[NSMutableDictionary alloc] initWithCapacity:4];
    [results setValue:openId forKey:@"openId"];
    [results setValue:accessToken forKey:@"accessToken"];
    [results setValue:[NSNumber numberWithInteger:expiresInSecond] forKey:@"expiresInSecond"];
    
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
    [error setValue:[NSNumber numberWithBool:YES] forKey:@"uesr cancel"];
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
