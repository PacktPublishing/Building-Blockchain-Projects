var express = require("express");  
var app = express();  

app.use(express.static("public"));

app.get("/", function(req, res){
	res.sendFile(__dirname + "/public/html/index.html");
})

app.listen(8080);

var solc = require("solc");

app.get("/compile", function(req, res){
	var output = solc.compile(req.query.code, 1);
	res.send(output);
})

var Web3 = require("web3");
var BigNumber = require("bignumber.js");
var ethereumjsUtil = require("ethereumjs-util");
var ethereumjsTx = require("ethereumjs-tx");

var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

function etherSpentInPendingTransactions(address, callback)
{
	web3.currentProvider.sendAsync({
  		method: "txpool_content",
  		params: [],
  		jsonrpc: "2.0",
  		id: new Date().getTime()
	}, function (error, result) {
		if(result.result.pending)
		{
			if(result.result.pending[address])
			{
				var txns = result.result.pending[address];
				var cost = new BigNumber(0);
				
				for(var txn in txns)
				{
					cost = cost.add((new BigNumber(parseInt(txns[txn].value))).add((new BigNumber(parseInt(txns[txn].gas))).mul(new BigNumber(parseInt(txns[txn].gasPrice)))));
				}

				callback(null, web3.fromWei(cost, "ether"));
			}
			else
			{
				callback(null, "0");
			}
		}
		else
		{
			callback(null, "0");
		}
	})
}

function getNonce(address, callback)
{
	web3.eth.getTransactionCount(address, function(error, result){
		var txnsCount = result;

		web3.currentProvider.sendAsync({
	  		method: "txpool_content",
	  		params: [],
	  		jsonrpc: "2.0",
	  		id: new Date().getTime()
		}, function (error, result) {
			if(result.result.pending)
			{
				if(result.result.pending[address])
				{
					txnsCount = txnsCount + Object.keys(result.result.pending[address]).length;
					callback(null, txnsCount);
				}
				else
				{
					callback(null, txnsCount);
				}
			}
			else
			{
				callback(null, txnsCount);
			}
		})
	})
}

app.get("/deploy", function(req, res){
	var code = req.query.code;
	var arguments = JSON.parse(req.query.arguments);
	var address = req.query.address;

	var output = solc.compile(code, 1);

	var contracts = output.contracts;

	for(var contractName in contracts)
	{
		var abi = JSON.parse(contracts[contractName].interface);
		var byteCode = contracts[contractName].bytecode;

		var contract = web3.eth.contract(abi);

		var data = contract.new.getData.call(null, ...arguments, {
			data: byteCode
		});

		var gasRequired = web3.eth.estimateGas({
		    data: "0x" + data
		});

		web3.eth.getBalance(address, function(error, balance){
			var etherAvailable = web3.fromWei(balance, "ether");
			etherSpentInPendingTransactions(address, function(error, balance){
				etherAvailable = etherAvailable.sub(balance)
				if(etherAvailable.gte(web3.fromWei(new BigNumber(web3.eth.gasPrice).mul(gasRequired), "ether")))
				{
					getNonce(address, function(error, nonce){
						var rawTx = {
					        gasPrice: web3.toHex(web3.eth.gasPrice),
					        gasLimit: web3.toHex(gasRequired),
					        from: address,
					        nonce: web3.toHex(nonce),
					        data: "0x" + data
					    };

						var privateKey = ethereumjsUtil.toBuffer(req.query.key, 'hex');
						var tx = new ethereumjsTx(rawTx);
						tx.sign(privateKey);

						web3.eth.sendRawTransaction("0x" + tx.serialize().toString('hex'), function(err, hash) {
							res.send({result: {
								hash: hash,
							}});
						});
					})
				}
				else
				{
					res.send({error: "Insufficient Balance"});
				}
			})
		})

    	break;
	}
})