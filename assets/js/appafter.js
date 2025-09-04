function sendToDotNet(msg) {
	window.location.href = 'about:blank#' + encodeURIComponent(msg);
}
function receiveFromDotNet(msg) {
	//alert('From .NET: ' + msg);
	//document.getElementById('testje').innerHTML = msg;
	//alert(msg);
	try {
		// Even laten zien hoeveel tekens de string is
		//alert("Lengte van msg: " + msg.length);

		// Proberen te parsen
		const obj = JSON.parse(msg);
		
		if (obj.Response.Header.RequestActionName == 'actionniels')
		{
			alert(msg);
		}
		//alert("JSON succesvol geparsed!");
		//alert("RequestActionName = " + obj.Response.Header.RequestActionName);
	} catch (e) {
		//alert("Parse fout:\n" + e.message);
	}	
}
function hideMenu() {
	$('.sidebar').removeClass('show');
	$('.menu-toggler').removeClass('show');
}
function postMainData() {
	// Het JSON-object
	const obj = {
	  Request: {
		RequestActionName: "actionniels",
		MainData: {
		  var1: "val1",
		  var2: "val1",
		  var3: {
			subvar1: 1,
			subvar2: 2,
			subvar3: {
			  subsubvar1: "A",
			  subsubvar2: "B"
			}
		  }
		}
	  }
	};

	// Omzetten naar string (JSON tekst)
	const jsonText = JSON.stringify(obj);
	
	sendToDotNet(jsonText);
}
