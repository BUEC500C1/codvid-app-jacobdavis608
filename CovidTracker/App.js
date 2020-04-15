import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, {Component} from 'react';
import { StyleSheet, Text, View, Dimensions, ImageBackground} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import {Callout} from 'react-native-maps'
import Geocoder from 'react-native-geocoding'

//Geocoder.init('');

/* Geocoder.from("United States").then(json => {
  var location = json.results[0].geometry.location;
  console.log(location);
}).catch(error => console.warn(error));*/

const homeBackground = { uri : "https://media.apnarm.net.au/media/images/2020/03/14/v3imagesbin33da6b497a420ebd3f8906c6d09f44d1-tayrc2vjat0f2p1uzt2_t1880.jpg" };

const countriesStyle = require('./mapstyles/countriesStyle.json');

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: "center"
  },
  titleText: {
      textAlign: 'center',
      fontSize: 32,
      justifyContent: 'center',
      color: "#01f5ff"
  },
  labelText: {
    textAlign: 'center',
    fontSize: 18,
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 14,
    justifyContent: 'center',
    color: "#01f5ff"
  },
  homeView:{
      flex: 1,
      justifyContent: "center",
  },
  image: {
    flex: 1,
    resizeMode: "contain",
    justifyContent: "center"
  }
});

function WorldMap(){
  return (
    <MapView
      style = {{ flex: 1 }}
      provider= { PROVIDER_GOOGLE }
      showsUserLocation
      initialRegion={{
        latitude: 42.3505,
        longitude: -71.1054,
        latitudeDelta: 30.0,
        longitudeDelta: 35.0}}
      customMapStyle={countriesStyle}
      zoomControlEnabled={true}
      zoomEnabled={true}
    />
  );
}

function HomeScreen(){
  return(
    <View style={styles.homeView}>
      <ImageBackground source={homeBackground} style={styles.image} blurRadius={2}>
        <Text style={styles.titleText}>
          Welcome to COVID-19 Tracker
        </Text>
        <Text style={styles.text}>
          Keep up with the latest Johns Hopkins University COVID-19 statistics by navigating to the World Tab
        </Text>
      </ImageBackground>
      
    </View>
  );
}

Tab = createBottomTabNavigator();

const tabStyle = {
  activeTintColor: "#01f5ff",
  activeBackgroundColor: "#032c47",
  inactiveBackgroundColor: "#032c47",
  labelStyle: styles.labelText,
}

export default class App extends Component {
    constructor(props){
      super(props);
      this.state={
        
      }      
    }
    
    render(){
      return(
        <NavigationContainer>
          <Tab.Navigator initialRouteName="Home" tabBarOptions={tabStyle} >
            <Tab.Screen name="Home" component={HomeScreen}/>
            <Tab.Screen name="World" component={WorldMap}/>
          </Tab.Navigator>
        </NavigationContainer>
      );

    }
}