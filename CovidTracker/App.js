import 'react-native-gesture-handler';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, {Component} from 'react';
import { StyleSheet, Text, View, Animated, ImageBackground} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
//import Animated from 'react-native-reanimated';

const api_country_names = require("./covid_api_country_names.json");

Geocoder.init('');

Geocoder.from("United States").then(json => {
  var location = json.results[0].geometry.location;
}).catch(error => console.warn(error));

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
    backgroundColor: 'rgba(3,44,71, 0.9)',
    padding: 5,
    borderRadius: 5
  },
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

      ],
      loadingCovidData: true,
      country: "",
      stats: {
        date: "",
        confirmed: 0,
        deaths: 0,
        recovered: 0
      }
    }
    this.handlePress = this.handlePress.bind(this)
  }

  getCovidData(){
    var api_url = `https://api.covid19api.com/total/country/${api_country_names[this.state.country]}`;
    fetch(api_url)
        .then((res) => res.json())
        .then((resJson) => {
          if (resJson.length < 1 || resJson[resJson.length-1] == undefined){ //no data returned
            this.setState({
              loadingCovidData: false,
              stats: {
                date: "No data available",
                confirmed: 0,
                deaths: 0,
                recovered: 0
              }
            });
          }
          else {
            this.setState({
              loadingCovidData: false,
              stats: {
                date: resJson[resJson.length-1]["Date"],
                confirmed: resJson[resJson.length-1]["Confirmed"],
                deaths: resJson[resJson.length-1]["Deaths"],
                recovered: resJson[resJson.length-1]["Recovered"]
              }
            }).then();
          } 
    }).catch((error)=>console.log(error) );
  }

  renderCovidData() {
    var data_style = {
      fontStyle: 'italic',
      color:"#01f5ff"
    }


    if (this.state.country == "" && !this.state.loadingCovidData){ //no country there
      return (<Text style={data_style}>No Data</Text>)
    }
    else if (this.state.loadingCovidData && this.state.country == ""){
      return (<Text style={data_style}>No Data</Text>)
    }
    else if (this.state.loadingCovidData){ //country there but waiting for data
      return (
        <View>  
          <Text style={{color:"#01f5ff", fontWeight: "bold", fontSize:18}}>
                {this.state.country}
          </Text>
          <Text style={data_style}>Loading...</Text>
        </View>
      )
    }
    else{ //received data
      return(
        <View>
          <Text style={{color:"#01f5ff", fontWeight: "bold", fontSize:18}}>
                {this.state.country}
          </Text>
          <Text style={data_style}>
          Date: {this.state.stats.date}
          </Text>
          <Text style={data_style}>
            Confirmed: {this.state.stats.confirmed}
          </Text>
          <Text style={data_style}>
            Deaths: {this.state.stats.deaths}
          </Text>
          <Text style={data_style}>
            Recovered: {this.state.stats.recovered}
          </Text>
        </View>
      );
    }
  }


  handlePress(e){
    //get the full address of the click
    this.setState({
      markers: [
        {
          coordinate: e.nativeEvent.coordinate,
          key: id++,
        },
      ],
    });

    // identify the pressed country and display stats
    Geocoder.from(e.nativeEvent.coordinate).then(json => {
      var res = json.results;
      var address = json.results[0].address_components;
      var c = "";
      var i;
      for (i = 0; i < address.length; i++){
        var j;
        for (j = 0; j < address[i].types.length; j++){
          if(address[i].types[j] == "country"){
            c = address[i].long_name
            break;
          }
        }
      }
      this.setState({
        country: c, 
        loadingCovidData: true
      }, () => this.getCovidData());
    }).catch(error => {
        this.setState({
          country: "",
          loadingCovidData: true,
          markers: []
        });
      }
    ).done();
    return;
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
            <View style={styles.marker}>
              {this.renderCovidData()}
            </View>
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