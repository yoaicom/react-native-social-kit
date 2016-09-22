#import <Foundation/Foundation.h>
#import <RCTBridgeModule.h>
#import "WeiboSDK.h"

@interface WeiboModule : NSObject <RCTBridgeModule, WeiboSDKDelegate>

+(BOOL) handleOpenURL: (NSURL *)url;

@end
