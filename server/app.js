var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    mongoose = require('mongoose'),
    url = require('url');
//    bodyParser = require('body-parser');
    // errorHandler = require('error-handler');

var app = express();

// Database

mongoose.connect('mongodb://localhost/jetblue');

// Config
//app.use(bodyParser());
// app.use(express.methodOverride());
// app.use(app.router);
app.use(express.static(path.join(application_root, "public")));
// app.use(errorHandler({ dumpExceptions: true, showStack: true }));

// Mad basic schema, but it's fast.
var Flight = new mongoose.Schema({
    origincode: {type: String, required: true},
    originmarketgroup: {type: String, required: true},
    origingeographicregion: {type: String, required: true},
    destinationcode: {type: String, required: true},
    destinationmarketgroup: {type: String, required: true},
    destinationgeographicregion: {type: String, required: true},
    destinationtype: [{type: String, required: true}],
    date: {type: Date, required: true},
    domestic: {type: Boolean, required: true},
    totalfare: {type: Number, required: true},
});

var FlightModel = mongoose.model('Flight', Flight);

/**
 * res: response
 * originCodeRequired: string=
 * destinationMarketGroupRequired: string
 * destinationTypesRequired: Array<string>=
 * maxFare: int=
 * dateStart: string
 * dateEnd: string
 * destinationTypesPreferred: Array<[string (type), int (weight)]>
 * destinationMarketGroupsPreferred: Array<[string (type), int (weight)]>
 * destinationCodePreferred: [string, string]
 */
var getFlights = function(res, originCodeRequired,
    destinationMarketGroupRequired, destinationTypesRequired,
    maxFare, dateStart, dateEnd, destinationTypesPreferred,
    destinationMarketGroupsPreferred, destinationCodePreferred,
    skip, size) {

    var pricePref = {$subtract: [1, {$divide: ["$totalfare", 50000]}]};

    var match = {
        origincode: originCodeRequired || "",
        faretype: "POINTS",
        totalfare: {
            $lte: maxFare
        },
    };

    if (destinationTypesRequired) {
        match.destinationtype = {
            $in: destinationTypesRequired || []
        };
    }

    if (destinationMarketGroupRequired) {
        match.destinationmarketgroup = destinationMarketGroupRequired;
    }

    if (dateStart) {
        match.date = {
            $gte: new Date(dateStart),
            $lt: new Date(dateEnd)
        };
    }


    // TODO(oleg): codeQuality++.
    FlightModel.aggregate([
        {
            $match: match,
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
                    $add: [pricePref].concat(
                        destinationTypesPreferred.map(function(v) {
                            return {$cond: [{$setIsSubset: [[v[0]], "$destinationtype"]}, v[1], 0]};
                        }),
                        destinationMarketGroupsPreferred.map(function(v) {
                            return {$cond: [{$eq: [v[0], "$destinationmarketgroup"]}, v[1], 0]};
                        }),
                        destinationCodePreferred ? [{$cond: [{$eq: [destinationCodePreferred[0], "$destinationcode"]}, destinationCodePreferred[1], 0]}] : []
                    ),
                }
            }
        },
        {
            $sort: {
                weight: -1
            }
        },
        {
            $skip: skip
        },
        {
            $limit: size
        }
    ], function(err, result) {
        if (err) {
            console.log(err);
            return;
        }

        console.log(result);
        return res.send(result);
    });
};

function getFlightsForUser(res, username, skip, size) {
    switch (username) {
        case "user1":
            return getFlights(res, "ORD", null, ["Nightlife", "Romance", "Beach"],
                500, "2016-01-01T00:00:00Z", "2016-04-01T00:00:00Z",
                [["Nightlife", 4], ["Romance", 2], ["Beach", 1]],
                [["Caribbean", 4], ["SouthSW", 2], ["California", 1]], null,
                skip, size);
        case "user2":
            return getFlights(res, "LAX", "Northeast", null, 300,
                "2016-02-02T00:00:00Z", "2016-02-03T00:00:00Z",
                [["Family", 1], ["Romance", 1], ["Exploration", 1]],
                [], ["Boston", 4], skip, size);
        case "user3":
            return getFlights(res, "JFK", null, ["Beach", "Family", "Exploration"],
                150, null, null, [["Beach", 4], ["Family", 2], ["Exploration", 1]],
                [], null, skip, size);
        default:
            return res.send("Invalid username");
    }
}

// Secret.
app.get('/api', function(req, res) {
  res.send('JetBlue Prize Winners\' API is running');
});

// Index. :)
app.get('/', function(req, res) {
  res.send('Welcome to iJetBlue! Please use the app, or access ' +
      '/api/flights?user=&lt;user&gt;&size=&lt;size&gt;&skip=&lt;skip&gt;');
});

// Main API yo!
app.get('/api/flights', function(req, res) {
  var queryData = url.parse(req.url, true).query;
  var username = queryData.username;
  var skip = parseInt(queryData.skip || "0");
  var size = parseInt(queryData.size || "10");

  return getFlightsForUser(res, username, skip, size);
});


// Launch server
app.listen(3000);

