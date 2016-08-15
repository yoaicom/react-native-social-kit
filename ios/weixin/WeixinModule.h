//
//  WeixinModule.h
//  Demo
//
//  Created by 张天 on 16/8/1.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "WXApi.h"
#import <RCTBridge.h>

@interface WeixinModule : NSObject <RCTBridgeModule, WXApiDelegate>

+ (BOOL)handleOpenURL:(NSURL *)url;

@end