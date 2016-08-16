import React, {Component} from 'react';
import {
  View,
  ListView,
  Text,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from 'react-native';

import sdk from 'react-native-social-kit';
let resolveAssetSource = require('resolveAssetSource');

import styles from './Style';

let WINDOW_WIDTH = Dimensions.get('window').width;
let WINDOW_HEIGHT = Dimensions.get('window').height;

let QQ = sdk.QQ;

let path = require('./jpg/res2.jpg');
let thumbImage = "file://" + resolveAssetSource(path).uri;
let thumbnail = resolveAssetSource(path).uri;

let imageUrl = resolveAssetSource(require('./jpg/tampon0.jpg')).uri;
let imageUrl1 = resolveAssetSource(require('./jpg/tampon1.jpg')).uri;
let imageUrl2 = resolveAssetSource(require('./jpg/tampon2.jpg')).uri;
let imageUrl3 = resolveAssetSource(require('./jpg/tampon3.jpg')).uri;
let imageUrl4 = resolveAssetSource(require('./jpg/tampon3.jpg')).uri;

let DataArr = {
  '分享方式': {
    title: '分享方式',
    rowData: [
      {
        type1: {
          title: '好友',
          scene: 'QQ'
        },
        type2: {
          title: 'QZone',
          scene: 'Qzone'
        },
        type3: {
          title: '群部落',
          scene: 'QQGroup'
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
          title: '多图',
          messageType: 'imageArray'
        },
        type4: {
          title: '链接',
          messageType: 'webLink'
        },
        type5: {
          title: '音乐',
          messageType: 'music'
        },
        type6: {
          title: '视频',
          messageType: 'video'
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
          title: '是否安装QQ?',
          api: 'iphoneQQInstalled'
        },
        type2: {
          title: 'SSO登录QQ?',
          api: 'iphoneQQSupportSSOLogin'
        },
        type3: {
          title: '是否安装Qzone?',
          api: 'iphoneQZoneInstalled'
        },
        type4: {
          title: 'SSO登录Qzone?',
          api: 'iphoneQZoneSupportSSOLogin'
        },
        type5: {
          title: 'SDK大版本号',
          api: 'sdkSubVersion'
        },
        type6: {
          title: 'SDK小版本号',
          api: 'sdkVersion'
        },
        type7: {
          title: 'QQ版本号',
          api: 'iphoneQQVersion'
        },
        type8: {
          title: '授权登陆',
          api: 'authorize'
        },

      }
    ]
  }
};

export default class QQSDK extends Component {

  constructor(props) {
    super(props);
    this.state = {
      scene: 'QQ',
      messageType: 'text',
      api: 'iphoneQQInstalled',
      shareResult: '--------',
      apiResult: '---------' || {}
    }
  }

  componentWillMount() {
    // 注册App
    QQ.registerApp({
      appId: "222222"
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
      <ScrollView
        style = {styles.container}
      >
        <View style={styles.navigator}>
          <Text
            style= {{position : 'absolute',alignSelf : 'center',left: 5,top: 10,fontSize : 20,fontWeight: 'bold',color:'green'}}
            onPress = {this.pop.bind(this)}
          >{'<首页'}</Text>
          <Text
            style = {{alignSelf : 'center',fontSize : 25,fontWeight: 'bold',color:'black'}}
          >{this.props.title?this.props.title:'微信'}</Text>
        </View>
        <ListView
          dataSource={dataSource.cloneWithRowsAndSections(DataArr,sectionIDs,rowIDs)}
          renderRow={this.renderRow.bind(this)}
          renderSectionHeader={this.renderSectionHeader.bind(this)}

        />
      </ScrollView>
    )
  }

  _onPressHandle(rowData) {
    if (rowData.scene && rowData.scene.length > 0) {
      this.setState({scene: rowData.scene})
    } else if (rowData.messageType && rowData.messageType.length > 0) {
      this.setState({messageType: rowData.messageType})
    } else if (rowData.api && rowData.api.length > 0) {
      console.log("rowData.api" + rowData.api);
      this.setState({api: rowData.api})
      this.apiHandler(rowData.api);
    } else {
      this.shareMessage();
    }
  }

  pop() {
    const {navigator} = this.props;
    if (navigator) {
      navigator.pop();
    }
  }

  // 渲染cell
  renderRow(rowData, sectionID:number, rowID:number) {
    let rowdataIDs = Object.keys(rowData);
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
      console.log(this.state.scene);
      this.shareTextToQQ(this.state.scene);
    } else if (this.state.messageType == 'image') {
      this.shareImageToQQ(this.state.scene);
    } else if (this.state.messageType == 'imageArray') {
      this.shareImageArrayToQQ(this.state.scene);
    } else if (this.state.messageType == 'webLink') {
      this.shareWebPageToQQ(this.state.scene);
    } else if (this.state.messageType == 'music') {
      this.shareMusicToQQ(this.state.scene);
    } else if (this.state.messageType == 'video') {
      this.shareVideoToQQ(this.state.scene);
    }
  }

  shareTextToQQ(scene) {
    QQ.shareText({
      text: "这里是一个QQ文本分享的文本",
      scene: scene
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }

  shareImageToQQ(scene) {
    QQ.shareImage({
      title: "QQ图片分享",
      description: "这里是一个QQ图片分享的文本",
      scene: scene,
      imagePath: resolveAssetSource(require('./jpg/tampon0.jpg')).uri,
      previewImagePath: thumbnail,
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }

  shareImageArrayToQQ(scene) {
    QQ.shareImageArray({
      title: "QQ多图分享",
      description: "这里是一个QQ多图分享的文本",
      scene: scene,
      previewImagePath: thumbnail,
      imageArray: [imageUrl, imageUrl1, imageUrl2, imageUrl3, imageUrl4],
      previewImageURL: thumbImage,
      url: "http://a.hiphotos.baidu.com/zhidao/pic/item/ac6eddc451da81cb91b89bd25666d01609243156.jpg",
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }

  shareWebPageToQQ(scene) {
    QQ.shareWebPage({
      title: "QQ网页分享",
      description: "这是一个QQ网页分享的示例",
      url: "http://sina.cn?a=1",
      previewImageURL: thumbImage,
      // previewImageURL: "http://a.hiphotos.baidu.com/zhidao/pic/item/ac6eddc451da81cb91b89bd25666d01609243156.jpg",
      scene: scene,
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }

  shareMusicToQQ(scene) {
    QQ.shareMusic({
      title: "QQ音乐分享",
      description: "这是一个QQ音乐分享的示例",
      url: "http://y.qq.com/#type=song&id=103347",
      previewImageURL: thumbImage,
      // previewImageURL: "http://a.hiphotos.baidu.com/zhidao/pic/item/ac6eddc451da81cb91b89bd25666d01609243156.jpg",
      flashURL: "http://player.video.qiyi.com/0bb2ae16923822161de984728ac5c415/0/0/v_19rrmdkfh4.swf-albumId=517678900-tvId=517678900-isPurchase=0-cnId=6",
      scene: scene,
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }

  shareVideoToQQ(scene) {
    QQ.shareVideo({
      title: "QQ视频分享",
      description: "这是一个QQ视频分享的示例",
      url: "http://y.qq.com/#type=song&id=103347",
      previewImageURL: thumbImage,
      // previewImageURL: "http://a.hiphotos.baidu.com/zhidao/pic/item/ac6eddc451da81cb91b89bd25666d01609243156.jpg",
      flashURL: "http://player.video.qiyi.com/0bb2ae16923822161de984728ac5c415/0/0/v_19rrmdkfh4.swf-albumId=517678900-tvId=517678900-isPurchase=0-cnId=6",
      scene: scene,
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }


  //Api方法
  apiHandler(apiName) {
    if (apiName === "iphoneQQInstalled") {
      this.iphoneQQInstalled();
    } else if (apiName === "iphoneQQSupportSSOLogin") {
      this.iphoneQQSupportSSOLogin();
    } else if (apiName === "iphoneQZoneInstalled") {
      this.iphoneQZoneInstalled();
    } else if (apiName === "iphoneQZoneSupportSSOLogin") {
      this.iphoneQZoneSupportSSOLogin();
    } else if (apiName === "sdkVersion") {
      this.sdkVersion();
    } else if (apiName === "sdkSubVersion") {
      this.sdkSubVersion();
    } else if (apiName === "iphoneQQVersion") {
      this.iphoneQQVersion();
    } else if (apiName === "authorize") {
      this.auth();
    }
  }

  iphoneQQInstalled() {
    QQ.iphoneQQInstalled((data) => {
      console.log("iphoneQQInstalled = " + data);
      this.setState({
        apiResult: data
      })
    })
  }

  iphoneQQSupportSSOLogin() {
    QQ.iphoneQQSupportSSOLogin((data) => {
      console.log("iphoneQQSupportSSOLogin = " + data);
      this.setState({
        apiResult: data
      })
    })
  }

  iphoneQZoneInstalled() {
    QQ.iphoneQZoneInstalled((data) => {
      console.log("iphoneQZoneInstalled = " + data);
      this.setState({
        apiResult: data
      })
    })
  }

  iphoneQZoneSupportSSOLogin() {
    QQ.iphoneQZoneSupportSSOLogin((data) => {
      console.log("iphoneQZoneSupportSSOLogin = " + data);
      this.setState({
        apiResult: data
      })
    })
  }

  sdkVersion() {
    QQ.sdkVersion((data) => {
      console.log("sdkVersion = " + data);
      this.setState({
        apiResult: data
      })
    })
  }

  sdkSubVersion() {
    QQ.sdkSubVersion((data) => {
      console.log("sdkSubVersion = " + data);
      this.setState({
        apiResult: data
      })
    })
  }

  iphoneQQVersion() {
    QQ.iphoneQQVersion((data) => {
      console.log("iphoneQQVersion = " + data);
      this.setState({
        apiResult: data
      })
    })
  }

  auth() {
    QQ.authorize(
      {permissions: []},
      (data)=> {
        this.setState({apiResult: data})
      }
    )
  }

}
