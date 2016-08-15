Pod::Spec.new do |s|
  s.name             = "react-native-social-kit"
  s.version          = "0.0.7"
  s.platform     = :ios, '7.0'
  s.requires_arc = true 
  s.authors = "zt"
  s.license = "MIT"
  s.summary      = "social sdk"
	s.homepage = "https://github.com/yoaicom/react-native-social-kit"
  s.source       = { :git => "https://github.com/yoaicom/react-native-social-kit.git"}
  s.subspec 'Weixin' do |ss|
    ss.source_files  ="ios/weixin/*.{h,m}","ios/weixin/WeixinSDK/*.{h,m}"
  	ss.resource     = 'ios/weixin/WeixinSDK/*.bundle'
  	ss.vendored_libraries  = 'ios/weixin/WeixinSDK/*.a'
  	ss.vendored_frameworks = 'ios/weixin/WeixinSDK/*.framework'
  	ss.frameworks = 'SystemConfiguration','CoreTelephony'
  	ss.libraries  = 'z','sqlite3','c++'
  end
  
  s.subspec 'Weibo' do |ss|
    ss.source_files ="ios/weibo/*.{h,m}","ios/weibo/WeiboSDK/*.{h,m}"
  	ss.resource     = 'ios/weibo/WeiboSDk/*.bundle'
  	ss.vendored_libraries  = 'ios/weibo/WeiboSDK/*.a'
  	ss.vendored_frameworks = 'ios/weibo/WeiboSDK/*.framework'
  	ss.frameworks = 'ImageIO','CoreText', 'QuartzCore','UIKit','Foundation','Security','CoreGraphics','SystemConfiguration','CoreTelephony'
  	ss.libraries  = 'z','sqlite3'
  end
  
  s.subspec 'QQ' do |ss|
    ss.source_files  ="ios/qq/*.{h,m}","ios/qq/QQSDK/*.{h,m}"
    ss.resource     = 'ios/qq/QQSDK/*.bundle'
  	ss.vendored_frameworks = 'ios/qq/QQSDK/*.framework'
  	ss.frameworks = 'Security','CoreGraphics','SystemConfiguration','CoreTelephony'
  	ss.libraries  = 'iconv','stdc++','z','sqlite3'
  end 
  
end
