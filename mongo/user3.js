jetblue = db.getSiblingDB('jetblue')
jetblue.setProfilingLevel(2);

// cursor = jetblue.flights.find({
//     "dollartax": {"$lt": 300}
// });

cursor = jetblue.flights.aggregate([
    {
        $match: {
            origincode: "JFK",
            destinationtype: {
                $in: ["Beach", "Family", "Exploration"]
            },
            totalfare: {
                $lt: 150
            },
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
                    {$cond: [{$setIsSubset: [["Beach"], "$destinationtype"]}, 4, 0]},
                    {$cond: [{$setIsSubset: [["Family"], "$destinationtype"]}, 2, 0]},
                    {$cond: [{$setIsSubset: [["Exploration"], "$destinationtype"]}, 1, 0]},
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


