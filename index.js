'use strict';

var SocialSDK = {
	 get QQ() { return require('./library/QQModule'); },
	 get Weibo() { return require('./library/WeiboModule'); },
	 get Weixin() { return require('./library/WeixinModule'); },
}

export default SocialSDK;
