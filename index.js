'use strict';

var SocialKit = {
	 get QQ() { return require('./library/QQModule'); },
	 get Weibo() { return require('./library/WeiboModule'); },
	 get Weixin() { return require('./library/WeixinModule'); },
}

module.exports = SocialKit;
