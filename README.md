
# Homework 7: COVID-19 Cross-Platform Application (Instructions for my reference)

## Homework Goals
* Use CODVID-19 API (Documentation using postman) to build mobile application that displays:
* CODVID cases per country on a MAP
* CODVID cases per country Live on a MAP (changes)
* CODVID cases per country based on a date.
* Summary of total cases for the world
* Live Summary for the World
* Stretch goal:
* Display data per Province
* User can put their address and track CODVID-19 in their neighborhood (Only in countries where regional data is provided)

## Homework Steps
1. Set up your React Native environment. (due April 8)
2. Go through [REACT native tutorial](https://reactnative.dev/docs/tutorial) (due April 10)
    * Build Hello Applications, run Hello applications on emulator and phonee
3. Develop use case to display map. (using react-native-maps)  (due April 12)
4. On separate branch, exercise [CODVID-19 API](https://covid19api.com/) and display the data in your application as text. Be fancy and style your results. (due April 17)
5. Overlay the data on the maps (due April 24)

# Application Documentation:
## Home Screen
Displays simple landing screen and instructs user to navigate to the World tab to look at statistics (will add more tabs later)

## World
Displays world COVID-19 statistics. The worldwide totals are displayed at the top. Press and hold on a country to display the COVID-19 statistics of that country from the previous day. 

In order to create this functionality, I set up a MapView with a custom style I created on a google website that generates a JSON that defines a google maps style for MapView. As the onLongPress function (the function that is called when the user presses and holds on a certain point on the map), the handlePress() function sets the marker position to where the user pressed. Then, also within the handlePress() function, I use the Google Cloud geocoding api to convert the coordinates of the click into an address. From the address, I extract the country name and called setState to reflect that in the WorldMap class state.

In the callback function for that setState call, the application calls getCovidData(). In this function, the application looks up the country name (stored in the state) in "covid_api_country_names.json". This is a file I generated using helper.py in the root directory of the repository. It was created to exercise the COVID-19 api and extract the country names it uses. I created a dictionary that maps country names to the "Slugs" that are used in the web requests to the api, and dumped that to a JSON file. This JSON file allows the React Native application to look up the correct country slug given the country name that the Geocoding yields. Once the application has the correct slug to use in the api request, it issues the api request to "https://api.covid19api.com/total/country/{country-slug}" to fetch the COVID-19 data for that country. It then sets the state of the class with those statistics, in the state.stats attribute.

Every time the state is set, the renderCovidData() function is called in the render() of the class. This function checks whether the application is still fetching COVID-19 data, or whether it was able to get any data. This allows the application to display "Loading..." under the country name if the data has not arrived yet. If it has arrived and it was somehow invalid or unavailable, the application displays this in the marker. If the user performs a longPress on the ocean or an invalid location (that cannot be Geocoded into a specific country), the marker simply displays "Please click on a country". 

## Local
At the moment, this adds granularity to the map and data. However, it loads the live data of every province in the searched country, which significantly increases the latency of map actions (such as zooming, changing the region, etc). The solution will be to only make an api call if the user selects a certain province. The search bar could be used to simply change the view, or could be eliminated and could display the country's totals. (Mimicing the first tab, which shows the world totals at the top and allows the user to select a country).
