let resolveAssetSource = require('resolveAssetSource');

let path = require('./jpg/thumbImage.jpg');
let thumbImage = "file://" + resolveAssetSource(path).uri;

let path1 = require('./jpg/res2.jpg');
let thumbnail = resolveAssetSource(path).uri;

let imageUrl = resolveAssetSource(require('./jpg/tampon0.jpg')).uri;
let imageUrl1 = resolveAssetSource(require('./jpg/tampon1.jpg')).uri;
let imageUrl2 = resolveAssetSource(require('./jpg/tampon2.jpg')).uri;
let imageUrl3 = resolveAssetSource(require('./jpg/tampon3.jpg')).uri;
let imageUrl4 = resolveAssetSource(require('./jpg/tampon3.jpg')).uri;

let webPageUrl = "https://mp.weixin.qq.com/s?__biz=MzI2ODA4ODcwMQ==&mid=500489922&idx=1&sn=6df2308492965731faa1f9e1efd4a409&scene=1&srcid=&key=305bc10ec50ec19b4cb833799b94c8ed06022b016acf704745a9a4549ec7b87a798efa86d710e6b8fcbe67d91be5a830&ascene=0&uin=MjQ3ODc4OTU2MQ%3D%3D&devicetype=iMac+MacBookPro12%2C1+OSX+OSX+10.11.5+build(15F34)&version=11020201&pass_ticket=YuSuaTyth73iIVCyAltJlqggSy0tUK4OaWZcQ%2BazSPMv0acKHj1dPi1%2BBHm2tAFe";
let weiboWebUrl = "http://www.yoai.com/";

let redirectURI = "https://api.weibo.com/oauth2/default.html";
let scope = "all";

let content = {
  text: {
    text: "享受不再OUT的经期,更IN,更美,更轻松",
    redirectURI: redirectURI,
    scope: scope,
  },
  image: {
    title: '使用教程 | 90秒学会用FEMME非秘棉条',
    description: "享受不再OUT的经期,更IN,更美,更轻松",
    imagePath: resolveAssetSource(require('./jpg/tampon0.jpg')).uri,
    thumbImage: thumbImage,
    thumbnail: thumbnail,
    redirectURI: redirectURI,
    scope: scope,
    text:'享受不再OUT的经期,更IN,更美,更轻松',
  },
  imageArray: {
    title: '使用教程 | 90秒学会用FEMME非秘棉条',
    description: "享受不再OUT的经期,更IN,更美,更轻松",
    thumbnail: thumbnail,
    imageArray: [imageUrl, imageUrl1, imageUrl2, imageUrl3, imageUrl4],
  },

  webPage: {
    title: '使用教程 | 90秒学会用FEMME非秘棉条',
    description: "体验不一样的生理期,还原人生精彩,从学会使用FEMME非秘棉条开始.",
    webpageUrl: webPageUrl,
    weiboWebUrl: weiboWebUrl,
    thumbImage: thumbImage,
    redirectURI: redirectURI,
    scope: scope,
    text: "体验不一样的生理期,还原人生精彩,从学会使用FEMME非秘棉条开始.",
    objectID: "identifier1",
    thumbnail: thumbnail,
  },
  music: {
    title: '使用教程 | 90秒学会用FEMME非秘棉条',
    description: "体验不一样的生理期,还原人生精彩,从学会使用FEMME非秘棉条开始.",
    musicUrl: "http://y.qq.com/#type=song&id=103347",
    musicDataUrl: "http://stream20.qqmusic.qq.com/32464723.mp3",
    musicLowBandUrl: "http://stream20.qqmusic.qq.com/32464723.mp3",
    thumbImage: thumbImage,
    redirectURI: redirectURI,
    text: "体验不一样的生理期,还原人生精彩,从学会使用FEMME非秘棉条开始.",
    scope: scope,
    objectID: "identifier1",
    thumbnail: thumbnail,
  },
  video: {
    text: "体验不一样的生理期,还原人生精彩,从学会使用FEMME非秘棉条开始.",
    title: '使用教程 | 90秒学会用FEMME非秘棉条',
    description: "体验不一样的生理期,还原人生精彩,从学会使用FEMME非秘棉条开始.",
    videoUrl: "http://static.video.qq.com/TPout.swf?vid=i0307j06iup&auto=0",
    weiboVideoUri: 'http://v.youku.com/v_show/id_XNTUxNDY1NDY4.html',
    thumbnail: thumbnail,
    thumbImage: thumbImage,
    redirectURI: redirectURI,
    objectID: "identifier1",
    scope: scope,
    flashURL: "http://player.video.qiyi.com/e2d69f7c7fa0103747d01de00ab2285e/0/0/w_19rsq1h5pp.swf-albumId=6172927809-tvId=6172927809-isPurchase=0-cnId=27",

  },
  app: {
    title: "Yoai社交分享App",
    description: "支持微信,微博,QQ,支付宝登陆分享支付等功能,欢迎使用",
    extInfo: "<xml>extend info</xml>",
    url: "http://www.yoai.com/",
    thumbImage: thumbImage
  },
  nonGif: {
    title: "图片表情分享",
    description: "这是一个图片表情分享",
    thumbImage: thumbImage,
    nonGifPath: resolveAssetSource(require('./jpg/tampon1.jpg')).uri
  },
  gif: {
    title: "gif表情分享",
    description: "这是一个gif表情分享",
    thumbImage: thumbImage,
    gifPath: resolveAssetSource(require('./jpg/res6.gif')).uri,
  },
  file: {
    title: "文件分享",
    description: "这是一个文件分享",
    thumbImage: thumbImage,
    filePath: resolveAssetSource(require('./jpg/ML.pdf')).uri,
  }

};


module.exports = content;