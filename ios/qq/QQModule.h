//
//  QQModule.h
//  ReactAppBase
//
//  Created by 张天 on 16/3/8.
//  Copyright © 2016年 YOAI. All rights reserved.
//

#import <Foundation/Foundation.h>

#import <RCTBridgeModule.h>
#import <TencentOpenAPI/TencentApiInterface.h>
#import <TencentOpenAPI/TencentOAuth.h>
#import "TencentOpenAPI/QQApiInterface.h"

@interface QQModule : NSObject<RCTBridgeModule,TencentApiInterfaceDelegate,TencentSessionDelegate>

@property (nonatomic, strong) TencentOAuth *tencentOAuth;

- (void)authorize:(NSDictionary *)config : (RCTResponseSenderBlock)callback;

+ (BOOL) handleOpenURL: (NSURL *)url;
@end
