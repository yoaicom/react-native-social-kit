//
//  AliMudule.h
//  Demo
//
//  Created by 张天 on 16/8/16.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <AlipaySDK/AlipaySDK.h>
#import <Foundation/Foundation.h>
#import <RCTBridge.h>

@interface AliModule : NSObject <RCTBridgeModule>

+ (BOOL)handleUrl:(NSURL *)url;

@end
