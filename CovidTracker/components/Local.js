import React, {Component} from 'react';
import { StyleSheet, Text, View, TextInput} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import {format} from 'date-fns';
import {Callout} from 'react-native-maps'
import {Marker} from 'react-native-maps'

const api_country_names = require('../covid_api_country_names.json');

const provincesStyle = require('../mapstyles/provincesStyle.json');

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: "center"
    },
    text: {
        textAlign: 'center',
        fontSize: 10,
        justifyContent: 'center',
        color: "#01f5ff"
    },
    calloutView: {
      flexDirection: "row",
      justifyContent: "center",
      backgroundColor: "rgba(3, 44, 71, 0.9)",
      borderRadius: 5,
      width: "70%",
      marginLeft: "10%",
      marginRight: "10%",
      marginTop: 40
    },
    calloutText: {
      textAlign: 'center',
      fontSize: 20,
      justifyContent: 'center',
      color: "#01f5ff",
      fontWeight: 'bold'
    },
    calloutSearch: {
      flex: 1,
      color: "#01f5ff",
      borderColor: "transparent",
      borderWidth: 10,
      fontSize: 18,
    },
    marker: {
      flex: 1,
      backgroundColor: 'rgba(3,44,71, 0.9)',
      padding: 5,
      borderRadius: 5
    },
    selectedMarker: {
      flex: 1,
      backgroundColor: '#01f5ff',
      padding: 5,
      borderRadius: 5
    }
  });

export default class LocalMap extends Component {
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
        selectedMarker: -1, 
      }
      this.updateProvinceMarkers = this.updateProvinceMarkers.bind(this);
      this.printState = this.printState.bind(this);
    }

    getDate(e){
      var date = new Date();
      date.setDate(date.getDate() - 1);
      var first_half_date = format(date, "yyyy-MM-dd")
      var second_half_date = format(date, "HH:mm:ss")
      var formatted_date = `${first_half_date}T00:00:00Z` 
      return(formatted_date)
    }
    
    printState(){
      console.log(this.state.markers[0].coordinate);
    }

    updateProvinceMarkers(e){
      
      if(api_country_names[e.nativeEvent.text] == undefined){
        console.log("Invalid country input")
        this.setState({ //reset the state
          markers: [],
          selectedMarker: 0 
        });
      } 
      else {
        var country_name = api_country_names[e.nativeEvent.text];
        var date = this.getDate();
        var api_url = `https://api.covid19api.com/live/country/${country_name}/status/confirmed/date/${date}`
        this.setState({ //reset the state
          markers: [],
          selectedMarker: 0 
        }, () => {  //make api call
          fetch(api_url)
            .then((res) => res.json())
            .then((resJson) => {
              if (resJson == undefined){ //no data returned
                console.log("No data");
              }
              else {
                var new_markers = [];
                var i;
                for (i = 0; i < resJson.length; i++){
                  var new_marker = {
                    key: i,
                    coordinate: {
                      latitude: parseFloat(resJson[i]["Lat"]),
                      longitude: parseFloat(resJson[i]["Lon"]),
                    },
                    state_name: resJson[i]["Province"], //don't set case data until user clicks on it
                    confirmed: resJson[i]["Confirmed"],
                    deaths: resJson[i]["Deaths"],
                    recovered: resJson[i]["Recovered"]
                  }
                  new_markers.push(new_marker);
                }
                console.log(new_markers.length)
                this.setState({
                  markers: new_markers,
                  selectedMarker: -1,
                }, () => this.printState()).catch((e) => console.log(e));
              } 
            }).catch((error)=>console.log(error) );
          }
        );
        
      return;
      }
    }

    renderMarker(m){
      if (this.state.selectedMarker == m.id){
        return (
          <View style={styles.selectedMarker}>
            <Text>
              Confirmed: {this.state.markers[m.id].confirmed}
            </Text>
            <Text>
              Deaths: {this.state.markers[m.id].deaths}
            </Text>
            <Text>
              Recovered: {this.state.markers[m.id].recovered}
            </Text>
          </View>
        )
      }
      else{
        return (
          <View style={styles.marker}>
            <Text style={{fontSize: 8, color: '#01f5ff'}}>
              {m.id}
            </Text>
          </View>
        )
      } 
    }

    selectMarker(m){
      this.setState({selectedMarker: m.key})
    }

    render(){
      return(
        <View style={styles.container}>
          <MapView
          style = {{ flex: 1 }}
          provider= { PROVIDER_GOOGLE }
          showsUserLocation
          initialRegion={this.state.region}
          customMapStyle={provincesStyle}
          zoomControlEnabled={true}
          zoomEnabled={true}
          > 
            {this.state.markers.map(marker => (
              <Marker key={marker.key} 
                coordinate={marker.coordinate}
              >
              <View style={styles.marker}>
                <Text>{marker.state_name}</Text>
              </View>
              </Marker>
            ))}
          </MapView>
          <Callout style={styles.calloutView}>
            <View>
              <TextInput style={styles.calloutSearch}
                placeholder={"Enter a country name..."}
                placeholderTextColor="#00b0b8"
                onSubmitEditing={e => this.updateProvinceMarkers(e)}
              />
            </View>
          </Callout>
        </View>
        
      );

    }
}



/*

          ))}*/