jetblue = db.getSiblingDB('jetblue')
jetblue.setProfilingLevel(2);

// cursor = jetblue.flights.find({
//     "dollartax": {"$lt": 300}
// });

cursor = jetblue.flights.aggregate([
    {
        $match: {
            origincode: "ORD",
            destinationtype: {
                $in: ["Nightlife", "Romance", "Beach"]
            },
            totalfare: {
                $lt: 500
            },
            date: {
                $gte: ISODate("2016-01-01T00:00:00Z"),
                $lt: ISODate("2016-04-01T00:00:00Z")
            }
        }
    },
    {
        $project: {
            _id: false,
            origincode: true,
            originmarketgroup: true,
            origingeographicregion: true,
            destinationcode: true,
            destinationmarketgroup: true,
            destinationgeographicregion: true,
            destinationtype: true,
            date: true,
            domestic: true,
            totalfare: true,
            weight: {
                $add: [
                    {$cond: [{$setIsSubset: [["Nightlife"], "$destinationtype"]}, 4, 0]},
                    {$cond: [{$setIsSubset: [["Romance"], "$destinationtype"]}, 2, 0]},
                    {$cond: [{$setIsSubset: [["Beach"], "$destinationtype"]}, 1, 0]},
                    {$cond: [{$eq: ["Caribbean", "$destinationmarketgroup"]}, 4, 0]},
                    {$cond: [{$eq: ["SouthSW", "$destinationmarketgroup"]}, 2, 0]},
                    {$cond: [{$eq: ["California", "$destinationmarketgroup"]}, 1, 0]},
                    {$subtract: [1, {$divide: ["$totalfare", 50000]}]},
                ]
            }
        }
    },
    {
        $sort: {
            weight: -1
        }
    }
])


var count = 0;
cursor.next();
while ( cursor.hasNext() ) {
   printjson( cursor.next() );
   count++;
}

print("count is " + count);


