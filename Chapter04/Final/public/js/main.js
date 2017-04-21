function submit()
{
	var file = document.getElementById("file").files[0];

	if(file)
	{
		var owner = document.getElementById("owner").value;

		if(owner == "")
		{
			alert("Please enter owner name");
		}
		else
		{
			var reader = new FileReader();
			reader.onload = function (event) {
		  		var hash = sha1(event.target.result);

		  		$.get("/submit?hash=" + hash + "&owner=" + owner, function(data){
		  			if(data == "Error")
		  			{
		  				$("#message").text("An error occured.");
		  			}
		  			else
		  			{
		  				$("#message").html("Transaction hash: " + data);
		  			}
		    	});
			};
			reader.readAsArrayBuffer(file);
		}
	}
	else
	{
		alert("Please select a file");
	}
}

function getInfo()
{
	var file = document.getElementById("file").files[0];

	if(file)
	{
		var reader = new FileReader();
		reader.onload = function (event) {
	  		var hash = sha1(event.target.result);

	  		$.get("/getInfo?hash=" + hash, function(data){
	  			if(data[0] == 0 && data[1] == "")
	  			{
	  				$("#message").html("File not found");
	  			}
	  			else
	  			{
	  				$("#message").html("Timestamp: " + data[0] + " Owner: " + data[1]);
	  			}
	    	});
		};
		reader.readAsArrayBuffer(file);
	}
	else
	{
		alert("Please select a file");
	}
}

var socket = io("http://localhost:8080");

socket.on("connect", function () {
	socket.on("message", function (msg) {
		if($("#events_list").text() == "No Transaction Found")
		{
			$("#events_list").html("<li>Txn Hash: " + msg.transactionHash + "\nOwner: " + msg.args.owner + "\nFile Hash: " + msg.args.fileHash + "</li>");
		}
		else 
		{
			$("#events_list").prepend("<li>Txn Hash: " + msg.transactionHash + "\nOwner: " + msg.args.owner + "\nFile Hash: " + msg.args.fileHash + "</li>");
		}
    });
});