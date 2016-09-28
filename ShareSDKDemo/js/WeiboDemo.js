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

import {Weibo} from 'react-native-social-kit';

let resolveAssetSource = require('resolveAssetSource');

import styles from './Style';

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
        type41: {
          title: '打开微博App',
          api: 'openWeiboApp'
        },
        type2: {
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
      api: 'openWeiboApp',
      shareResult: '--------',
      apiResult: '---------' || {}
    }
  }


  componentWillMount() {
    // 注册App
    Weibo.registerApp(
      "2641053562"
      , (data) => {
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
      <View
        style={styles.container}
      >
        <View style={styles.navigator}>
          <Text style={styles.text}>微博</Text>
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
    if (rowData.messageType && rowData.messageType.length > 0) {
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
    Weibo.share({
      text: content.text.text,
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }

  shareImageToWeibo() {
    Weibo.share({
      text: content.image.text,
      image: content.image.image,
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }

  shareWebPageToWeibo() {
    Weibo.share({
      text: content.webPage.text,
      title: content.webPage.title,
      description: content.webPage.description,
      thumb: content.webPage.thumb,
      webpage: content.webPage.webpage,
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }

  shareMusicToWeibo() {
    Weibo.share({
      text: content.music.text,
      title: content.music.title,
      description: content.music.description,
      thumb: content.music.thumb,
      music: content.music.music,
      data: content.music.data,
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }

  shareVideoToWeibo() {
    Weibo.share({
      text: content.video.text,
      title: content.video.title,
      description: content.video.description,
      thumb: content.video.thumb,
      video: content.video.video,
      data: content.video.data,
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }


  //Api方法
  apiHandler(apiName) {
    if (apiName === "openWeiboApp") {
      this.openWeiboApp();
    } else if (apiName === "authorize") {
      this.authorize();
    }
  }

  openWeiboApp() {
    Weibo.openWeiboApp((data) => {
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
