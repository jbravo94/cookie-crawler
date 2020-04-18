chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {

    if (request && request.data && request.data.domain && request.data.cookieidentifier) {

      chrome.cookies.getAll({ domain: request.data.domain, name: request.data.cookieidentifier }, function (cookies) {

        if (!cookies || cookies.length === 0 || !cookies[0] || !cookies[0].value) {
          alert("Could not find cookie!");
          return;
        }

        var crowdtokenkey = cookies[0].value;

        if (request.data.copyOnly) {

          var crowdcookie = document.getElementById('crowdcookie');
          crowdcookie.value = crowdtokenkey;
          crowdcookie.select();

          if (document.execCommand('copy')) {
            alert("Copied Crowd Cookie successfully!");
          } else {
            alert("Failed to get clipboard content!");
          }

          crowdcookie.value = '';

          sendResponse({ message: "Returned" });
          return;

        } else {

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
            sendResponse({ message: "Returned" });
          }).catch(function (err) {
            alert("Error occured: " + JSON.stringify(err));
            sendResponse({ message: "Returned" });
          });

        }

      });

    }
  });