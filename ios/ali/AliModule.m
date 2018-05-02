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
    return YES;
  }
  return NO;
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
                                callback(@[ resultDic ]);
                              }];
}

@end
