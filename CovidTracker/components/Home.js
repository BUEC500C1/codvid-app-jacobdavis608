import React, {Component} from 'react';
import { StyleSheet, Text, View, Button} from 'react-native';
import {createStackNavigator, createAppContainer } from 'react-navigation';

export default class HomeScreen extends Component {
    render(){
      return(
        <View style={styles.container}>
          <Text>
            Welcome to COVID Tracker, an app to view worldwide COVID-19 data.
          </Text>
          <Button  
          title="View World"
          onPress={() => this.props.navigation.navigate('World')}
          />
        </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: "center",
  },
  text: {
      textAlign: 'center',
      fontSize: 32,
  }
});