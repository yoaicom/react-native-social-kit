#define BUFFER_SIZE 1024 * 100

#import "RCTImageLoader.h"
#import "WeixinModule.h"

static RCTResponseSenderBlock authCallback;
static RCTResponseSenderBlock shareCallback;
static RCTResponseSenderBlock payCallback;

static NSString *authStateString;

@implementation WeixinModule

@synthesize bridge = _bridge;

+ (BOOL)handleOpenURL:(NSURL *)url {
  WeixinModule *module = [[WeixinModule alloc] init];
  return [WXApi handleOpenURL:url delegate:module];
}

RCT_EXPORT_MODULE(Weixin);

#pragma mark - 注册App

RCT_EXPORT_METHOD(registerApp
                  : (NSString *)appId
                  : (RCTResponseSenderBlock)callback) {
  BOOL appRegistered = NO;
  NSMutableDictionary *result = [NSMutableDictionary dictionaryWithCapacity:3];
  if (appId != nil && appId.length >= 0) {
    appRegistered = [WXApi registerApp:appId];
    [result setObject:[NSNumber numberWithBool:appRegistered]
               forKey:@"appRegistered"];
    [result setObject:[NSNumber numberWithBool:[WXApi isWXAppInstalled]]
               forKey:@"weixinAppInstalled"];
    [result setObject:[NSNumber numberWithBool:[WXApi isWXAppSupportApi]]
               forKey:@"apiSupported"];
    callback(@[ result ]);
  }
}

#pragma mark - 打开微信

RCT_EXPORT_METHOD(openWeixinApp : (RCTResponseSenderBlock)callback) {
  
  NSDictionary *result = [NSDictionary
                          dictionaryWithObject:[NSNumber numberWithBool:[WXApi openWXApp]]
                          forKey:@"appOpened"];
  callback(@[ result ]);
}
#pragma mark - 分享

RCT_EXPORT_METHOD(share
                  : (NSDictionary *)config
                  : (RCTResponseSenderBlock)callback) {
  if (config != nil) {
    shareCallback = callback;
    
    int scene = [self judgeSceneTypeWithConfig:config];
    
    SendMessageToWXReq *req = [[SendMessageToWXReq alloc] init];
    req.bText = NO;
    req.scene = scene;
    
    if ([config objectForKey:@"text"]) {
      req.text = [config objectForKey:@"text"];
      req.bText = YES;
      [WXApi sendReq:req];
      
    } else {
      WXMediaMessage *message = [self getMessageWithConfig:config];
      req.bText = NO;
      NSString *thumbImage = [config objectForKey:@"thumb"];
      
      if ([config objectForKey:@"image"]) {
        WXImageObject *imageObject = [WXImageObject object];
        thumbImage = [config objectForKey:@"image"];
        if ([[thumbImage substringToIndex:1] isEqualToString:@"/"]) {
          imageObject.imageData = [NSData dataWithContentsOfFile:thumbImage];
          thumbImage = [NSString stringWithFormat:@"file://%@",thumbImage];
        } else {
          NSLog(@"thumbImage = %@",thumbImage);
          imageObject.imageData = [NSData dataWithContentsOfURL:[NSURL URLWithString:thumbImage]];
        }
        message.mediaObject = imageObject;
      } else if ([config objectForKey:@"music"]) {
        
        WXMusicObject *musicObject = [WXMusicObject object];
        musicObject.musicUrl = [config objectForKey:@"music"];
        musicObject.musicDataUrl = [config objectForKey:@"data"];
        message.mediaObject = musicObject;
        
      } else if ([config objectForKey:@"video"]) {
        
        WXVideoObject *videoObject = [WXVideoObject object];
        videoObject.videoUrl = [config objectForKey:@"video"];
        message.mediaObject = videoObject;
        
      } else if ([config objectForKey:@"webpage"]) {
        
        WXWebpageObject *webpageObject = [WXWebpageObject object];
        webpageObject.webpageUrl = [config objectForKey:@"webpage"];
        message.mediaObject = webpageObject;
      }
      if (thumbImage && thumbImage.length > 0) {
        NSLog(@"设置缩略图");
        
        [self getImgaeWithUrl:thumbImage andCompletionBlock:^(NSError *error, UIImage *image) {
          NSData *imageData = UIImageJPEGRepresentation(image, 1.0);
          UIImage *resultImage = [UIImage imageWithData:imageData];
          
          while (imageData.length > 32000) {
            NSLog(@"图片大小为%f", imageData.length);
            imageData = UIImageJPEGRepresentation(resultImage, 0.9);
            resultImage = [UIImage imageWithData:imageData];
          }
          dispatch_async(dispatch_get_main_queue(), ^{
            [message setThumbImage:resultImage];
            req.message = message;
            [WXApi sendReq:req];
          });
        }];
      } else {
        [message setThumbImage:nil];
        req.message = message;
        [WXApi sendReq:req];
      }
      
    }
  }
}

#pragma mark - 支付

RCT_EXPORT_METHOD(pay
                  : (NSDictionary *)config
                  : (RCTResponseSenderBlock)callback) {
  
  payCallback = callback;
  
  if (config != nil) {
      //调起微信支付
      PayReq *req = [[PayReq alloc] init];
      req.partnerId = [config objectForKey:@"partnerid"];
      req.prepayId = [config objectForKey:@"prepayid"];
      req.nonceStr = [config objectForKey:@"noncestr"];
      req.timeStamp = [config objectForKey:@"timestamp"];
      req.package = [config objectForKey:@"package"];
      req.sign = [config objectForKey:@"sign"];
      [WXApi sendReq:req];
    }
}

#pragma mark - 授权登陆

RCT_EXPORT_METHOD(authorize
                  : (NSDictionary *)config
                  : (RCTResponseSenderBlock)callback) {
  
  authCallback = callback;
  
  authStateString = [[NSUUID UUID] UUIDString];
  
  SendAuthReq *req = [[SendAuthReq alloc] init];
  req.scope = @"snsapi_userinfo";
  req.state = authStateString;
  [WXApi sendReq:req];
}

- (WXMediaMessage *)getMessageWithConfig:(NSDictionary *)config {
  WXMediaMessage *message = [WXMediaMessage message];
  message.title = [config objectForKey:@"title"];
  message.description = [config objectForKey:@"description"];
  return message;
}

#pragma mark - 私有

typedef void (^completionBlock)(NSError *error, UIImage *image);

- (void)getImgaeWithUrl:(NSString *)url
     andCompletionBlock:(completionBlock)completionBlock {
  if (url.length && _bridge.imageLoader) {
    NSURLRequest *request =
    [NSURLRequest requestWithURL:[NSURL URLWithString:url]];
    [_bridge.imageLoader
     loadImageWithURLRequest:request
     size:CGSizeMake(100, 100)
     scale:1.0
     clipped:NO
     resizeMode:RCTResizeModeStretch
     progressBlock:nil
     completionBlock:^(NSError *error, UIImage *image) {
       completionBlock(error, image);
     }];
  }
}

- (int)judgeSceneTypeWithConfig:(NSDictionary *)config {
  
  NSString *sceneName = [config objectForKey:@"scene"];
  
  if ([sceneName isEqualToString:@"timeline"]) {
    return 1;
  } else if ([sceneName isEqualToString:@"favorite"]) {
    return 2;
  } else
    return 0;
}

-(NSString *)getErrorInfoMessageWithErrcode: (int)errCode {
  NSString *errorInfo;
  if( errCode == WXSuccess) {
    errorInfo = @"WXSuccess";
  } else if (errCode == WXErrCodeCommon) {
    errorInfo = @"WXErrCodeCommon";
  } else if (errCode == WXErrCodeUserCancel) {
    errorInfo = @"user cancel";
  } else if (errCode == WXErrCodeSentFail) {
    errorInfo = @"send Fail";
  } else if (errCode == WXErrCodeAuthDeny) {
    errorInfo = @"auth deny";
  } else if (errCode == WXErrCodeUnsupport) {
    errorInfo = @"wx unsupport";
  }
  return errorInfo;
}

#pragma mark - delegate

- (void)onReq:(BaseReq *)req {
  NSLog(@"收到req");
}

- (void)onResp:(BaseResp *)resp {
  
  NSLog(@"onResp...cls= %@", [resp class]);
  
  NSMutableDictionary *result =
  [[NSMutableDictionary alloc] initWithCapacity:10];
  
  int errCode = resp.errCode;
  NSString *errorInfo;
  [result setValue:resp.errStr forKey:@"errStr"];
  [result setValue:[NSString stringWithFormat:@"%d", resp.type] forKey:@"type"];
  errorInfo = [self getErrorInfoMessageWithErrcode:errCode];
  if ([resp isKindOfClass:[SendAuthResp class]]) {
    SendAuthResp *authResp = (SendAuthResp *)resp;
    NSString *code = authResp.code;
    NSString *country = authResp.country;
    NSString *lang = authResp.lang;
    NSString *state = authResp.state;
    if (authStateString != nil && [authStateString isEqualToString:state]) {
      [result setValue:code forKey:@"code"];
      [result setValue:country forKey:@"country"];
      [result setValue:lang forKey:@"lang"];
    } else {
      errorInfo = @"state doesn't match";
    }
    [result setValue:errorInfo forKey:@"error"];
    authCallback(@[ result ]);
    authCallback = nil;
    authStateString = nil;
  } else if ([resp isKindOfClass:[SendMessageToWXResp class]]) {
    SendMessageToWXResp *messageResp = (SendMessageToWXResp *)resp;
    NSString *lang = messageResp.lang;
    NSString *country = messageResp.country;
    [result setValue:lang forKey:@"lang"];
    [result setValue:country forKey:@"country"];
    [result setValue:errorInfo forKey:@"error"];
    shareCallback(@[ result ]);
    shareCallback = nil;
  } else if ([resp isKindOfClass:[PayResp class]]) {
    PayResp *payResp = (PayResp *)resp;
    NSString *returnKey = payResp.returnKey;
    [result setValue:returnKey forKey:@"returnKey"];
    [result setValue:errorInfo forKey:@"error"];
    
    payCallback(@[ result ]);
    payCallback = nil;
  }
  
}

- (void)dealloc {
  NSLog(@"%@结束了", self.class);
}

@end
