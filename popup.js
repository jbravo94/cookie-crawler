var domain = document.getElementById("domain");
var cookieidentifier = document.getElementById("cookieidentifier");

document.getElementById("save").addEventListener("click", function () {

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
      cookieidentifier: cookieidentifier.value
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