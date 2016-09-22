let resolveAssetSource = require('resolveAssetSource');

let path = require('./../jpg/thumbImage.jpg');
let thumbImage = resolveAssetSource(path).uri;

let webPageUrl = "https://mp.weixin.qq.com/s?__biz=MzI2ODA4ODcwMQ==&mid=500489922&idx=1&sn=6df2308492965731faa1f9e1efd4a409&scene=1&srcid=&key=305bc10ec50ec19b4cb833799b94c8ed06022b016acf704745a9a4549ec7b87a798efa86d710e6b8fcbe67d91be5a830&ascene=0&uin=MjQ3ODc4OTU2MQ%3D%3D&devicetype=iMac+MacBookPro12%2C1+OSX+OSX+10.11.5+build(15F34)&version=11020201&pass_ticket=YuSuaTyth73iIVCyAltJlqggSy0tUK4OaWZcQ%2BazSPMv0acKHj1dPi1%2BBHm2tAFe";

let content = {
  text: {
    text: "享受不再OUT的经期,更IN,更美,更轻松",
  },
  image: {
    title: '使用教程 | 90秒学会用FEMME非秘棉条',
    description: "享受不再OUT的经期,更IN,更美,更轻松",
    image: resolveAssetSource(require('./../jpg/tampon0.jpg')).uri,
    text:'享受不再OUT的经期,更IN,更美,更轻松',
  },

  webPage: {
    title: '使用教程 | 90秒学会用FEMME非秘棉条',
    description: "体验不一样的生理期,还原人生精彩,从学会使用FEMME非秘棉条开始.",
    webpage: webPageUrl,
    thumb: thumbImage,
    text: "体验不一样的生理期,还原人生精彩,从学会使用FEMME非秘棉条开始.",
  },
  music: {
    title: '使用教程 | 90秒学会用FEMME非秘棉条',
    description: "体验不一样的生理期,还原人生精彩,从学会使用FEMME非秘棉条开始.",
    music: "http://y.qq.com/#type=song&id=103347",
    data: "http://stream20.qqmusic.qq.com/32464723.mp3",
    thumb: thumbImage,
    text: "体验不一样的生理期,还原人生精彩,从学会使用FEMME非秘棉条开始.",
  },
  video: {
    text: "体验不一样的生理期,还原人生精彩,从学会使用FEMME非秘棉条开始.",
    title: '使用教程 | 90秒学会用FEMME非秘棉条',
    description: "体验不一样的生理期,还原人生精彩,从学会使用FEMME非秘棉条开始.",
    video: 'http://v.youku.com/v_show/id_XNTUxNDY1NDY4.html',
    thumb: thumbImage,
    data: "http://player.video.qiyi.com/e2d69f7c7fa0103747d01de00ab2285e/0/0/w_19rsq1h5pp.swf-albumId=6172927809-tvId=6172927809-isPurchase=0-cnId=27",

  },
};


module.exports = content;