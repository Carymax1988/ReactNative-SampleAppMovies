/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Image,
  ListView,
  ScrollView,
  Text,
  View
} from 'react-native';
var MOCKED_MOVIES_DATA = {rating: {'average': 6.6}, 
title: '\u60ca\u5929\u9b54\u76d7\u56e22', 
original_title: 'Now You See Me 2', 
images: {'large': 
'http://img3.doubanio.com/view/movie_poster_cover/lpst/public/p2355440566.jpg'}}

var REQUEST_URL = 'http://api.douban.com/v2/movie/in_theaters';
class SampleAppMovies extends Component {
  constructor(props) {
    super(props);   //这一句不能省略，照抄即可
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
    };
    // 在ES6中，如果在自定义的函数里使用了this关键字，则需要对其进行“绑定”操作，否则this的指向不对
    // 像下面这行代码一样，在constructor中使用bind是其中一种做法（还有一些其他做法，如使用箭头函数等）
    this.fetchData = this.fetchData.bind(this); 
  }
  componentDidMount() {
    this.fetchData();
  }
  fetchData() {
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        // 注意，这里使用了this关键字，为了保证this在调用时仍然指向当前组件，我们需要对其进行“绑定”操作
        this.setState({
		  dataSource: this.state.dataSource.cloneWithRows(responseData.subjects),
          loaded: true,
        });
      })
      .done();
  }

  render() {
	if (!this.state.loaded) {
      return this.renderLoadingView();
    }
	
    return (
	
	  <ScrollView>
		<Text style={styles.topTitle}>最新电影</Text>
		<ListView style={styles.listView}
        dataSource={this.state.dataSource}
        renderRow={this.renderMovie}
        style={styles.listView}
		/>
	  </ScrollView>
    );
  }
  renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text>
          正在加载电影数据……
        </Text>
      </View>
    );
  }
  renderMovie(movie) {
    return (
      <View style={styles.container}>
		<Image source={{uri: movie.images.large}} style={styles.thumbnail} />
		
		<View style={styles.rightContainer}>
			<Text style={styles.title}>片名：{movie.title}</Text>
			<Text style={styles.original_title}>原名：{movie.original_title}</Text>
		</View>
		<Text style={styles.average}>评分：{movie.rating.average}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
	paddingTop: 5,
	paddingBottom: 5,
    flex: 1,
	flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  thumbnail: {
    width: 106,
    height: 162,
  },
  rightContainer: {
    flex: 1,
  },
  topTitle: {
    fontSize: 28,
    marginBottom: 10,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  original_title: {
	fontSize: 14,
    textAlign: 'center',
  },
  average: {
	fontSize: 18,
	color:'#f57f17',
    textAlign: 'right',
  },
  listView: {
    marginLeft: 20,
	marginRight: 20,
	marginBottom: 20,
    backgroundColor: '#F5FCFF',
  },
});

AppRegistry.registerComponent('SampleAppMovies', () => SampleAppMovies);
