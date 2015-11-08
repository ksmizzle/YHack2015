import csv
from datetime import datetime
from pymongo import MongoClient

#dict mapping marketgroup id to marketgroup name
marketgroup = {
    '1':"California",
    '2':"Caribbean",
    '3':"Mid-Atlantic",
    '4':"Mountain/Desert",
    '5':"Northeast",
    '6':"SouthSW",
    }

# dict mapping destination type number to text and display order
destinationtype = {
    '19':"Family",
    '21':"Nightlife",
    '22':"Exploration",
    '23':"Romance",
    '24':"Beach",
    }

#dict mapping airpotr code to geographic id
airportregion = {}

#dict mapping geographic region  id to a geographic name and marketname
geographicregion = {}

#dict mapping a pair of cities to a list of destination types
citypairdestinationtype = {}

def main():
    client = MongoClient()
    db = client.jetblue

    # db = client.primer
    # coll = db.dataset
    

    firstline = True
    with open('CityPairDestinationType-stg.csv', 'r') as csvfile:
        csvreader = csv.reader(csvfile, delimiter = ',')
        for row in csvreader:
            # print("in citypair, " + str(row[0]))
            if firstline:
                firstline = False
                continue
            # print(str(row[0])+str(row[1]))
            citypairdestinationtype.setdefault(str(row[0]+row[1]), [] ).append(destinationtype[row[2]])
            # citypairdestinationtype[str(row[0]+row[1])] = desinationtype[row[2]]
    # print('citypairdestinationtype ' + str(citypairdestinationtype))
    firstline = True
    with open('GeographicRegion-stg.csv', 'r') as csvfile:
        csvreader = csv.reader(csvfile, delimiter = ',')
        for row in csvreader:
            if firstline:
                firstline = False
                continue
            # print(str(row[1]))
            geographicregion[row[0]] = [row[2], marketgroup[row[1]]]

    firstline = True
    with open('AirportRegion-stg.csv', 'r') as csvfile:
        
        csvreader = csv.reader(csvfile, delimiter = ',')
        for row in csvreader:
            if firstline:
                firstline = False
                continue
            airportregion[row[0]] = geographicregion[row[1]]

    for airport in airportregion:
        result = db.airports.insert_one(
            {
                "_id": airport,
                "geographicregion": airportregion[airport][0],
                "marketgroup": airportregion[airport][1],
            })

    for pair in citypairdestinationtype:
        result = db.trips.insert_one(
            {
                "_id": pair,
                "origin": {
                    'id':pair[0:3],
                    "$ref": "airports",
                    },
                "destination": {
                    'id': pair[3:6],
                    "$ref": "airports",
                } ,
                "destinationtype": citypairdestinationtype[pair],
            })

    firstline = True
    with open('Fares.Fare-stg.csv', 'r') as csvfile:
        csvreader = csv.reader(csvfile, delimiter = ',')
        for row in csvreader:
            domestic = True
            if firstline:
                firstline = False
                continue
            # print(str(row[10]))
            if (row[10] == '0'):
                domestic = False
            result = db.flights.insert_one(
                {
                    "date": datetime.strptime(str(row[3]), r'%m/%d/%Y %H:%M'), #str(row[3]),
                    "dollarfare": row[6],
                    "dollartax": row[7],
                    "faretype": row[5],
                    "pointsfare":row[8],
                    "pointstax":row[9],
                    "trip": {
                        "$ref": "trips",
                        "$id": str(row[1]) + str(row[2]),
                        },
                    "domestic": domestic
                })

           


    # print (str(airportregion))
if __name__=='__main__':
    main()