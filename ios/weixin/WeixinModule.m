//
//  WeixinModule.m
//  ReactAppBase
//
//  Created by 张天 on 16/3/7.
//  Copyright © 2016年 YOAI. All rights reserved.
//

#import "WeixinModule.h"

static RCTResponseSenderBlock authCallback;

@implementation WeixinModule

+ (BOOL)handleOpenURL:(NSURL *)url {
  WeixinModule *module = [[WeixinModule alloc]init];
  NSLog(@"URL :%@ ",url);
  return [WXApi handleOpenURL:url delegate:module];
}

RCT_EXPORT_MODULE(Weixin);

RCT_EXPORT_METHOD(authorize:(NSDictionary *)config : (RCTResponseSenderBlock)callback) {
  NSLog(@"发送授权请求");
  
  NSString *appId = [config objectForKey:@"appId"];
  [WXApi registerApp:appId];
  
  authCallback = callback;
  
  SendAuthReq* req =[[SendAuthReq alloc] init];
  req.scope = @"snsapi_userinfo" ;
  req.state = [config objectForKey:@"state"];
  //第三方向微信终端发送一个SendAuthReq消息结构
  [WXApi sendReq:req];
  
}

-(void) onReq:(BaseReq*)req {
  if ([req isKindOfClass:[SendAuthReq class]]) {
    NSLog(@"收到req");
  }
}

-(void) onResp:(BaseResp*)resp {
  NSLog(@"收到resp授权请求");
  if ([resp isKindOfClass:[SendAuthResp class]]) {
    SendAuthResp *authResp = (SendAuthResp *)resp;
    NSString *code = authResp.code;
    NSString *country = authResp.country;
    NSString *lang = authResp.lang;
    NSString *state = authResp.state;
    
    NSMutableDictionary *results = [[NSMutableDictionary alloc]initWithCapacity:4];
    if (code) {
      [results setObject:code forKey:@"code"];
    }
    if (country) {
      [results setObject:country forKey:@"country"];
    }
    if (lang) {
      [results setObject:lang forKey:@"lang"];
    }
    if (state) {
      [results setObject:state forKey:@"state"];
    }
    
    authCallback(@[results]);
    authCallback = nil;
  }
}

- (void)dealloc {
  NSLog(@"%@结束了",self.class);
}

@end