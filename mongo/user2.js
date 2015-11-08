jetblue = db.getSiblingDB('jetblue')
jetblue.setProfilingLevel(2);

// cursor = jetblue.flights.find({
//     "dollartax": {"$lt": 300}
// });

cursor = jetblue.flights.aggregate([
    {
        $match: {
            origincode: "LAX",
            destinationmarketgroup: "Northeast",
            totalfare: {
                $lt: 300
            },
            date: {
                $gte: ISODate("2016-02-02T00:00:00Z"),
                $lt: ISODate("2016-02-03T00:00:00Z")
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
                    {$cond: [{$setIsSubset: [["Family"], "$destinationtype"]}, 1, 0]},
                    {$cond: [{$setIsSubset: [["Romance"], "$destinationtype"]}, 1, 0]},
                    {$cond: [{$setIsSubset: [["Exploration"], "$destinationtype"]}, 1, 0]},
                    {$cond: [{$eq: ["BOS", "$destinationcode"]}, 4, 0]},
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


