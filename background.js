const extensionId = 'crowdcookieextractor';
const cookieUrl = "https://localhost:33457";

// TODO Add polling or listener for auto updating cookie value

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {

    if (request && request.data) {

      if (request.data.method === "authorize") {

        var salt = forge.util.bytesToHex(forge.random.getBytesSync(10)).toUpperCase();

        fetch('https://localhost:33457/authorizechromeextension', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa("authorize" + ":" + "supersecret")
          },
          body: JSON.stringify({ salt: salt })
        }).then(function (response) {
          return response.json();
        }).then(function (data) {

          var md = forge.md.sha256.create();

          
          var digest = md.update(salt).digest().toHex();

          var stringtocompare = data.stringtocompare;

          var md2 = forge.md.sha256.create();
          var finalsalt = forge.util.bytesToHex(forge.random.getBytesSync(10)).toUpperCase();

          if(data.digest === digest && confirm(stringtocompare.split('').join(' '))) {
            fetch('https://localhost:33457/authorizechromeextension/token', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa("authorize" + ":" + "supersecret")
          },
          body: JSON.stringify({ salt: finalsalt, digest: md2.update(newsalt).digest().toHex() })
        }).then(function (response) {
          return response.json();
        }).then(function (data) {

          alert(data);
          var md3 = forge.md.sha256.create();

          var prepayload = {salt: data.salt, password: data.password};

          var digest = md3.update(prepayload).digest().toHex();


          if (data.digest === digest) {

            chrome.cookies.set({
              url: cookieUrl,
              name: extensionId,
              value: data.password,
              secure: true
            }, function (cookie) {
              alert("New cookie generated: " + JSON.stringify(cookie));
              sendResponse({ message: "Returned" });
              return;
            });
          }



          //sendResponse({ message: "Returned" });
          return;
        }).catch(function (err) {
          alert("Error occured: " + JSON.stringify(err));
          sendResponse({ message: "Returned" });
          return;
        });
          }

          //sendResponse({ message: "Returned" });
          return;
        }).catch(function (err) {
          alert("Error occured: " + JSON.stringify(err));
          sendResponse({ message: "Returned" });
          return;
        });

      } else if (request.data.domain && request.data.cookieidentifier) {

        chrome.cookies.get({
          url: cookieUrl,
          name: extensionId
        }, function (cookie) {
          if (cookie != null) {
            console.log("Loading existing cookie: " + JSON.stringify(cookie));
            chrome.cookies.getAll({ domain: request.data.domain, name: request.data.cookieidentifier }, function (cookies) {

              if (!cookies || cookies.length === 0 || !cookies[0] || !cookies[0].value) {
                alert("Could not find cookie!");
                return;
              }

              var crowdtokenkey = cookies[0].value;

              if (request.data.method === "copyCookie") {

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

              } else if (request.data.method === "sendCookie") {

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

              } else {
                alert("Method '" + request.data.method + "' not supported!");
              }

            });
          } else {
            alert("Not authorization cookie found. Please authorize first.");
            sendResponse({ message: "Returned" });
            return;
          }
        });
      } else {
        alert("Insufficient parameters provided.")
      }
    } else {
      alert("Please provide proper payload.");
    }
  });