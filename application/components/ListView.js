import React, { Component } from 'react';
import { Text, View, TouchableHighlight, StyleSheet, TextInput} from 'react-native';
import Model from './Model';
import TextField from './TextField';
import SortableListView from 'react-native-sortable-listview';
import ListViewItem from './ListViewItem';
import Utils from './Utils';
import PopupDialog from 'react-native-popup-dialog';

let dataList = [
  new Model('Buy 5 Water Cans'),
  new Model('Remember to take lunch box..!')
];

var dataListOrder = getOrder(dataList);

function getOrder(list) {
  return Object.keys(list);
}

function moveOrderItem(listView, fromIndex, toIndex) {
  Utils.move(dataListOrder, parseInt(fromIndex), parseInt(toIndex));
  if (listView.forceUpdate) listView.forceUpdate();
}

class ListView extends Component {
  constructor(props) {
    super(props);
    this.updateDataList = this.updateDataList.bind(this);
    this.onCompletedChange = this.onCompletedChange.bind(this);
    this.state = {
      dataList: dataList,
      isOpen: false,
      updatedTodo: ""
    }
  }

  //To update todo list after add new todo
  updateDataList(dataList) {
    dataListOrder = getOrder(dataList);
    this.setState({
      dataList: dataList
    });
  }

  //To move todo items 
  onCompletedChange(dataItem, index) {
    let fromIndex = dataListOrder.indexOf(index);
    let toIndex = dataItem.completed ? dataListOrder.length - 1 : 0;
    moveOrderItem(this, fromIndex, toIndex);
  }

  //On clicking Todo List
  onItemPressed(index){
    this.setState ({ 
      index: index, 
      isOpen: true 
    });
    this.popupDialog.show();
  }  

  //To update todo on clicking update button in popup window
  updateTodo(index){
    if (this.state.updatedTodo == ""){    
      this.setState ({ 
        isOpen: false 
      });  
      this.popupDialog.dismiss();      
    }else {
      Utils.move(dataList, index , 0);
      dataList.shift(dataList[index]);

      var newDataItem = new Model(this.state.updatedTodo);
      dataList.unshift(newDataItem);
      this.updateDataList(dataList);
      this.setState ({  
        updatedTodo: '', 
        isOpen: false 
      });
      this.popupDialog.dismiss();      
    }    
  }

  //To Close Popup on clicking close button in popup window
  closePopup(){
    this.setState ({ 
      isOpen: false 
    });  
    this.popupDialog.dismiss();
  }

  render() {
    let listView = (<View></View>);
    if (this.state.dataList.length) {
      listView = (
        <SortableListView
          ref='listView'
          style={ styles.listView }
          data={this.state.dataList}
          order={dataListOrder}
          onRowMoved={e => moveOrderItem(this, e.from, e.to)}
          renderRow={(dataItem, section, index) => <ListViewItem data={dataItem} dataIndex={index} 
            onItemPressed={this.onItemPressed.bind(this)} onCompletedChange={this.onCompletedChange}/>}
        />
      );
    }

    return (
        <View style={{flex: 1}}>
          <View style={ styles.appTitle }>
            <Text style={{ fontSize: 24 }}>
              To-Do
            </Text>
          </View>
          <TextField 
            data = {dataList}
            updateDataList = {this.updateDataList}/>
          {listView}
          <PopupDialog ref={(popupDialog) => { this.popupDialog = popupDialog; }}>           
              {this.state.isOpen && (
                   <View style = {styles.popupWindow}>
                      <Text style = { styles.popupWindowText }>
                         Edit To-Do
                      </Text>   
                      <TextInput
                        style = {styles.popupTextInput}
                        defaultValue = {this.state.dataList[this.state.index].title}
                        onChangeText={(text) => this.setState({updatedTodo:text})}/>   
                      <View style={ styles.popup }>                 
                      <TouchableHighlight style = {styles.submit} onPress = {this.updateTodo.bind(this,this.state.index)}>
                          <Text>
                            Update
                          </Text>
                      </TouchableHighlight>  
                      <TouchableHighlight style = {styles.submit} onPress = {this.closePopup.bind(this)}>
                          <Text>
                            Cancel
                          </Text>
                      </TouchableHighlight>
                      </View>
                  </View> 
              )} 
          </PopupDialog>
        </View>
    )
  }
};

const styles = StyleSheet.create({
 separator: {
    flex: 1,
    margin: 10,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  appTitle: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  popup: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  submit: {
    width: 100,
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: 'silver',
    padding: 10
  },
  popupTextInput: {
    margin: 20,
    fontSize: 20,
    height: 60
  },
  popupWindowText: {
    marginLeft: 130,
    marginBottom: 20,
    fontSize: 22,
    alignItems: 'center'
  },
  popupWindow: {
    flex: 1,
    justifyContent: 'center'
  },
  listView: {
    flex:1, 
    margin:20
  }
});

module.exports = ListView;