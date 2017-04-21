window.addEventListener("load", function(){
	var accounts = web3.eth.accounts;

	var html = "";

	for(var count = 0; count < accounts.length; count++)
	{
		html = html + "<option>" + accounts[count] + "</option>";
	}

	document.getElementById("fromAddress").innerHTML = html;
	document.getElementById("address").innerHTML = html;

	MetaCoin.detectNetwork();
})

document.getElementById("sendForm").addEventListener("submit", function(e){
	e.preventDefault();

	MetaCoin.deployed().then(function(instance){
		return instance.sendCoin(document.getElementById("toAddress").value, document.getElementById("amount").value, {
			from: document.getElementById("fromAddress").options[document.getElementById("fromAddress").selectedIndex].value
		});
	}).then(function(result){
		alert("Transaction mined successfully. Txn Hash: " + result.tx);
	}).catch(function(e){
		alert("An error occured");
	})
})

document.getElementById("findBalanceForm").addEventListener("submit", function(e){
	e.preventDefault();

	MetaCoin.deployed().then(function(instance){
		return instance.getBalance.call(document.getElementById("address").value);
	}).then(function(result){
		console.log(result);
		alert("Balance is: " + result.toString() + " metacoins");
	}).catch(function(e){
		alert("An error occured");
	})
})