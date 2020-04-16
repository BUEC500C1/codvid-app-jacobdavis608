
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
Displays world COVID-19 statistics.

Created two custom map styles for the app, will eventually be able to see country by country data as well as province by province.

Going to use react-native-geocoding api to extract the country in which the user taps, will lead to a rendered callout with COVID information.

Once this is complete, will add ability to navigate between three kinds of maps