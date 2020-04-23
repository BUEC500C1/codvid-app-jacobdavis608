import React, {Component} from 'react';
import { StyleSheet, Text, View, TextInput} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import {format} from 'date-fns';
import {Callout} from 'react-native-maps'
import {Marker} from 'react-native-maps'

const api_country_names = require('../covid_api_country_names.json');

const provincesStyle = require('../mapstyles/provincesStyle.json');

Geocoder.init('AIzaSyCO88yA5GKJDzavK8QeDZkyu3qqTfkd_18');

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: "center"
    },
    text: {
        fontSize: 14,
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

export default class CountryMap extends Component {
    constructor(props){
      super(props);
      this.state = {
        initialRegion: {
          latitude: 42.3601,
          longitude: -71.0589,
          latitudeDelta: 50,
          longitudeDelta: 50
        },
        markers: [

        ],
        loadingCovidData: true,
        country: "",
        province: "",
        heatMap: false,
        prov_stats: {
          confirmed: 0,
          deaths: 0,
          recovered: 0,
        },
        country_stats: {
          confirmed: 0,
          deaths: 0,
          recovered: 0,
          valid: 0
        }
      }

      this.setCurrentCountryStats = this.setCurrentCountryStats.bind(this);
      this.getCovidProvinceData = this.getCovidProvinceData.bind(this);
      this.handlePress = this.handlePress.bind(this);
    }

    getYesterdaysDate(){
      var date = new Date();
      date.setDate(date.getDate() - 1); //api get yesterday's data
      var first_half_date = format(date, "yyyy-MM-dd")
      var second_half_date = format(date, "HH:mm:ss")
      var formatted_date = `${first_half_date}T00:00:00Z` 
      return(formatted_date)
    }

    componentDidMount(){
      navigator.geolocation.getCurrentPosition((position) => {
        var coordinate = {
          latitude: parseFloat(position.coords.latitude),
          longitude: parseFloat(position.coords.longitude)
        };
        
        Geocoder.from(coordinate).then(json => {
          var address = json.results[0].address_components;
          var c = ""; //country
          var i;
          console.log(address)
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
            loadingCovidData: true,
            initialRegion: {
              latitude: coordinate.latitude,
              longitude: coordinate.longitude,
              latitudeDelta: 5,
              longitudeDelta: 5
            }
          }, () => this.setCurrentCountryStats());
        }).catch(error => console.log(error)
        );
        
      });
    }

    renderCovidProvinceData(){
      if (this.state.loadingCovidData){
        return(<Text style={styles.text}>Loading...</Text>);
      } else {
        return(
          <View>
            <Text style={styles.text}>
              Confirmed: {this.state.prov_stats.confirmed}
            </Text>
            <Text style={styles.text}>
              Deaths: {this.state.prov_stats.deaths}
            </Text>
            <Text style={styles.text}>
              Recovered: {this.state.prov_stats.recovered}
            </Text>
          </View>
        );
      }
    }

    getCovidProvinceData(){
      var country_name = this.state.country;
      var date = this.getYesterdaysDate(); //api has up until yesterday
      var api_url = `https://api.covid19api.com/live/country/${this.state.country}/status/confirmed/date/${date}`
      console.log(api_url)
      fetch(api_url)
        .then((res) => res.json())
        .then((resJson) => {
              if (resJson == undefined){ //no data returned
                console.log("No data");
              }
              else {
                var i;
                for (i = 0; i < resJson.length; i++){
                  if (resJson[i]["Province"] == this.state.province){
                    var new_marker = {
                      key: i,
                      coordinate: {
                        latitude: parseFloat(resJson[i]["Lat"]),
                        longitude: parseFloat(resJson[i]["Lon"]),
                      },
                    }
                    this.setState({
                      markers: [
                        new_marker
                      ],
                      prov_stats: {
                        confirmed: resJson[i]["Confirmed"],
                        deaths: resJson[i]["Deaths"],
                        recovered: resJson[i]["Recovered"]
                      },
                      loadingCovidData: false,
                    });
                    return;
                  }
                }
              } 
            }).catch((error)=>console.log(error) );
    }

    handlePress(e){
      // identify the pressed country and display curr_stats
      Geocoder.from(e.nativeEvent.coordinate).then(json => {
        var res = json.results;
        var address = json.results[0].address_components;
        var p = ""; //province
        var i;
        for (i = 0; i < address.length; i++){
          var j;
          for (j = 0; j < address[i].types.length; j++){
            if(address[i].types[j] == "administrative_area_level_1"){
              p = address[i].long_name
              break;
            }
          }
        }

        this.setState({
          province: p, 
          loadingCovidData: true
        }, () => this.getCovidProvinceData());
        
      }).catch(error => {
          this.setState({
            province: "",
            loadingCovidData: true,
            markers: []
          });
        }
      ).done();
      return;
    }

    renderCountryStats(){
      if (this.state.country_stats.valid == 0){ //if no valid country stats
        return(
          <Text style={styles.text}>
            Your country data unavailable
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
            //console.log(resJson);
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
                country_stats: {
                  confirmed: resJson[resJson.length-1]["Confirmed"],
                  deaths: resJson[resJson.length-1]["Deaths"],
                  recovered: resJson[resJson.length-1]["Recovered"],
                  valid: 1
                }
              } ); //then set the first marker on their state
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
          initialRegion={this.state.initialRegion}
          onLongPress={this.handlePress}
          customMapStyle={provincesStyle}
          zoomControlEnabled={true}
          zoomEnabled={true}
          >
          {this.state.markers.map(marker => (
            <Marker
              key={marker.key}
              coordinate={marker.coordinate}
            >
              <View style={styles.marker}>
                <Text style={{color:"#01f5ff", fontWeight: "bold", fontSize:18}}>
                  {this.state.province}
                </Text>
                {this.renderCovidProvinceData()}
              </View>
            </Marker>

          ))}
          </MapView>
          <Callout style={styles.calloutView}>
            <View>
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