#import <Foundation/Foundation.h>

#import <RCTBridge.h>
#import "WXApi.h"

@interface WeixinModule : NSObject<RCTBridgeModule,WXApiDelegate>

+ (BOOL)handleOpenURL: (NSURL *)url;

@end