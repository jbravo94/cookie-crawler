chrome.browserAction.onClicked.addListener(function(tab) { 
  chrome.cookies.getAll({domain: "celix.at", name: "crowd.token_key"}, function (cookies) {
    
if (!cookies || cookies.length === 0 || !cookies[0] || !cookies[0].value) {
    alert("Could not find cookie!");
}

var crowdtokenkey = cookies[0].value;

//alert(crowdtokenkey);

    fetch('http://localhost:33457/setcrowdtokenkey', {
    method: 'post',
    headers: {
       'Content-Type': 'application/json',
       'Authorization': 'Basic ' + btoa("chromeext" + ":" + "supersecret")
    },
    body: JSON.stringify({crowdtokenkey: crowdtokenkey})
  }).then(function(response) {
    return response.json();
  }).then(function(data) {
    alert(JSON.stringify(data));
  }).catch(function(err){alert("Error occured: " + JSON.stringify(err));});
  });
});
