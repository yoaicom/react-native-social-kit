//
//  WeixinModule.h
//  ReactAppBase
//
//  Created by 张天 on 16/3/7.
//  Copyright © 2016年 YOAI. All rights reserved.
//

#import <Foundation/Foundation.h>

#import <RCTBridge.h>
#import "WXApi.h"

@interface WeixinModule : NSObject<RCTBridgeModule,WXApiDelegate>

+ (BOOL)handleOpenURL: (NSURL *)url;

@end