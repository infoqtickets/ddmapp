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
		if (obj.Response.Header.RequestActionName == 'getnotifications')
		{
			//alert(msg);
				
			if (obj.Response.Notifications !== undefined)
			{
				const listDiv = document.getElementById("notilist");
				let datenow = new Date();
				
				obj.Response.Notifications.forEach(n => {
					let notidate = new Date(n.NotifyDate.replace(' ', 'T'));
					if (notidate <= datenow)
					{
					  const itemdiv = document.createElement("div");
					  itemdiv.className = "notification";
					  itemdiv.innerHTML = `
							<h6>${n.Title}</h6>
							<p>${n.Description}</p>
							<div class="notification-footer">
								<span>
									<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z" stroke="#787878" stroke-linecap="round" stroke-linejoin="round"/>
										<path d="M6 3V6L8 7" stroke="#787878" stroke-linecap="round" stroke-linejoin="round"/>
									</svg>
									${timeAgo(n.NotifyDate)}
								</span>
							</div>
					  `;

					  listDiv.appendChild(itemdiv);
					}
				});
			}
		}
		if (obj.Response.Header.RequestActionName == 'getPVFavorites')
		{
			//alert("getPVFavorites" + msg);
			if (obj.Response.PersistentVars.favoriteids !== undefined)
			{
				if (obj.Response.PersistentVars.favoriteids !== '')
				{
					try {
						//alert('setting favorites: ' + obj.Response.PersistentVars.favoriteids);
						setFavorites(obj.Response.PersistentVars.favoriteids);
						//alert('done');
					} catch(err) {
						//alert('error thrown: ' + err);
					}
				}
			}
		}
		if (obj.Response.Header.RequestActionName == 'getdownloadurls')
		{
			alert(msg);
		}
		if (obj.Response.Header.RequestActionName == 'pageloaded')
		{
			//alert('page loadeddddddddddd');
			//alert(msg);
			if (obj.Response.Header.Page !== undefined)
			{
				if (obj.Response.PersistentVars.introdone !== undefined)
				{
					if (obj.Response.PersistentVars.introdone == 'true')
					{
						sendToDotNet('openmainpage');
					}
				}
			}
		}
		if (obj.Response.Header.RequestActionName == 'getsignature')
		{
			//alert('get signatureeeeeeee');
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

function tabClick(obj, val) {
	setTab(obj.getAttribute('qtmenu'), val);
}

function setTab(tabname, val)
{
	const elements = document.querySelectorAll('[qtmenu]');
	elements.forEach(element => {
	  element.classList.remove('active');
	});
	var obj = document.querySelector('[qtmenu="' + tabname + '"]');
	obj.classList.add('active');
	if (tabname == 'tab2') {
		sendToDotNet('openurl_' + val);
	}
	else {
		sendToDotNet('showcontent_' + obj.getAttribute('qtmenu'));
	}
}

function setLocalPushTest() {
	const obj = {
	  Request: {
		RequestActionName: "setlocalpush",
		MainData: {
		  Key: "myfisrtkey",
		  TargetOS: "android,ios",
		  DateFormat: "yyyy-MM-dd HH:mm:ss",
		  CreateDate: "2025-09-15 20:40:00",
		  Title: "Javascript push test",
		  Description: "Javascript description test",
		  CreatLocalPush: "true",
		  NotifyDate: "2025-09-15 20:40:00",
		  ExtraData: "blablabla",
		  ActionOnClick: "clickerdeclick"
		}
	  }
	};
	const jsonText = JSON.stringify(obj);
	sendToDotNet(jsonText);
}

function removeLocalPushTest() {
	const obj = {
	  Request: {
		RequestActionName: "removelocalpush",
		MainData: {
		  Key: "myfisrtkey"
		}
	  }
	};
	const jsonText = JSON.stringify(obj);
	sendToDotNet(jsonText);
}

function setLocalPushFavorite(key, bandname, stagename, timelabel, datetime) {
	let thedate = new Date(datetime.replace(" ", "T"));
	const obj = {
	  Request: {
		RequestActionName: "setlocalpush",
		MainData: {
		  Key: "fav-" + key,
		  TargetOS: "android,ios",
		  DateFormat: "yyyy-MM-dd HH:mm:ss",
		  CreateDate: datetime,
		  Title: bandname + " is starting soon",
		  Description: bandname + " is starting soon at " + stagename + " @ " + timelabel,
		  CreatLocalPush: "true",
		  NotifyDate: formatDate(new Date(thedate.getTime() - 15 * 60 * 1000)), // 15 minuten eerder
		  ExtraData: "",
		  ActionOnClick: ""
		}
	  }
	};
	const jsonText = JSON.stringify(obj);
	sendToDotNet(jsonText);
}

function removeLocalPushFavorite(key, datetime) {
	let thenotidate = new Date(datetime.replace(" ", "T"));
	let datenow = new Date();
	//alert('test');
	if (new Date(thenotidate.getTime() - 15 * 60 * 1000) > datenow)
	{
		//alert('yes you can remove the push');
		const obj = {
		  Request: {
			RequestActionName: "removelocalpush",
			MainData: {
			  Key: "fav-" + key
			}
		  }
		};
		const jsonText = JSON.stringify(obj);
		sendToDotNet(jsonText);
	}
	else {
		//alert('nope you can\'t remove the push');
	}
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
		},
		PersistentVars : {
			PopupHeaderBGColor: "e0a200",
			PopupHeaderTextColor: "ffffff",
			introdone: "false"
		}
	  }
	};
	const jsonText = JSON.stringify(obj);
	sendToDotNet(jsonText);
}

function setPersistentVars() {
	const obj = {
	  Request: {
		RequestActionName: "setPersistentVars",
		PersistentVars : {
			PopupHeaderBGColor: "e0a200",
			PopupHeaderTextColor: "ffffff"
		}
	  }
	};
	const jsonText = JSON.stringify(obj);
	sendToDotNet(jsonText);
}

function getPVFavorites() {
	const obj = {
	  Request: {
		RequestActionName: "getPVFavorites"
	  }
	};
	const jsonText = JSON.stringify(obj);
	sendToDotNet(jsonText);
}

function getNotifications() {
	const obj = {
	  Request: {
		RequestActionName: "getnotifications",
		MainData: {
		  Take: 30,
		  OrderBy: "NotifyDate"
		}
	  }
	};
	const jsonText = JSON.stringify(obj);
	sendToDotNet(jsonText);
}

function getSignature(theval) {
	const obj = {
	  Request: {
		RequestActionName: "getsignature",
		MainData: {
		  valuetosign: "testje"
		}
	  }
	};
	const jsonText = JSON.stringify(obj);
	sendToDotNet(jsonText);
}

function getDownloadUrls() {
	const obj = {
	  Request: {
		RequestActionName: "getdownloadurls"
	  }
	};
	const jsonText = JSON.stringify(obj);
	sendToDotNet(jsonText);
}
function setDownloadUrls() {
	const obj = {
	  Request: {
		RequestActionName: "setdownloadurls",
		MainData: {
		  DOWNLOAD_QTICKETS_BASEURL: "https://www.qtickets.nl/eventsapps/ddmapp/",
		  DOWNLOAD_BASEURL: "https://www.qtickets.nl/eventsapps/ddmapp/",
		  DOWNLOAD_RELEASE_TAG_URL: "https://www.qtickets.nl/eventsapps/ddmapp/releasetag.txt"
		},
	  }
	};
	const jsonText = JSON.stringify(obj);
	sendToDotNet(jsonText);
}
function resetDownloadUrls() {
	sendToDotNet("resetalldowloadurls");
}

function permissionGranted(perm) {
	alert('Permission granted: ' + perm);
}

function onPageAppearing(fileviewed) {
	//alert('page appeared: ' + fileviewed);
	if (fileviewed == 'index1.html')
	{
		var v = document.getElementById('headerVideo'); if (v) { v.play(); }
	}
	if (fileviewed == 'index4.html')
	{
		getPVFavorites();
	}
}

// helper functions

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function timeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString.replace(' ', 'T'));
    let diffMs = now - date; // verschil in milliseconden
    const isFuture = diffMs < 0;
    diffMs = Math.abs(diffMs);

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30); // ruwe schatting
    const years = Math.floor(days / 365);

    let value, unit;

    if (years > 0) {
        value = years;
		if (value > 1) { 
			unit = "years";
		} else { 
			unit = "year"; 
		}
    } else if (months > 0) {
        value = months;
		if (value > 1) { 
			unit = "months";
		} else { 
			unit = "month"; 
		}
    } else if (weeks > 0) {
        value = weeks;
		if (value > 1) { 
			unit = "weeks";
		} else { 
			unit = "week"; 
		}
    } else if (days > 0) {
        value = days;
		if (value > 1) { 
			unit = "days";
		} else { 
			unit = "day"; 
		}
    } else if (hours > 0) {
        value = hours;
		if (value > 1) { 
			unit = "hours";
		} else { 
			unit = "hour"; 
		}
    } else if (minutes > 0) {
        value = minutes;
		if (value > 1) { 
			unit = "minutes";
		} else { 
			unit = "minute"; 
		}
    } else {
        value = seconds;
		if (value > 1) { 
			unit = "seconds";
		} else { 
			unit = "second"; 
		}
    }

    return isFuture ? `in ${value} ${unit}` : `${value} ${unit} ago`;
}

function formatDate(date) {
  const pad = n => String(n).padStart(2, "0");
  return (
    date.getFullYear() + "-" +
    pad(date.getMonth() + 1) + "-" +
    pad(date.getDate()) + " " +
    pad(date.getHours()) + ":" +
    pad(date.getMinutes()) + ":" +
    pad(date.getSeconds())
  );
}