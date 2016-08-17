//
//  AliMudule.m
//  Demo
//
//  Created by 张天 on 16/8/16.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "AliModule.h"

static RCTResponseSenderBlock payCallback;
static RCTResponseSenderBlock payResultCallback;
@implementation AliModule

+ (BOOL)handleUrl:(NSURL *)url {

  if ([url.host isEqualToString:@"safepay"]) {
    // 支付跳转支付宝钱包进行支付，处理支付结果
    [[AlipaySDK defaultService]
        processOrderWithPaymentResult:url
                      standbyCallback:^(NSDictionary *resultDic) {
                        payResultCallback(@[ resultDic ]);
                        NSLog(@"result = %@", resultDic);
                      }];

    // 授权跳转支付宝钱包进行支付，处理支付结果
    [[AlipaySDK defaultService]
        processAuth_V2Result:url
             standbyCallback:^(NSDictionary *resultDic) {
               NSLog(@"result = %@", resultDic);
               // 解析 auth code
               NSString *result = resultDic[@"result"];
               NSString *authCode = nil;
               if (result.length > 0) {
                 NSArray *resultArr = [result componentsSeparatedByString:@"&"];
                 for (NSString *subResult in resultArr) {
                   if (subResult.length > 10 &&
                       [subResult hasPrefix:@"auth_code="]) {
                     authCode = [subResult substringFromIndex:10];
                     break;
                   }
                 }
               }
               NSLog(@"授权结果 authCode = %@", authCode ?: @"");
             }];
  }
  return YES;
}

RCT_EXPORT_MODULE(Ali);

RCT_EXPORT_METHOD(pay
                  : (NSDictionary *)config
                  : (RCTResponseSenderBlock)callback
                  : (RCTResponseSenderBlock)resultCallback) {

  payCallback = callback;
  payResultCallback = resultCallback;

  [[AlipaySDK defaultService] payOrder:[config objectForKey:@"orderString"]
                            fromScheme:[config objectForKey:@"appScheme"]
                              callback:^(NSDictionary *resultDic) {
                                NSLog(@"reslut = %@", resultDic);
                                callback(@[ resultDic ]);
                              }];
}

@end
