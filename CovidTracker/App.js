import 'react-native-gesture-handler';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, {Component} from 'react';
import { StyleSheet, Text, View, Animated, ImageBackground} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
//import Animated from 'react-native-reanimated';

const countries = require("./country_locations.json");


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
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(130,4,150, 0.9)",
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(130,4,150, 0.3)",
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(130,4,150, 0.5)",
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  }
});

const bostonRegion = {
  latitude: 37.0902,
  longitude: -98.7129,
  latitudeDelta: 40.0,
  longitudeDelta: 55.0
};

let id = 0;

class WorldMap extends Component{
  constructor(props){
    super(props);
    this.state = {
      region: {
        latitude: 37.0902,
        longitude: -98.7129,
        latitudeDelta: 40.0,
        longitudeDelta: 55.0
      },
      markers: [

      ]
    }
    this.handlePress = this.handlePress.bind(this)
  }

  handlePress(e){
    this.setState({
      markers: [
        {
          coordinate: e.nativeEvent.coordinate,
          key: id++,
        },
      ],
    });
    console.log(this.state);
  }

  render() {
    return (
      <MapView
        style = {{ flex: 1 }}
        provider= { PROVIDER_GOOGLE }
        showsUserLocation
        initialRegion={bostonRegion}
        onLongPress={this.handlePress}
        customMapStyle={countriesStyle}
        zoomControlEnabled={true}
        zoomEnabled={true}
      >
      {this.state.markers.map(marker => (
          <Marker
            key={marker.key}
            coordinate={marker.coordinate}
          >
              <Animated.View style={[styles.markerWrap]}>
                <Animated.View style={[styles.ring]}/>
                <View style={styles.marker}/>
              </Animated.View>
          </Marker>
      ))}
      </MapView>
    );
  }
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
  labelStyle: styles.labelText,
}

const navTheme = {
  colors: {
    card: '#032c47',
    border: '#032c47',
  },
};

export default class App extends Component {
    
    render(){
      return(
        <NavigationContainer theme={navTheme}>
          <Tab.Navigator initialRouteName="Home" tabBarOptions={tabStyle} >
            <Tab.Screen name="Home" component={HomeScreen}/>
            <Tab.Screen name="World" component={WorldMap}/>
          </Tab.Navigator>
        </NavigationContainer>
      );

    }
}