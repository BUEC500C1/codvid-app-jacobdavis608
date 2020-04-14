import React, {Component} from 'react';
import { StyleSheet, Text, View, Dimensions} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Callout } from 'react-native-maps'
import { createBottomTabNavigator, createAppContainer } from 'react-navigation'
import Geocoder from 'react-native-geocoding';



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    },
    text: {
        textAlign: 'center',
        fontSize: 32,
        justifyContent: 'center'
    },
    callout: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 10,
        width: "40%",
        marginLeft: "30%",
        marginRight: "30%",
        marginTop: 20
    }
  });



export default class WorldMap extends Component {
    render(){
      return(
        <View style={styles.container}>
          <MapView
          style = {{ flex: 1 }}
          provider= { PROVIDER_GOOGLE }
          showsUserLocation
          initialRegion={{
            latitude: 42.3505,
            longitude: -71.1054,
            latitudeDelta: 10.0,
            longitudeDelta: 10.0}}
          customMapStyle={countriesStyle}
          zoomControlEnabled={true}
          zoomEnabled={true}
          />
        </View>
        
      );

    }
}