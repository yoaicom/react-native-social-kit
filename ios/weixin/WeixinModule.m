#import "WeixinModule.h"
#import "WXApiObject.h"

static RCTResponseSenderBlock authCallback;
static NSString* authState;

@implementation WeixinModule

+ (BOOL)handleOpenURL:(NSURL *)url {
  NSLog(@"URL :%@ ",url);
  
  WeixinModule *module = [[WeixinModule alloc]init];
  return [WXApi handleOpenURL:url delegate:module];
}

RCT_EXPORT_MODULE(Weixin);

RCT_EXPORT_METHOD(authorize:(NSDictionary *)config : (RCTResponseSenderBlock)callback) {
  NSString *appId = [config objectForKey:@"appId"];
  [WXApi registerApp:appId];
  
  authCallback = callback;
  authState = [self randomString];
  
  SendAuthReq* req =[[SendAuthReq alloc] init];
  req.scope = @"snsapi_userinfo" ;
  req.state = authState;
  
  //第三方向微信终端发送一个SendAuthReq消息结构
  [WXApi sendReq:req];
  
}

-(void) onReq:(BaseReq*)req {
  if ([req isKindOfClass:[SendAuthReq class]]) {

  }
}

-(void) onResp:(BaseResp*)resp {
  if ([resp isKindOfClass:[SendAuthResp class]]) {
    SendAuthResp *authResp = (SendAuthResp *)resp;
    
    NSMutableDictionary *results = [[NSMutableDictionary alloc]initWithCapacity:4];
    
    if(authResp.errCode == WXSuccess) {
      NSString *code = authResp.code;
      NSString *country = authResp.country;
      NSString *lang = authResp.lang;
      NSString *state = authResp.state;
      
      if(![authState isEqualToString:state]) {
        [results setObject:@"state not match" forKey:@"error"];
      } else {
        if (code) {
          [results setObject:code forKey:@"code"];
        }
        if (country) {
          [results setObject:country forKey:@"country"];
        }
        if (lang) {
          [results setObject:lang forKey:@"lang"];
        }
      }
    } else if(authResp.errCode == WXErrCodeUserCancel || authResp.errCode == WXErrCodeAuthDeny) {
      [results setObject: [NSNumber numberWithBool:YES] forKey:@"cancel"];
    } else {
      NSString *errMsg = [NSString stringWithFormat:@"errCode=%d", authResp.errCode];
      [results setObject: errMsg forKey:@"error"];
    }
    
    authCallback(@[results]);
    authCallback = nil;
  }
}

- (NSString *) randomString {
  NSString *alphabet  = @"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXZY0123456789";
  NSMutableString *s = [NSMutableString stringWithCapacity:20];
  for (NSUInteger i = 0U; i < 20; i++) {
    u_int32_t r = arc4random() % [alphabet length];
    unichar c = [alphabet characterAtIndex:r];
    [s appendFormat:@"%C", c];
  }
  return alphabet;
}

@end