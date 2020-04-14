import React, {Component} from 'react';
import { StyleSheet, Text, View, Dimensions} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import {Callout} from 'react-native-maps'
import Geocoder from 'react-native-geocoding'

Geocoder.init('AIzaSyB18RorpIkOIeqtKe_a3E8Qd8Dsq6UYno8');

Geocoder.from("United States").then(json => {
  var location = json.results[0].geometry.location;
  console.log(location);
}).catch(error => console.warn(error));


const countriesStyle = require('./mapstyles/countriesStyle.json');

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: "center"
  },
  text: {
      textAlign: 'center',
      fontSize: 32,
      justifyContent: 'center'
  }
});

export default class App extends Component {
    constructor(props){
      super(props);
      this.state={

      }      
    }
    
    render(){
      return(
        <View style={styles.container}>
          <Callout>
            <View style={styles.container}>
              <Text>
                Hello!
              </Text>
            </View>
          </Callout>
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
        </View>
        
      );

    }
}