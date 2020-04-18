chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {

    if (request && request.data && request.data.domain && request.data.cookieidentifier) {

      chrome.cookies.getAll({ domain: request.data.domain, name: request.data.cookieidentifier }, function (cookies) {

        if (!cookies || cookies.length === 0 || !cookies[0] || !cookies[0].value) {
          alert("Could not find cookie!");
        }

        var crowdtokenkey = cookies[0].value;

        fetch('https://localhost:33457/setcrowdtokenkey', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa("chromeext" + ":" + "supersecret")
          },
          body: JSON.stringify({ crowdtokenkey: crowdtokenkey })
        }).then(function (response) {
          return response.json();
        }).then(function (data) {
          alert(JSON.stringify(data));
        }).catch(function (err) { alert("Error occured: " + JSON.stringify(err)); });
      });
      sendResponse({ message: "Returned" });
    }
  });
