import {StyleSheet,Dimensions,PixelRatio} from 'react-native';

let WINDOW_WIDTH = Dimensions.get('window').width;
let WINDOW_HEIGHT = Dimensions.get('window').height;

var styles = StyleSheet.create({
  container:{
    backgroundColor: 'white',
    marginTop:20
  },
  navigator: {
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center',
    height: 44,
    width: WINDOW_WIDTH,
    backgroundColor: 'white'
  },
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
    backgroundColor: '#90C76D',
    borderColor: '#90C76D',
    alignItems: 'center',
    borderWidth: 1,
    // borderRadius: 5,
  },
  resultRow: {
    justifyContent: 'center',
    padding: 5,
    margin: 3,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    borderWidth: 1,
    width: 310,
    height: 150,
  },
  sectionHeaderFont: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color:'#316532'
  },
  sectionHeader: {
    height: 30,
    justifyContent: 'center',
    backgroundColor: '#E5E5E5',
    borderTopWidth: 1/PixelRatio.get(),
    borderTopColor: '#E5E5E5',
    borderBottomWidth: 1/PixelRatio.get(),
    borderBottomColor: '#E5E5E5'
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

module.exports = styles;