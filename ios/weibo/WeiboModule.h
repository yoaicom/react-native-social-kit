//
//  WeiboModule.h
//  ReactAppBase
//
//  Created by LDN on 16/3/7.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <RCTBridgeModule.h>
#import "WeiboSDK.h"

@interface WeiboModule : NSObject <RCTBridgeModule, WeiboSDKDelegate>

+(BOOL) handleOpenURL: (NSURL *)url;

@end
