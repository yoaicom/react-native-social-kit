#import "WeiboModule.h"

static RCTResponseSenderBlock authCallback;

@implementation WeiboModule


RCT_EXPORT_MODULE(Weibo);

RCT_EXPORT_METHOD(authorize:(NSDictionary *)config : (RCTResponseSenderBlock)callback) {
  NSLog(@"authorize...");
  NSString *appId = [config objectForKey:@"appId"];
  
  [WeiboSDK enableDebugMode:YES];
  [WeiboSDK registerApp:appId];
  
  authCallback = callback;
  WBAuthorizeRequest *request = [WBAuthorizeRequest request];
  request.redirectURI = [config objectForKey:@"redirectUrl"];
  request.scope = [config objectForKey:@"scope"];
  [WeiboSDK sendRequest:request];
}

-(void)didReceiveWeiboRequest:(WBBaseRequest *)request {
  NSLog(@"didReceiveWeiboRequest...");
}

-(void)didReceiveWeiboResponse:(WBBaseResponse *)response {
  NSLog(@"didReceiveWeiboResponse...");
  if ([response isKindOfClass:WBAuthorizeResponse.class]) {
    WBAuthorizeResponse *authorizeResponse = (WBAuthorizeResponse *)response;
    NSString *uid = authorizeResponse.userID;
    NSString *accessToken = authorizeResponse.accessToken;
    NSString *refreshToken = authorizeResponse.refreshToken;
    NSInteger expiresInSeconds = [authorizeResponse.expirationDate timeIntervalSinceNow];
    NSLog(@"didReceiveWeiboResponse...uid=%@, accessToken=%@, refreshToken=%@, expiresInSeconds=%zd", uid, accessToken, refreshToken, expiresInSeconds);
    
    NSMutableDictionary *results = [NSMutableDictionary dictionaryWithCapacity:4];
    if(uid) {
      [results setValue:uid forKey:@"uid"];
    }
    if(accessToken) {
      [results setValue:accessToken forKey:@"accessToken"];
    }
    if(refreshToken) {
      [results setValue:refreshToken forKey:@"refreshToken"];
    }
    if(expiresInSeconds > 0) {
      [results setValue:[NSNumber numberWithInteger: expiresInSeconds] forKey:@"expiresInSeconds"];
    }
    
    authCallback(@[results]);
    authCallback = nil;
  }
}

+(BOOL)handleOpenURL:(NSURL *)url {
  NSLog(@"URL :%@ ",url);
  
  WeiboModule *weiboModule = [[WeiboModule alloc] init];
  return [WeiboSDK handleOpenURL:url delegate:weiboModule];
}

@end
