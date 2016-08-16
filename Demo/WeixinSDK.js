import React, {Component} from 'react';
import {View, ListView, Text, StyleSheet, TouchableHighlight, TouchableOpacity, ScrollView} from 'react-native';

import sdk from 'react-native-social-kit';

let resolveAssetSource = require('resolveAssetSource');
let Weixin = sdk.Weixin;

let path = require('./jpg/res2.jpg');
let thumbImage = "file://" + resolveAssetSource(path).uri;

let DataArr = {
  '分享方式': {
    title: '分享方式',
    rowData: [
      {
        type1: {
          title: '好友',
          scene: 'WXSceneSession'
        },
        type2: {
          title: '朋友圈',
          scene: 'WXSceneTimeline'
        },
        type3: {
          title: '收藏',
          scene: 'WXSceneFavorite'
        },
      }
    ]
  },
  '分享内容': {
    title: '分享内容',
    rowData: [
      {
        type1: {
          title: '文本',
          messageType: 'text'
        },
        type2: {
          title: '图片',
          messageType: 'image'
        },
        type3: {
          title: '链接',
          messageType: 'webLink'
        },
        type4: {
          title: '音乐',
          messageType: 'music'
        },
        type5: {
          title: '视频',
          messageType: 'video'
        },
        type6: {
          title: 'App',
          messageType: 'app'
        },
        type7: {
          title: '图片表情',
          messageType: 'nonGif'
        },
        type8: {
          title: 'Gif表情',
          messageType: 'gif'
        },
        type9: {
          title: '文件',
          messageType: 'file'
        },
      }
    ]
  },
  '分享': {
    title: '分享',
    rowData: [
      {
        type1: {
          title: '分享',
          func: 'share'
        }
      }
    ]
  },
  '其他Api': {
    title: '其他Api',
    rowData: [
      {
        type1: {
          title: '是否安装微信?',
          api: 'isWXAppInstalled'
        },
        type2: {
          title: '是否支持Api?',
          api: 'isWXAppSupportApi'
        },
        type3: {
          title: 'ITunes地址',
          api: 'getWXAppInstallUrl'
        },
        type4: {
          title: 'Api版本',
          api: 'getApiVersion'
        },
        type5: {
          title: '打开微信',
          api: 'openWXApp'
        },
        type6: {
          title: '授权登陆',
          api: 'authorize'
        },
      }
    ]
  },


};

export default class WeixinSDK extends Component {

  constructor(props) {
    super(props);
    this.state = {
      scene: 'WXSceneSession',
      messageType: 'text',
      api: 'isWXAppInstalled',
      shareResult: '--------',
      apiResult: '---------' || {}
    }
  }


  componentWillMount() {
    // 注册App
    Weixin.registerApp({
      appId: "wx1dd0b08688eecaef"
    }, (data) => {
    });
  }

  render() {

    let dataSource = new ListView.DataSource({
      getRowData: (dataBlob, sectionID, rowID, rowIndex) => {
        return dataBlob[sectionID].rowData[rowID];
      },
      getSectionHeaderData: (dataBlob, sectionID) => {
        return dataBlob[sectionID];
      },
      rowHasChanged: (r1, r2) => {
        r1 !== r2;
      },
      sectionHeaderHasChanged: (s1, s2) => {
        s1 !== s2;
      }
    });
    let sectionIDs = Object.keys(DataArr);
    let rowIDs = sectionIDs.map(sectionID => {
      let count = DataArr[sectionID].rowData.length;
      let thisRow = [];
      for (let i = 0; i < count; i++) {
        thisRow.push(i);
      }
      return thisRow;
    });

    return (
      <ListView
        style={{marginTop:20}}
        dataSource={dataSource.cloneWithRowsAndSections(DataArr,sectionIDs,rowIDs)}
        renderRow={this.renderRow.bind(this)}
        renderSectionHeader={this.renderSectionHeader.bind(this)}
      />
    )
  }

  _onPressHandle(rowData) {
    console.log(rowData);
    if (rowData.scene && rowData.scene.length > 0) {
      this.setState({scene: rowData.scene})
    } else if (rowData.messageType && rowData.messageType.length > 0) {
      console.log("rowData.messageType" + rowData.messageType);
      this.setState({messageType: rowData.messageType})
    } else if (rowData.api && rowData.api.length > 0) {
      console.log("rowData.api" + rowData.api);
      this.setState({api: rowData.api})
      this.apiHandler(rowData.api);
    } else {
      this.shareMessage();
    }
  }

  // 渲染cell
  renderRow(rowData, sectionID:number, rowID:number) {
    let rowdataIDs = Object.keys(rowData);
    // let borderColor = 'red';
    let content = rowdataIDs.map((id) => {
      let selectedStyle = this.getSelectedStyle(rowData[id]);
      return (
        <TouchableOpacity
          key={id}
          style={{width:105,height:60,justifyContent:'center',alignItems:'center'}}
          onPress={() => {this._onPressHandle(rowData[id])}}
        >
          <View style={[styles.row,selectedStyle]}>
            <Text style={styles.text}>
              {rowData[id].title}
            </Text>
          </View>
        </TouchableOpacity>
      )
    });
    console.log('sectionID = ' + sectionID);
    let resultComponent = this.getResultComponent(rowData, sectionID);
    return (
      <View
        style={styles.rowContent}
      >
        {content}
        {resultComponent}
      </View>
    );
  }

  renderSectionHeader(data, sectionID, rowID) {
    return (
      <View style={styles.sectionHeader}>
        <Text
          style={styles.sectionHeaderFont}
        >{data.title}</Text>
      </View>
    )
  }

  //Private
  getSelectedStyle(rowData) {
    if ((rowData.scene && rowData.scene == this.state.scene) || (rowData.messageType && rowData.messageType == this.state.messageType)) {
      return {borderColor: 'green', backgroundColor: 'green'};
    } else if (rowData.api && rowData.api == this.state.api) {
      return {borderColor: 'green', backgroundColor: 'green',};
    } else if (!rowData.scene && !rowData.messageType && !rowData.api) {
      return {width: 310}
    }
  }

  getResultComponent(rowData, sectionID) {

    if (sectionID == '其他Api') {
      return (
        <View style={styles.resultRow}>
          <Text style={styles.text}>Api返回结果</Text>
          <Text style={styles.text}>{JSON.stringify(this.state.apiResult)}</Text>
        </View>
      )
    } else if (sectionID == '分享') {
      return (
          <View style={styles.resultRow}>
            <Text style={styles.text}>分享返回结果</Text>
            <Text style={styles.text}>{this.state.shareResult}</Text>
          </View>

      )
    } else {
      return <View/>
    }
  }


  //分享方法

  shareMessage() {
    if (this.state.messageType == 'text') {
      this.shareTextToWXReq(this.state.scene);
    } else if (this.state.messageType == 'image') {
      this.shareImageToWXReq(this.state.scene);
    } else if (this.state.messageType == 'webLink') {
      this.shareWebToWXReq(this.state.scene);
    } else if (this.state.messageType == 'music') {
      this.shareMusicToWXReq(this.state.scene);
    } else if (this.state.messageType == 'video') {
      this.shareVideoToWXReq(this.state.scene);
    } else if (this.state.messageType == 'app') {
      this.shareAppToWXReq(this.state.scene);
    } else if (this.state.messageType == 'nonGif') {
      this.shareNonGifToWXReq(this.state.scene);
    } else if (this.state.messageType == 'gif') {
      this.shareGifToWXReq(this.state.scene);
    } else if (this.state.messageType == 'file') {
      this.shareFileToWXReq(this.state.scene);
    }
  }

  shareTextToWXReq(scene) {
    Weixin.shareText({
      text: "你好这里是有爱官网",
      scene: scene,
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }

  shareImageToWXReq(scene) {
    Weixin.shareImage({
      text: "你好这里是有爱官网",
      scene: scene,
      imagePath: resolveAssetSource(require('./jpg/tampon0.jpg')).uri,
      thumbImage: thumbImage
    }, (data) => {
      this.setState({shareResult: JSON.stringify(shareResult)})
    });
  }

  shareWebToWXReq(scene) {
    Weixin.shareWeb({
      title: "网页分享",
      description: "这是一个网页分享",
      scene: scene,
      webpageUrl: "http://www.yoai.com/",
      thumbImage: thumbImage
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }

  shareMusicToWXReq(scene) {
    Weixin.shareMusic({
      title: "音乐分享",
      description: "这是一个音乐分享",
      musicUrl: "http://y.qq.com/#type=song&id=103347",
      musicDataUrl: "http://stream20.qqmusic.qq.com/32464723.mp3",
      scene: scene,
      thumbImage: thumbImage
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }

  shareVideoToWXReq(scene) {

    Weixin.shareVideo({
      title: "视频分享",
      description: "这是一个视频分享",
      videoUrl: "http://v.youku.com/v_show/id_XNTUxNDY1NDY4.html",
      scene: scene,
      thumbImage: thumbImage
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }

  shareAppToWXReq(scene) {

    Weixin.shareApp({
      title: "App分享",
      description: "这是一个App分享",
      extInfo: "<xml>extend info</xml>",
      url: "http://weixin.qq.com",
      scene: scene,
      thumbImage: thumbImage
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }

  shareNonGifToWXReq(scene) {

    Weixin.shareNonGif({
      title: "图片表情分享",
      description: "这是一个图片表情分享",
      scene: scene,
      thumbImage: thumbImage,
      nonGifPath: resolveAssetSource(require('./jpg/res7.jpg')).uri
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }

  shareGifToWXReq(scene) {

    Weixin.shareGif({
      title: "gif表情分享",
      description: "这是一个gif表情分享",
      scene: scene,
      thumbImage: thumbImage,
      gifPath: resolveAssetSource(require('./jpg/res6.gif')).uri,
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }

  shareFileToWXReq(scene) {

    Weixin.shareFile({
      title: "文件分享",
      description: "这是一个文件分享",
      scene: scene,
      thumbImage: thumbImage,
      filePath: resolveAssetSource(require('./jpg/ML.pdf')).uri,
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }

  //Api方法
  apiHandler(apiName) {
    if (apiName === "isWXAppInstalled") {
      this.isWXAppInstalled();
    } else if (apiName === "isWXAppSupportApi") {
      this.isWXAppSupportApi();
    } else if (apiName === "getWXAppInstallUrl") {
      this.getWXAppInstallUrl();
    } else if (apiName === "getApiVersion") {
      this.getApiVersion();
    } else if (apiName === "openWXApp") {
      this.openWXApp();
    } else if (apiName === "authorize") {
      this.auth();
    }
  }

  isWXAppInstalled() {
    Weixin.isWXAppInstalled((data) => {
      console.log("Api返回结果 : " + data);
      this.setState({
        apiResult: data
      })
    });
  }

  isWXAppSupportApi() {
    Weixin.isWXAppSupportApi((data) => {
      console.log("Api返回结果 : " + data);
      this.setState({
        apiResult: data
      })
    });
  }

  getWXAppInstallUrl() {
    Weixin.getWXAppInstallUrl((data) => {
      console.log("Api返回结果 : " + data);
      this.setState({
        apiResult: data
      })
    });
  }

  getApiVersion() {
    Weixin.getApiVersion((data) => {
      console.log("Api返回结果 : " + data);
      this.setState({
        apiResult: data
      })
    });
  }

  openWXApp() {
    Weixin.openWXApp((data) => {
      console.log("Api返回结果 : " + data);
      this.setState({
        apiResult: data
      })
    });
  }

  auth() {
    Weixin.authorize(
      {scope: "snsapi_userinfo", state: "123"},
      (data) => {
        console.log("Api返回结果 : " + data);
        this.setState({
          apiResult: data
        })
      });
  }

}

var styles = StyleSheet.create({
  rowContent: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  row: {
    justifyContent: 'center',
    padding: 5,
    margin: 3,
    width: 100,
    height: 55,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    borderWidth: 1,
    // borderRadius: 5,
  },
  resultRow:{
    justifyContent: 'center',
    padding: 5,
    margin: 3,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    borderWidth: 1,
    width:310,
    height:150,
  },
  sectionHeaderFont: {
    fontSize: 20,
    textAlign: 'center'
  },
  sectionHeader: {
    height: 30,
    justifyContent: 'center',
    backgroundColor: 'green'
  },
  thumb: {
    width: 64,
    height: 64
  },
  text: {
    fontSize: 20,
    alignSelf: 'center',
    marginTop: 5,
    fontWeight: 'bold'
  },
  resultText: {
    fontSize: 20,
    alignSelf: 'center',
    marginTop: 5,
    fontWeight: 'bold'
  },
});