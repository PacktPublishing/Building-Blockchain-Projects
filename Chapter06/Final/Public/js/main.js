var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    lineNumbers: true,
});

var argumentsCount = 0;

document.getElementById("compile").addEventListener("click", function(){
	editor.save();
	var xhttp = new XMLHttpRequest();
	
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	if(JSON.parse(xhttp.responseText).errors != undefined)
	    	{
	    		document.getElementById("errors").innerHTML = JSON.parse(xhttp.responseText).errors + "<br><br>";
	    	}
	    	else
	    	{
	    		document.getElementById("errors").innerHTML = "";
	    	}

	    	var contracts = JSON.parse(xhttp.responseText).contracts;

	    	for(var contractName in contracts)
	    	{
	    		var abi = JSON.parse(contracts[contractName].interface);

	    		document.getElementById("arguments").innerHTML = "";

		    	for(var count1 = 0; count1 < abi.length; count1++)
		    	{
		    		if(abi[count1].type == "constructor")
		    		{
		    			argumentsCount = abi[count1].inputs.length;

		    			document.getElementById("arguments").innerHTML = '<label>Arguments</label>';

		    			for(var count2 = 0; count2 < abi[count1].inputs.length; count2++)
		    			{
		    				var inputElement = document.createElement("input");
							inputElement.setAttribute("type", "text");
							inputElement.setAttribute("class", "form-control");
							inputElement.setAttribute("placeholder", abi[count1].inputs[count2].type);
							inputElement.setAttribute("id", "arguments-" + (count2 + 1));

							var br = document.createElement("br");

							document.getElementById("arguments").appendChild(br);
							document.getElementById("arguments").appendChild(inputElement);
		    			}

		    			break;
		    		}
		    	}

		    	break;
	    	}
	    }
	};

	xhttp.open("GET", "/compile?code=" + encodeURIComponent(document.getElementById("editor").value), true);
	xhttp.send();	
})

document.getElementById("deploy").addEventListener("click", function(){
	editor.save();

	var arguments = [];

	for(var count = 1; count <= argumentsCount; count++)
	{
		arguments[count - 1] = JSON.parse(document.getElementById("arguments-" + count).value); 
	}

	var xhttp = new XMLHttpRequest();
	
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) 
	    {
	    	var res = JSON.parse(xhttp.responseText);

	    	if(res.error)
	    	{
	    		alert("Error: " + res.error)
	    	}
	    	else
	    	{
	    		alert("Txn Hash: " + res.result.hash);
	    	} 
	    }
	    else if(this.readyState == 4)
	    {
	    	alert("An error occured.");
	    }
	};

	xhttp.open("GET", "/deploy?code=" + encodeURIComponent(document.getElementById("editor").value) + "&arguments=" + encodeURIComponent(JSON.stringify(arguments)) + "&address=" + document.getElementById("address").value + "&key=" + document.getElementById("key").value, true);
	xhttp.send();	
})