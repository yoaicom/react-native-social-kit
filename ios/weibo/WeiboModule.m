#define kDefaultScope  @""
#define kDefaultRedirectUrl @"https://api.weibo.com/oauth2/default.html"

#import "RCTImageLoader.h"
#import "WeiboModule.h"

static RCTResponseSenderBlock authCallback;
static RCTResponseSenderBlock shareCallback;

@implementation WeiboModule

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE(Weibo);
//注册
RCT_EXPORT_METHOD(registerApp : (NSString *)appKey : (RCTResponseSenderBlock)callback) {
  NSLog(@"%@", @"注册微博");
  BOOL appRegistered = NO;
  NSMutableDictionary *result = [NSMutableDictionary dictionaryWithCapacity:3];
  if (appKey !=nil && appKey.length > 0) {
    appRegistered = [WeiboSDK registerApp:appKey];
    [result setObject:[NSNumber numberWithBool:appRegistered] forKey:@"appRegistered"];
    [result setObject:[NSNumber numberWithBool:[WeiboSDK isWeiboAppInstalled]] forKey:@"weiboAppInstalled"];
    [result setObject:[NSNumber numberWithBool:[WeiboSDK isCanShareInWeiboAPP]] forKey:@"weiboAppCanShare"];
    [result setObject:[NSNumber numberWithBool:[WeiboSDK isCanSSOInWeiboApp]] forKey:@"weiboAppCanSSO"];
  }
  callback(@[result]);
}
//打开微博
RCT_EXPORT_METHOD(openWeiboApp : (RCTResponseSenderBlock)callback) {
  NSString *result = [NSString stringWithFormat:@"%d", [WeiboSDK openWeiboApp]];
  callback(@[result]);
}
//授权
RCT_EXPORT_METHOD(authorize : (NSDictionary *)config : (RCTResponseSenderBlock)callback) {
  NSLog(@"authorize...");
  
  [WeiboSDK enableDebugMode:YES];
  
  authCallback = callback;
  WBAuthorizeRequest *request = [WBAuthorizeRequest request];
  NSString *scope  = kDefaultScope;
  if ([config objectForKey:@"scope"]) {
    scope = [config objectForKey:@"scope"];
  }
  NSString *redirectURI = kDefaultRedirectUrl;
  if ([config objectForKey:@"redirectUrl"]) {
    redirectURI = [config objectForKey:@"redirectUrl"];
  }
  request.redirectURI = redirectURI;
  request.scope = scope;
  [WeiboSDK sendRequest:request];
}

RCT_EXPORT_METHOD(share: (NSDictionary *)config : (RCTResponseSenderBlock)callback) {
  NSLog(@"%s",__FUNCTION__);
  shareCallback = callback;
  WBMessageObject *message = [WBMessageObject message];
  
  NSString *scope  = kDefaultScope;
  if ([config objectForKey:@"scope"]) {
    scope = [config objectForKey:@"scope"];
  }
  NSString *redirectURI = kDefaultRedirectUrl;
  if ([config objectForKey:@"redirectUrl"]) {
    redirectURI = [config objectForKey:@"redirectUrl"];
  }
  
  WBAuthorizeRequest *shareRequest = [WBAuthorizeRequest request];
  shareRequest.scope = scope;
  shareRequest.redirectURI = redirectURI;
  
  NSString *title = [config objectForKey:@"title"];
  NSString *description = [config objectForKey:@"description"];
  NSString *objectID = [[NSUUID UUID] UUIDString];
  if ([config objectForKey:@"objectID"]) {
    objectID = [config objectForKey:@"objectID"];
  }
  NSString *thumb = [config objectForKey:@"thumb"];
  NSData *thumbData;
  if (thumb && thumb.length > 0) {
    if ([[thumb substringToIndex:1] isEqualToString:@"/"]) {
      thumbData = [NSData dataWithContentsOfFile:thumb];
    } else {
      thumbData = [NSData dataWithContentsOfURL:[NSURL URLWithString:thumb]];
      UIImage *resultImage = [UIImage imageWithData:thumbData];
      while (thumbData.length > 32000) {
        NSLog(@"图片大小为%f", thumbData.length);
        thumbData = UIImageJPEGRepresentation(resultImage, 0.9);
      }
    }
  }
  if ([config objectForKey:@"text"]) {
    message.text = [config objectForKey:@"text"];
  }
  if ([config objectForKey:@"image"]) {
    WBImageObject *imageObject = [WBImageObject object];
    NSString *imageUrl = [config objectForKey:@"image"];
    if ([[imageUrl substringToIndex:1] isEqualToString:@"/"] ) {
      imageObject.imageData = [NSData dataWithContentsOfFile:imageUrl];
    } else {
      NSData *imageData = [NSData dataWithContentsOfURL:[NSURL URLWithString:imageUrl]];
      imageObject.imageData = imageData;
    }
    message.imageObject = imageObject;
  }
  if ([config objectForKey:@"webpage"]) {
    WBWebpageObject *webObject = [WBWebpageObject object];
    webObject.objectID = objectID;
    webObject.title = title;
    webObject.description = description;
    webObject.thumbnailData = thumbData;
    webObject.webpageUrl = [config objectForKey:@"webpage"];
    message.mediaObject = webObject;
  } else if ([config objectForKey:@"music"]) {
    WBMusicObject *musicObject = [WBMusicObject object];
    
    musicObject.objectID = objectID;
    musicObject.title = title;
    musicObject.description = description;
    musicObject.thumbnailData = thumbData;
    
    musicObject.musicUrl = [config objectForKey:@"music"];
    musicObject.musicStreamUrl = [config objectForKey:@"data"];
    
    message.mediaObject = musicObject;
    
  } else if([config objectForKey:@"video"]) {
    WBVideoObject *videoObject = [WBVideoObject object];
    videoObject.objectID = objectID;
    videoObject.title = title;
    videoObject.description = description;
    videoObject.thumbnailData = thumbData;
    
    videoObject.videoUrl = [config objectForKey:@"video"];
    videoObject.videoStreamUrl = [config objectForKey:@"data"];
    message.mediaObject = videoObject;
  }
  
  WBSendMessageToWeiboRequest *request =
  [WBSendMessageToWeiboRequest requestWithMessage:message authInfo:shareRequest access_token:nil];
  [WeiboSDK sendRequest:request];
  
}

-(NSString *)getErrorInfoMessageWithStatusCode:(WeiboSDKResponseStatusCode)statusCode {
  NSString *errorInfo;
  switch (statusCode) {
    case -1:
      errorInfo = @"UserCancel";
      break;
    case -2:
      errorInfo = @"SentFail";
      break;
    case -3:
      errorInfo = @"AuthDeny";
      break;
    case -4:
      errorInfo = @"UserCancelInstall";
      break;
    case -8:
      errorInfo = @"ShareInSDKFailed";
      break;
    case -99:
      errorInfo = @"Unsupport";
      break;
    case -100:
      errorInfo = @"Unknown";
      break;
    default:
      break;
  }
  return errorInfo;
}

- (void)didReceiveWeiboRequest:(WBBaseRequest *)request {
  NSLog(@"didReceiveWeiboRequest...");
}

- (void)didReceiveWeiboResponse:(WBBaseResponse *)response {
  NSLog(@"didReceiveWeiboResponse...");
  
  NSMutableDictionary *result = [NSMutableDictionary dictionaryWithCapacity:10];
  NSDictionary *requestUserInfo = response.requestUserInfo;
  [result setValue:requestUserInfo forKey:@"requestUserInfo"];
  NSString *errorInfo =  [self getErrorInfoMessageWithStatusCode:response.statusCode];
  if ([response isKindOfClass:WBAuthorizeResponse.class]) {
    WBAuthorizeResponse *authorizeResponse = (WBAuthorizeResponse *)response;
    NSString *uid = authorizeResponse.userID;
    NSString *accessToken = authorizeResponse.accessToken;
    NSString *refreshToken = authorizeResponse.refreshToken;
    NSInteger expiresInSeconds = [authorizeResponse.expirationDate timeIntervalSinceNow];
    NSLog(@"didReceiveWeiboResponse...uid=%@, accessToken=%@, refreshToken=%@, expiresInSeconds=%zd", uid, accessToken,
          refreshToken, expiresInSeconds);
    [result setValue:uid forKey:@"uid"];
    [result setValue:accessToken forKey:@"accessToken"];
    [result setValue:refreshToken forKey:@"refreshToken"];
    [result setValue:[NSNumber numberWithInteger:expiresInSeconds] forKey:@"expiresInSeconds"];
    [result setValue:errorInfo forKey:@"errorInfo"];
    
    authCallback(@[result]);
    authCallback = nil;
  } else if ([response isKindOfClass:WBSendMessageToWeiboResponse.class]) {
    WBSendMessageToWeiboResponse *shareResponse = (WBSendMessageToWeiboResponse *)response;
    NSDictionary *userInfo = shareResponse.userInfo;
    NSDictionary *requestUserInfo = shareResponse.requestUserInfo;
    NSString *statusCode = [NSString stringWithFormat:@"%d", (int)response.statusCode];
    
    [result setValue:userInfo forKey:@"userInfo"];
    [result setValue:errorInfo forKey:@"errorInfo"];
    
    shareCallback(@[result]);
    shareCallback = nil;
  }
}

+ (BOOL)handleOpenURL:(NSURL *)url {
  NSLog(@"URL :%@ ", url);
  
  WeiboModule *weiboModule = [[WeiboModule alloc] init];
  return [WeiboSDK handleOpenURL:url delegate:weiboModule];
}

@end
