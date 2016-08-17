var SocialKit = {
	 get QQ() { return require('./library/QQModule'); },
	 get Weibo() { return require('./library/WeiboModule'); },
	 get Weixin() { return require('./library/WeixinModule'); },
	 get Ali() { return require('./library/AliModule'); },
}

module.exports = SocialKit;
