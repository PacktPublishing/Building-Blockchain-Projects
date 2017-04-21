var express = require("express");  
var app = express();  
var server = require("http").createServer(app);
var io = require("socket.io")(server);

server.listen(8080);

app.use(express.static("public"));

app.get("/", function(req, res){
	res.sendFile(__dirname + "/public/html/index.html");
})

var Web3 = require("web3");

web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));	

var proofContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"fileHash","type":"string"}],"name":"get","outputs":[{"name":"timestamp","type":"uint256"},{"name":"owner","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"string"},{"name":"fileHash","type":"string"}],"name":"set","outputs":[],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"status","type":"bool"},{"indexed":false,"name":"timestamp","type":"uint256"},{"indexed":false,"name":"owner","type":"string"},{"indexed":false,"name":"fileHash","type":"string"}],"name":"logFileAddedStatus","type":"event"}]);
var proof = proofContract.at("0xf7f02f65d5cd874d180c3575cb8813a9e7736066");

app.get("/submit", function(req, res){
	var fileHash = req.query.hash;
	var owner = req.query.owner;

	proof.set.sendTransaction(owner, fileHash, {
		from: web3.eth.accounts[0],
	}, function(error, transactionHash){
		if (!error)
		{
			res.send(transactionHash);
		}
		else
		{
			res.send("Error");
		}
	})
})

app.get("/getInfo", function(req, res){
	var fileHash = req.query.hash;

	var details = proof.get.call(fileHash);

	res.send(details);
})

proof.logFileAddedStatus().watch(function(error, result){
	if(!error)
	{
		if(result.args.status == true)
		{
			io.send(result);
		}
	}
})