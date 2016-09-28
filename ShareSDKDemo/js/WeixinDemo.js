import React, {Component} from 'react';
import {
  View,
  ListView,
  Text,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert
} from 'react-native';

import {Weixin} from 'react-native-social-kit';

import styles from './Style';
import content from  './ShareContent';

let DataArr = {
  '分享方式': {
    title: '分享方式',
    rowData: [
      {
        type1: {
          title: '好友',
          scene: 'session'
        },
        type2: {
          title: '朋友圈',
          scene: 'timeline'
        },
        type3: {
          title: '收藏',
          scene: 'favorite'
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
        }
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
          title: '打开微信',
          api: 'openWXApp'
        },
        type2: {
          title: '授权登陆',
          api: 'authorize'
        },
        type3: {
          title: '支付',
          api: 'pay'
        },
      }
    ]
  },


};

export default class WeixinSDK extends Component {

  constructor(props) {
    super(props);
    this.state = {
      scene: 'session',
      messageType: 'text',
      api: 'authorize',
      shareResult: '--------',
      apiResult: '---------' || {}
    }
  }

  componentDidMount() {
    console.log('componentDidMount');
    Weixin.registerApp('wx1dd0b08688eecaef', this.callback);
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
      <View
        style={[styles.container]}
      >
        <View style = {styles.navigator} >
          <Text style = {styles.text}>微信</Text>
        </View>
        <ListView
          dataSource={dataSource.cloneWithRowsAndSections(DataArr,sectionIDs,rowIDs)}
          renderRow={this.renderRow.bind(this)}
          renderSectionHeader={this.renderSectionHeader.bind(this)}
        />
      </View>
    )
  }

  _onPressHandle(rowData) {
    if (rowData.scene && rowData.scene.length > 0) {
      this.setState({scene: rowData.scene})
    } else if (rowData.messageType && rowData.messageType.length > 0) {
      this.setState({messageType: rowData.messageType})
    } else if (rowData.api && rowData.api.length > 0) {
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
      return {borderColor: '#4E9136', backgroundColor: '#4E9136'};
    } else if (rowData.api && rowData.api == this.state.api) {
      return {borderColor: '#4E9136', backgroundColor: '#4E9136',};
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
      this.shareText(this.state.scene);
    } else if (this.state.messageType == 'image') {
      this.shareImage(this.state.scene);
    } else if (this.state.messageType == 'webLink') {
      this.shareWebpage(this.state.scene);
    } else if (this.state.messageType == 'music') {
      this.shareMusic(this.state.scene);
    } else if (this.state.messageType == 'video') {
      this.shareVideo(this.state.scene);
    }
  }

  shareText(scene) {
    Weixin.share({
      text: content.text.text,
      scene: scene,
      //scene: 'favorite'
      //scene: 'timeline'
    }, this.shareCallback.bind(this));
  }

  shareImage(scene) {
    Weixin.share({
      image: content.image.image,
      // image:'http://static.yoaicdn.com/shoppc/images/cover_img_e1e9e6b.jpg',
      scene: scene,
    }, this.shareCallback.bind(this));
  }

  shareMusic(scene) {
    Weixin.share({
      music: content.music.music,
      data: content.music.data,
      title: content.music.title,
      description: content.music.description,
      scene: scene,
      thumb: content.music.thumb
    }, this.shareCallback.bind(this));
  }

  shareVideo(scene) {
    Weixin.share({
      video: content.video.video,
      title:content.video.title,
      description: content.video.description,
      scene: scene,
      thumb: content.video.thumb
    }, this.shareCallback.bind(this));
  }

  shareWebpage(scene) {
    Weixin.share({
      webpage: content.webPage.webpage,
      title: content.webPage.title,
      description: content.webPage.description,
      scene: scene,
      thumb: content.webPage.thumb
    }, this.shareCallback.bind(this));
  }

  //Api方法
  apiHandler(apiName) {
    if (apiName === "authorize") {
      this.auth();
    } else if (apiName === "pay") {
      this.pay();
    } else if(apiName === "openWXApp") {
      this.openWeixinApp();
    }
  }

  auth() {
    Weixin.authorize(null, this.apiCallback.bind(this));
  }

  pay() {
    Weixin.pay({
      appId: 'wxb4ba3c02aa476ea1',
      partnerId: '1305176001',
      prepayId: 'wx20160825110537d87d6c1bc40918186006',
      package: 'Sign=WXPay',
      nonceStr: '66b7fef4fe75bbebb3b8685fd6939234',
      timeStamp: '1472094337',
      sign: '616424E003D84D6876B8F5E5F5D3CD17'
    }, this.apiCallback.bind(this));
  }

  openWeixinApp() {
    Weixin.openWeixinApp(this.apiCallback.bind(this));
  }

  callback(result) {
    console.log("result..." + JSON.stringify(result));
    // setTimeout(() => {
    //   Alert.alert(
    //     'Alert',
    //     JSON.stringify(result),
    //     [
    //       {text: 'OK'}
    //     ]
    //   );
    // }, 1000);
  }

  shareCallback(result) {
    console.log(JSON.stringify(result));
    this.setState({shareResult:JSON.stringify(result)})
  }

  apiCallback(result) {
    this.setState({apiResult:result})
  }
}
