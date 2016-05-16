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
  NSString *appId = [config objectForKey:@"appId"];
  authCallback = callback;
  
  self.tencentOAuth = [[TencentOAuth alloc]initWithAppId:appId andDelegate:self];

  [self.tencentOAuth authorize:nil];
}

- (void)tencentDidLogin {
  [self.tencentOAuth getUserInfo];
  
  NSString *openId = self.tencentOAuth.openId;
  NSString *accessToken = self.tencentOAuth.accessToken;
  NSInteger expiresInSeconds = [self.tencentOAuth.expirationDate timeIntervalSinceNow];
  
  NSMutableDictionary *results = [[NSMutableDictionary alloc]initWithCapacity:4];
  
  if (openId) {
    [results setValue:openId forKey:@"openId"];
  }
  if (accessToken) {
    [results setValue:accessToken forKey:@"accessToken"];
  }
  if (expiresInSeconds > 0) {
    [results setValue:[NSNumber numberWithInteger: expiresInSeconds] forKey:@"expiresInSeconds"];
  }
  
  authCallback(@[results]);
  authCallback = nil;
}

- (void)getUserInfoResponse:(APIResponse *)response {
  
}

- (void)tencentDidNotLogin:(BOOL)cancelled {
  
  NSMutableDictionary *error = [[NSMutableDictionary alloc]init];
  if (cancelled) {
    [error setValue:[NSNumber numberWithBool:YES] forKey:@"cancel"];
  } else {
    [error setValue:@"unknown error" forKey:@"error"];
  }
  
  authCallback(@[error]);
  authCallback = nil;
}

- (void)tencentDidNotNetWork {
  NSMutableDictionary *error = [[NSMutableDictionary alloc]init];
  [error setValue:@"network error" forKey:@"error"];
  
  authCallback(@[error]);
  authCallback = nil;
}

@end
