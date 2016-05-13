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
  
  return [TencentOAuth HandleOpenURL:url];
}

// QQSDK要求必须在主线程调用授权方法,否则会抛出异常
- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}


RCT_EXPORT_MODULE(QQ)

RCT_EXPORT_METHOD(authorize:(NSDictionary *)config : (RCTResponseSenderBlock)callback) {
  
  NSLog(@"申请QQ授权");
  
  NSString *appId = [config objectForKey:@"appId"];
  authCallback = callback;
  
  self.tencentOAuth = [[TencentOAuth alloc]initWithAppId:appId andDelegate:self];
  
//  NSMutableArray *permissions = [config objectForKey:@"permissions"];
//  if (permissions.count == 0) {
//    NSArray * defaultPermissions = [NSArray arrayWithObjects:
//                                    kOPEN_PERMISSION_GET_USER_INFO,
//                                    kOPEN_PERMISSION_GET_SIMPLE_USER_INFO,
//                                    kOPEN_PERMISSION_ADD_SHARE,
//                                    nil];
//    [permissions addObjectsFromArray:defaultPermissions];
//  }
//  
  [self.tencentOAuth authorize:nil];
}

- (void)tencentDidLogin {
  
  NSLog(@"授权登录");
  
  [self.tencentOAuth getUserInfo];
  
  if(self.tencentOAuth.accessToken && self.tencentOAuth.accessToken.length != 0){
    NSLog(@"%@",self.tencentOAuth.accessToken);
    NSString *openId = self.tencentOAuth.openId;
    NSString *accessToken = self.tencentOAuth.accessToken;
    NSInteger expiresInSecond = [self.tencentOAuth.expirationDate timeIntervalSinceNow];
    
    NSMutableDictionary *results = [[NSMutableDictionary alloc]initWithCapacity:4];
    
    if (openId) {
      [results setValue:openId forKey:@"openId"];
    }
    if (accessToken) {
      [results setValue:accessToken forKey:@"accessToken"];
    }
    if (expiresInSecond > 0) {
      [results setValue:[NSNumber numberWithInteger: expiresInSecond] forKey:@"expiresInSecond"];
    }
    
    authCallback(@[results]);
    authCallback = nil;
  }
}

- (void)getUserInfoResponse:(APIResponse *)response {
  NSLog(@"获取用户信息");
  
  NSLog(@"%@",response.jsonResponse);
  
}

- (void)tencentDidNotLogin:(BOOL)cancelled {
  
  NSMutableDictionary *error = [[NSMutableDictionary alloc]init];
  if (cancelled) {
    [error setValue:[NSNumber numberWithBool:YES] forKey:@"cancel"];
  } else {
    [error setValue:@"不知名原因导致登陆失败" forKey:@"error"];
  }
  
  authCallback(@[error]);
  authCallback = nil;
  
}

- (void)tencentDidNotNetWork {
  
  NSMutableDictionary *error = [[NSMutableDictionary alloc]init];
  [error setValue:@"当前网络不可用,请设置网络" forKey:@"error"];
  
  authCallback(@[error]);
  authCallback = nil;
}

- (void)dealloc {
  NSLog(@"%@结束了",self.class);
}

@end
