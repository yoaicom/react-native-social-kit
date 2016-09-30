import React, {Component} from 'react';
import {
  View,
  ListView,
  Text,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';

import sdk from 'react-native-social-kit';
let resolveAssetSource = require('resolveAssetSource');

import styles from './Style';

let QQ = sdk.QQ;

let DataArr = {
  '分享方式': {
    title: '分享方式',
    rowData: [
      {
        type1: {
          title: '好友',
          scene: 'qq'
        },
        type2: {
          title: 'QZone',
          scene: 'qzone'
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
          title: '授权登陆',
          api: 'authorize'
        },

      }
    ]
  }
};

import content from './ShareContent';

export default class QQSDK extends Component {

  constructor(props) {
    super(props);
    this.state = {
      scene: 'qq',
      messageType: 'text',
      api: 'authorize',
      shareResult: '--------',
      apiResult: '---------' || {}
    }
  }

  componentDidMount() {
    QQ.registerApp('222222', this.callback);
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

  shareTextToQQ(scene) {
    QQ.share({
      text: content.text.text,
      scene: scene
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }

  shareImageToQQ(scene) {
    QQ.share({
      title: content.image.title,
      description: content.image.description,
      scene: scene,
      image: content.image.image,
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }
  shareWebPageToQQ(scene) {
    QQ.share({
      title: content.webPage.title,
      description: content.webPage.description,
      thumb: content.webPage.thumb,
      webpage: content.webPage.webpage,
      // thumb: "http://a.hiphotos.baidu.com/zhidao/pic/item/ac6eddc451da81cb91b89bd25666d01609243156.jpg",
      scene: scene,
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }

  shareMusicToQQ(scene) {
    QQ.share({
      title: content.music.title,
      description: content.music.description,
      thumb: content.music.thumb,
      music: content.music.music,
      // thumb: "http://a.hiphotos.baidu.com/zhidao/pic/item/ac6eddc451da81cb91b89bd25666d01609243156.jpg",
      data: content.music.data,
      scene: scene,
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }

  shareVideoToQQ(scene) {
    QQ.share({
      title: content.video.title,
      description: content.video.description,
      thumb: content.video.thumb,
      // thumb: "http://a.hiphotos.baidu.com/zhidao/pic/item/ac6eddc451da81cb91b89bd25666d01609243156.jpg",
      video: content.video.video,
      data: content.video.data,
      scene: scene,
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }


  //Api方法
  apiHandler(apiName) {
    if (apiName === "authorize") {
      this.auth();
    }
  }

  auth() {
    QQ.authorize(
      null,
      (data)=> {
        this.setState({apiResult: data})
      }
    )
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
        style = {styles.container}
      >
        <View style={styles.navigator}>
          <Text style={styles.text}>QQ</Text>
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
      this.shareTextToQQ(this.state.scene);
    } else if (this.state.messageType == 'image') {
      this.shareImageToQQ(this.state.scene);
    } else if (this.state.messageType == 'webLink') {
      this.shareWebPageToQQ(this.state.scene);
    } else if (this.state.messageType == 'music') {
      this.shareMusicToQQ(this.state.scene);
    } else if (this.state.messageType == 'video') {
      this.shareVideoToQQ(this.state.scene);
    }
  }


}
