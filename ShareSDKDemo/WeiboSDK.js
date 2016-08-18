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
let Weibo = sdk.Weibo;

let resolveAssetSource = require('resolveAssetSource');

import styles from './Style';
let WINDOW_WIDTH = Dimensions.get('window').width;
let WINDOW_HEIGHT = Dimensions.get('window').height;


let path = require('./jpg/res2.jpg');
let thumbnail = resolveAssetSource(path).uri;

let DataArr = {
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
          title: '是否安装微博?',
          api: 'isWeiboAppInstalled'
        },
        type2: {
          title: '能否分享',
          api: 'isCanShareInWeiboAPP'
        },
        type3: {
          title: '能否SSO授权',
          api: 'isCanSSOInWeiboApp'
        },
        type4: {
          title: '打开微博App',
          api: 'openWeiboApp'
        },
        type5: {
          title: 'iTunes地址',
          api: 'getWeiboAppInstallUrl'
        },
        type6: {
          title: 'SDK版本',
          api: 'getSDKVersion'
        },
        type7: {
          title: '授权登陆',
          api: 'authorize'
        }

      }
    ]
  },


};

import content from './ShareContent';

export default class WeiboSDK extends Component {

  constructor(props) {
    super(props);
    this.state = {
      messageType: 'text',
      api: 'isWeiboAppInstalled',
      shareResult: '--------',
      apiResult: '---------' || {}
    }
  }


  componentWillMount() {
    // 注册App
    Weibo.registerApp({
      appKey: "2641053562"
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
            style= {{position : 'absolute',alignSelf : 'center',left: 5,top: 10,fontSize : 20,fontWeight: 'bold',color:'#316532'}}
            onPress = {this.pop.bind(this)}
          >{'<首页'}</Text>
          <Text
            style = {{alignSelf : 'center',fontSize : 25,fontWeight: 'bold',color:'black'}}
          >{this.props.title?this.props.title:'微博'}</Text>
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
    if (rowData.messageType && rowData.messageType.length > 0) {
      this.setState({messageType: rowData.messageType})
    } else if (rowData.api && rowData.api.length > 0) {
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
    if (rowData.messageType && rowData.messageType == this.state.messageType) {
      return {borderColor: '#4E9136', backgroundColor: '#4E9136'};
    } else if (rowData.api && rowData.api == this.state.api) {
      return {borderColor: '#4E9136', backgroundColor: '#4E9136',};
    } else if (!rowData.messageType && !rowData.api) {
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
      this.shareTextToWeibo();
    } else if (this.state.messageType == 'image') {
      this.shareImageToWeibo();
    } else if (this.state.messageType == 'webLink') {
      this.shareWebPageToWeibo();
    } else if (this.state.messageType == 'music') {
      this.shareMusicToWeibo();
    } else if (this.state.messageType == 'video') {
      this.shareVideoToWeibo();
    }
  }

  shareTextToWeibo() {
    Weibo.shareText({
      text:content.text.text,
      redirectURI: content.text.redirectURI,
      scope: content.text.scope,
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }

  shareImageToWeibo() {
    Weibo.shareImage({
      text:content.image.text,
      imagePath:content.image.imagePath,
      redirectURI: content.image.redirectURI,
      scope: content.image.scope,
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }

  shareWebPageToWeibo() {
    Weibo.shareWebPage({
      text: content.webPage.text,
      objectID: content.webPage.objectID,
      title: content.webPage.title,
      description: content.webPage.description,
      thumbnail: content.webPage.thumbnail,
      webpageUrl: content.webPage.weiboWebUrl,
      redirectURI: content.webPage.redirectURI,
      scope: content.webPage.scope,
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }

  shareMusicToWeibo() {
    Weibo.shareMusic({
      text: content.music.text,
      objectID: content.music.objectID,
      title: content.music.title,
      description: content.music.description,
      thumbnail: content.music.thumbnail,
      musicUrl: content.music.musicUrl,
      musicLowBandUrl: content.music.musicLowBandUrl,
      redirectURI: content.music.redirectURI,
      scope: content.music.scope,
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }

  shareVideoToWeibo() {
    Weibo.shareVideo({
      text: content.video.text,
      objectID: content.video.objectID,
      title: content.video.title,
      description: content.video.description,
      thumbnail: content.video.thumbnail,
      videoUrl: content.video.weiboVideoUri,
      redirectURI: content.video.redirectURI,
      scope: content.video.scope,
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }


  //Api方法
  apiHandler(apiName) {
    if (apiName === "isWXAppInstalled") {
      this.isWeiboAppInstalled();
    } else if (apiName === "isCanShareInWeiboAPP") {
      this.isCanShareInWeiboAPP();
    } else if (apiName === "isCanSSOInWeiboApp") {
      this.isCanSSOInWeiboApp();
    } else if (apiName === "openWeiboApp") {
      this.openWeiboApp();
    } else if (apiName === "getWeiboAppInstallUrl") {
      this.getWeiboAppInstallUrl();
    } else if (apiName === "getSDKVersion") {
      this.getSDKVersion();
    } else if (apiName === "authorize") {
      this.authorize();
    }
  }

  isWeiboAppInstalled() {
    Weibo.isWeiboAppInstalled((data) => {
    })
  }

  isCanShareInWeiboAPP() {
    Weibo.isCanShareInWeiboAPP((data) => {
      this.setState({
        apiResult: data
      })
    })
  }

  isCanSSOInWeiboApp() {
    Weibo.isCanSSOInWeiboApp((data) => {
      this.setState({
        apiResult: data
      })
    })
  }

  openWeiboApp() {
    Weibo.openWeiboApp((data) => {
      this.setState({
        apiResult: data
      })
    })
  }

  getWeiboAppInstallUrl() {
    Weibo.getWeiboAppInstallUrl((data) => {
      this.setState({
        apiResult: data
      })
    })
  }

  getSDKVersion() {
    Weibo.getSDKVersion((data) => {
      this.setState({
        apiResult: data
      })
    })
  }

  authorize() {
    Weibo.authorize({redirectUrl: "https://api.weibo.com/oauth2/default.html", scope: "all"}, (data)=> {
      this.setState({apiResult: data})
    })
  }

}
