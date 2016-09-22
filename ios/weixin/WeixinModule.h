#import <Foundation/Foundation.h>

#import "WXApi.h"
#import <RCTBridge.h>

@interface WeixinModule : NSObject <RCTBridgeModule, WXApiDelegate>

+ (BOOL)handleOpenURL:(NSURL *)url;

@end
