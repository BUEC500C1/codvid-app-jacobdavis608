import React, {Component} from 'react';
import { StyleSheet, Text, View, TextInput} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import {format} from 'date-fns';
import {Callout} from 'react-native-maps'
import {Marker} from 'react-native-maps'

const api_country_names = require('../covid_api_country_names.json');

const provincesStyle = require('../mapstyles/provincesStyle.json');

Geocoder.init('');

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
        country_stats: {
          confirmed: 0,
          deaths: 0,
          recovered: 0,
          valid: 0
        }
      }
      this.setCurrentCountryStats = this.setCurrentCountryStats.bind(this);
      this.printState = this.printState.bind(this);
    }

    getDate(e){
      var date = new Date();
      date.setDate(date.getDate() - 1); //api get yesterday's data
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




    componentDidMount(){
      navigator.geolocation.getCurrentPosition((position) => {
        var lat = parseFloat(position.coords.latitude);
        var lon = parseFloat(position.coords.longitude);

        var coordinate = {
          latitude: lat,
          longitude: lon
        };

        this.setState({
          region: {
            latitude: lat,
            longitude: lon,
            latitudeDelta: 5,
            longitudeDelta: 5
          }
        });
        
        Geocoder.from(coordinate).then(json => {
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
          }, () => this.setCurrentCountryStats());
        }).catch(error => console.log(error)
        ).done();
        return;
      });
    }


    renderCountryStats(){
      if (this.state.country_stats.valid == 0){ //if no valid country stats
        return(
          <Text style={styles.text}>
            Country data unavailable
          </Text>
        );
      }
      else {
        return(
          <View>
            <Text style={styles.text}>
              Confirmed: {this.state.country_stats.confirmed}
            </Text>
            <Text style={styles.text}>
              Deaths: {this.state.country_stats.deaths}
            </Text>
            <Text style={styles.text}>
              Recovered: {this.state.country_stats.recovered}
            </Text>
          </View>
          
        );
      }
    }
    
    setCurrentCountryStats(){
      var api_url = `https://api.covid19api.com/total/country/${api_country_names[this.state.country]}`;
      fetch(api_url)
          .then((res) => res.json())
          .then((resJson) => {
            console.log(resJson);
            if (resJson.length < 1 || resJson[resJson.length-1] == undefined){ //no data returned
              this.setState({
                country_stats: {
                  confirmed: 0,
                  deaths: 0,
                  recovered: 0,
                  valid: 0
                }
              });
            }
            else {
              this.setState({
                loadingCovidData: false,
                curr_stats: {
                  confirmed: resJson[resJson.length-1]["Confirmed"],
                  deaths: resJson[resJson.length-1]["Deaths"],
                  recovered: resJson[resJson.length-1]["Recovered"],
                  valid: 1
                }
              }).then();
            }
      }).catch((error)=>console.log(error) );
    }

    render(){
      return(
        <View style={styles.container}>
          <MapView
          style = {{ flex: 1 }}
          provider= { PROVIDER_GOOGLE }
          showsUserLocation
          initialRegion={this.state.region}
          region={this.state.region}
          customMapStyle={provincesStyle}
          zoomControlEnabled={true}
          zoomEnabled={true}
          /> 
          <Callout style={styles.calloutView}>
            <View>
              <Text style={styles.calloutText}>
                Your country data:
              </Text>
              <Text style={styles.calloutText}>
                {this.state.country}
              </Text>
              {this.renderCountryStats()}
            </View>
          </Callout>
        </View>
        
      );

    }
}



/*{this.state.markers.map(marker => (
              <Marker key={marker.key} 
                coordinate={marker.coordinate}
              >
              <View style={styles.marker}>
                <Text>{marker.state_name}</Text>
              </View>
              </Marker>
            ))}*/