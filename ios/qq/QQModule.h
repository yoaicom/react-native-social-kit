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
