###############################################################
#
#   Just a script that goes through and gets the longitude
#   and latitude of every country in the world for markers
#
###############################################################

import requests
from time import sleep
import json

def get_lat_and_lon():
    r = requests.get("https://api.covid19api.com/countries")
    if (r.status_code == 200):
        print("Successfully got countries data")
        country_slugs = {}
        for country in r.json():
            country_slugs[country['Country']] = country['Slug']

    # for each country, request some covid data that include longitude
    # and latitude for the country, store it in json
    country_locations = {}
    print("Getting coordinates for {0} countries".format(len(country_slugs.keys())))
    for name in country_slugs.keys():
        print(name)
        url = "https://api.covid19api.com/live/country/{0}/status/confirmed".format(country_slugs[name])
        r = requests.get(url)
        if r.status_code == 200:
            try:
                res = r.json()[0]
            except:
                res = r.json()
            country_locations[name] = {}
            if len(res):
                country_locations[name]["Lat"] = res["Lat"]
                country_locations[name]["Lon"] = res["Lat"]
            else:
                country_locations[name] = "Unavailable"
            sleep(0.1)
        elif r.status_code == 403:
            print("We look like an attack! Slow down")
            break
            
    with open("country_locations.json", 'w') as fp:
        json.dump(country_locations, fp)

if __name__ == "__main__":
    get_lat_and_lon()