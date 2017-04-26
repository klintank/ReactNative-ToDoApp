import React, { Component } from 'react';
import { View, TextInput, StyleSheet, TouchableHighlight, Text, Button } from 'react-native';
import Model from './Model';
import Utils from './Utils';

class TextField extends Component {
  constructor(props) {
    super(props);
    this.searchTodo = this.searchTodo.bind(this);
    this.addTodo = this.addTodo.bind(this);
  }

  componentWillMount() {
    this.setState({
      todo: ''
    });    
  }

  //To Search the existing Todo in the list
  searchTodo(event){
    var title = event.nativeEvent.text;
    var dataList = this.props.data.filter((item) => item.title.match(new RegExp('.*' + title +'.*', 'gi')));
    this.setState({todo: title});
    this.props.updateDataList(dataList);
  }

  //To add new Todo in the list, shows alert when empty list is tried to create.
  addTodo(event){
    if(this.state.todo == ""){
        //Show toast if new todo is empty
        alert("Kindly enter the text...!");
    }else {
      var newDataItem = new Model(this.state.todo);
      var dataList = this.props.data;

      //To check whether the todo is already added or not
      var dataItem = Utils.findTodo(newDataItem, dataList);
      if(dataItem) {
          alert("Already added....!");
      }else {
          //Add the new todo to the top of the array list
          dataList.unshift(newDataItem);
          //To clear the InputText field values
          this.setState({ todo: ""});
          //To update the list array
          this.props.updateDataList(dataList);
      }      
    }      
  }

  render() {
    return (
      <View>
        <TextInput style={styles.input}
            placeholder='Add a todo or Search'
            blurOnSubmit={false}
            defaultValue={this.state.todo}
            onChange={this.searchTodo}>
        </TextInput>
        <TouchableHighlight style={ styles.add } underlayColor = {'red'} onPress = {this.addTodo}>
            <Text style={{ fontSize: 16 }}>
               Add
            </Text>
         </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  add: {
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor: 'silver',
    height: 40,
    marginLeft: 15,
    marginRight: 15
  },
  input: {
    height: 50, 
    padding: 5, 
    margin: 10,
    fontSize: 16, 
    borderWidth: 1, 
    borderColor: '#eee', 
    borderRadius: 8, 
    backgroundColor: '#fff'
  }
});
module.exports = TextField;