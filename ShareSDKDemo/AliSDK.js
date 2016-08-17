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
  PixelRatio
} from 'react-native';

import sdk from 'react-native-social-kit';

import styles from './Style';
let WINDOW_WIDTH = Dimensions.get('window').width;
let WINDOW_HEIGHT = Dimensions.get('window').height;

let Ali = sdk.Ali;

export default class AliSDK extends Component {

  constructor(props) {
    super(props);
    this.state = {
      result:'',
      payResult:''
    }
  }

  render() {
    return (
      <View
        style={{flex:1,backgroundColor:'white',marginTop:20}}
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
        <TouchableOpacity
          style={{width: 310,height: 50,marginTop:20,alignSelf:'center',backgroundColor: 'green',justifyContent: 'space-around',borderWidth: 1 / PixelRatio.get(),marginBottom: 5}}
          onPress = {this.pay.bind(this)}
        >
          <Text
            style = {{fontSize: 25, fontWeight: 'bold', alignSelf: 'center'}}
          >支付</Text>
        </TouchableOpacity>

        <View style={[styles.resultRow,{alignSelf:'center'}]}>
          <Text style={styles.text}>支付下单返回</Text>
          <Text style={styles.text}>{this.state.result}</Text>
        </View>

        <View style={[styles.resultRow,{alignSelf:'center'}]}>
          <Text style={styles.text}>支付返回</Text>
          <Text style={styles.text}>{this.state.payResult}</Text>
        </View>

      </View>
    )
  }

  pop() {
    const {navigator} = this.props;
    if (navigator) {
      navigator.pop();
    }
  }

  pay() {
    Ali.pay(
      {},
      (data)=> {
        console.log(JSON.stringify(data));
        this.setState({result:JSON.stringify(data)})
      },
      (data)=> {
        console.log(JSON.stringify(data));
        this.setState({payResult:JSON.stringify(data)})
      }
    )
  }

}
