var express = require("express");
var app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));

app.listen(8080);

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/public/html/index.html");
})

var request = require("request");
var moment = require("moment");

app.get("/matches", function(req, res) {
    request("https://api.crowdscores.com/v1/matches?api_key=7b7a988932de4eaab4ed1b4dcdc1a82a", function(error, response, body) {
        if (!error && response.statusCode == 200) {
            body = JSON.parse(body);

            for (var i = 0; i < body.length; i++) {
                body[i].start = moment.unix(body[i].start / 1000).format("YYYY MMM DD hh:mm:ss");
            }

            res.render(__dirname + "/public/html/matches.ejs", {
                matches: body
            });
        } else {
            res.send("An error occured");
        }
    })
})

var PythonShell = require("python-shell");

app.get("/getURL", function(req, res) {
    var matchId = req.query.matchId;
    
    var options = {
        args: ["-e", "-p", "044992e9473b7d90ca54d2886c7addd14a61109af202f1c95e218b0c99eb060c7134c4ae46345d0383ac996185762f04997d6fd6c393c86e4325c469741e64eca9", "json(https://api.crowdscores.com/v1/matches/" + matchId + "?api_key=7b7a988932de4eaab4ed1b4dcdc1a82a).outcome.winner"],
        scriptPath: __dirname
    };

    PythonShell.run("encrypted_queries_tools.py", options, function (err, results) {
        if(err)
        {
            res.send(err);
        }
        else
        {
            res.send(results[0]);
        }
    });
})