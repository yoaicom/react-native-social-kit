#import <AlipaySDK/AlipaySDK.h>
#import <Foundation/Foundation.h>
#import <RCTBridge.h>

@interface AliModule : NSObject <RCTBridgeModule>

+ (BOOL)handleUrl:(NSURL *)url;

@end
