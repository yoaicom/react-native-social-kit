#import "QQModule.h"

static RCTResponseSenderBlock authCallback;
static RCTResponseSenderBlock shareCallback;

@implementation QQModule

+ (BOOL)handleOpenURL:(NSURL *)url {
  NSLog(@"%@", @"qq handle");
  QQModule *module = [[QQModule alloc]init];
  return [TencentOAuth HandleOpenURL:url] || [QQApiInterface handleOpenURL:url delegate:module];
  
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

RCT_EXPORT_METHOD(share : (NSDictionary *)config : (RCTResponseSenderBlock)callback ) {
  QQApiObject *object;
  
  shareCallback = callback;
  
  NSString *title = [config objectForKey:@"title"];
  NSString *description = [config objectForKey:@"description"];
  NSString *thumb = [config objectForKey:@"thumb"];
  if ([[thumb substringToIndex:1 ] isEqualToString:@"/"]) {
    thumb = [NSString stringWithFormat:@"file://%@",thumb];
  }
  NSURL *previewImageURL = [NSURL URLWithString:thumb];

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
  
  QQApiSendResultCode errorInfo;
  
  SendMessageToQQReq *req = [SendMessageToQQReq reqWithContent:object];
  
  if ([scene isEqualToString:@"qzone"]) {
    [QQApiInterface SendReqToQZone:req];
  }  else {
    [QQApiInterface sendReq:req];
  }
  
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
  
  NSLog(@"kOPEN_PERMISSION_GET_USER_INFO = %@",kOPEN_PERMISSION_GET_USER_INFO);
  
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

- (void)onReq:(QQBaseReq *)req{
  NSLog(@"%s",__FUNCTION__);
  NSLog(@"%@",@"接受req");
}

- (void)onResp:(QQBaseResp *)resp{
  NSLog(@"%s",__FUNCTION__);
  NSLog(@"%@",@"接收resp");

  NSMutableDictionary *result = [NSMutableDictionary dictionaryWithCapacity:4];
  
  NSString *resultString = resp.result;
  if ([resultString isEqualToString:@"0"]) {
    [result setValue:[NSNumber numberWithBool:YES] forKey:@"success"];
  } else if ([resultString isEqualToString:@"-4"]) {
    [result setValue:[NSNumber numberWithBool:YES] forKey:@"cancel"];
  } else {
    [result setValue:resultString forKey:@"error"];
  }
  
  shareCallback(@[result]);
}

- (void)dealloc {
  NSLog(@"%@结束了", self.class);
}

@end
