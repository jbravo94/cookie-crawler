var domain = document.getElementById("domain");
var cookieidentifier = document.getElementById("cookieidentifier");

const extensionId = 'crowdcookieextractor';


document.getElementById("save").addEventListener("click", function () {

  // /Users/johnny/Library/Application Support/Google/Chrome/Default/Local Extension Settings/extension_id

  chrome.storage.sync.set({
    data: {
      domain: domain.value,
      cookieidentifier: cookieidentifier.value
    }
  }, function () {
    alert("Config saved.");
  });
});

document.getElementById("send").addEventListener("click", function () {

  chrome.runtime.sendMessage({
    data: {
      domain: domain.value,
      cookieidentifier: cookieidentifier.value,
      method: "sendCookie"
    }
  }, function (response) {
    console.log(response);
    window.close();
  });
});

document.getElementById("copy").addEventListener("click", function () {

  chrome.runtime.sendMessage({
    data: {
      domain: domain.value,
      cookieidentifier: cookieidentifier.value,
      method: "copyCookie"
    }
  }, function (response) {
    console.log(response);
    window.close();
  });
});

document.getElementById("authorize").addEventListener("click", function () {

  chrome.runtime.sendMessage({
    data: {
      method: "authorize"
    }
  }, function (response) {
    console.log(response);
    window.close();
  });
});

chrome.storage.sync.get('data', function (result) {

  if (result && result.data && result.data.domain) {
    domain.value = result.data.domain;
  } else {
    domain.value = "example.com";
  }

  if (result && result.data && result.data.cookieidentifier) {
    cookieidentifier.value = result.data.cookieidentifier;
  } else {
    cookieidentifier.value = "crowd.token_key";
  }
});