chrome.browserAction.onClicked.addListener(function(tab) { 
  chrome.cookies.getAll({name: "crowd.token_key"}, function (cookies) {
    alert(JSON.stringify(cookies));
  });
});
