import '../img/icon16.png';
import '../img/icon48.png';
import '../img/icon128.png';

// // add event listener for created new tab
//  // inject a script to page
//  // wait for content from page
//  // save content to storage
//  // wait for command from page to search

// // listen tab updated
// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//   console.log(tabId, changeInfo, tab);
// });
// // listen tab create
// chrome.tabs.onCreated.addListener(function(tab) {
//   console.log(tab);
// });
// // execute script
// chrome.tabs.executeScript(tab.id, { file: "content.js" }, function() {
//   // create elements via js, create css too in there
//   // eject message events, wait for listen from tab
// });

// // message listener
// chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
//     // Note: setTimeout itself does NOT keep the page awake. We return true
//     // from the onMessage event handler, which keeps the message channel open -
//     // in turn keeping the event page awake - until we call sendResponse.
//   sendResponse("Got your message.");
// });

// var lastTabId = -1;

// // send message
// function sendMessage() {
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     lastTabId = tabs[0].id;
//     chrome.tabs.sendMessage(lastTabId, "Background page started.");
//   });
// }

// // storage
// function saveChanges() {
//   // Get a value saved in a form.
//   var theValue = textarea.value;
//   // Check that there's some code there.
//   if (!theValue) {
//     message('Error: No value specified');
//     return;
//   }
//   // Save it using the Chrome extension storage API.
//   chrome.storage.local.set({'value': theValue}, function() {
//     // Notify that we saved.
//     message('Settings saved');
//   });
// }
// chrome.storage.onChanged.addListener(function(changes, namespace) {
//   for (key in changes) {
//     var storageChange = changes[key];
//     console.log('Storage key "%s" in namespace "%s" changed. ' +
//                 'Old value was "%s", new value is "%s".',
//                 key,
//                 namespace,
//                 storageChange.oldValue,
//                 storageChange.newValue);
//   }
// });


// ////////////////////////////////////////

// // Copyright (c) 2012 The Chromium Authors. All rights reserved.
// // Use of this source code is governed by a BSD-style license that can be
// // found in the LICENSE file.

// // Global variables only exist for the life of the page, so they get reset
// // each time the page is unloaded.
// var counter = 1;

// var lastTabId = -1;
// function sendMessage() {
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     lastTabId = tabs[0].id;
//     chrome.tabs.sendMessage(lastTabId, "Background page started.");
//   });
// }

// sendMessage();
// chrome.browserAction.setBadgeText({text: "ON"});
// console.log("Loaded.");

// chrome.runtime.onInstalled.addListener(function() {
//   console.log("Installed.");

//   // localStorage is persisted, so it's a good place to keep state that you
//   // need to persist across page reloads.
//   localStorage.counter = 1;

//   // Register a webRequest rule to redirect bing to google.
//   var wr = chrome.declarativeWebRequest;
//   chrome.declarativeWebRequest.onRequest.addRules([{
//     id: "0",
//     conditions: [new wr.RequestMatcher({url: {hostSuffix: "bing.com"}})],
//     actions: [new wr.RedirectRequest({redirectUrl: "http://google.com"})]
//   }]);
// });

// chrome.bookmarks.onRemoved.addListener(function(id, info) {
//   alert("I never liked that site anyway.");
// });

// chrome.browserAction.onClicked.addListener(function() {
//   // The event page will unload after handling this event (assuming nothing
//   // else is keeping it awake). The content script will become the main way to
//   // interact with us.
//   chrome.tabs.create({url: "http://google.com"}, function(tab) {
//     chrome.tabs.executeScript(tab.id, {file: "content.js"}, function() {
//       // Note: we also sent a message above, upon loading the event page,
//       // but the content script will not be loaded at that point, so we send
//       // another here.
//       sendMessage();
//     });
//   });
// });

// chrome.commands.onCommand.addListener(function(command) {
//   chrome.tabs.create({url: "http://www.google.com/"});
// });

// chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
//   if (msg.setAlarm) {
//     // For testing only.  delayInMinutes will be rounded up to at least 1 in a
//     // packed or released extension.
//     chrome.alarms.create({delayInMinutes: 0.1});
//   } else if (msg.delayedResponse) {
//     // Note: setTimeout itself does NOT keep the page awake. We return true
//     // from the onMessage event handler, which keeps the message channel open -
//     // in turn keeping the event page awake - until we call sendResponse.
//     setTimeout(function() {
//       sendResponse("Got your message.");
//     }, 5000);
//     return true;
//   } else if (msg.getCounters) {
//     sendResponse({counter: counter++,
//                   persistentCounter: localStorage.counter++});
//   }
//   // If we don't return anything, the message channel will close, regardless
//   // of whether we called sendResponse.
// });

// chrome.alarms.onAlarm.addListener(function() {
//   alert("Time's up!");
// });

// chrome.runtime.onSuspend.addListener(function() {
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     // After the unload event listener runs, the page will unload, so any
//     // asynchronous callbacks will not fire.
//     alert("This does not show up.");
//   });
//   console.log("Unloading.");
//   chrome.browserAction.setBadgeText({text: ""});
//   chrome.tabs.sendMessage(lastTabId, "Background page unloaded.");
// });





// // STORAGE MODULE

// // SEARCH MODULE

// // MESSAGE MODULE

// // CONTENT SCRIPT

const tabs = [];
class Tab {
  constructor(props) {
    this.content = props.content;
    this.options = props.options;
  }
}

const wordsStorage = {

};

const lastFive = [];

chrome.extension.onMessage.addListener((content, sender, sendResponse) => {
  const { type, payload } = content;
  const { tab } = sender;
  const { favIconUrl, title, active, id } = tab;
  const uiTab = {
    favIconUrl, title, active, id
  };
  switch (type) {
    case 'findWord':
      const wordsOfPayload = payload.split(' ').map((word) => word.toLowerCase());
      const final = Object.keys(wordsStorage).find((key) => {
        const inWord = wordsStorage[key];
        return wordsOfPayload.find((word) => {
          if(inWord && key.indexOf(word) > -1 || inWord && word.indexOf(key) > -1) {
            inWord.point++;
            return inWord.tabs;
          }
        });
      });
      sendResponse(Array.from(wordsStorage[final].tabs));
      break;
    case 'tabContent':
      updateLastFive(uiTab);
      for(let i=0; i<payload.length; i++) {
        const word = payload[i];
        if (wordsStorage[word] === undefined) {
          wordsStorage[word] = {
            tabs: new Set([uiTab]),
            point: 0
          }
        } else {
          wordsStorage[word].tabs.add(uiTab)
        }
      }
      console.log(wordsStorage);
      sendResponse(lastFive);
      break;
    case 'goToTab':
      updateLastFive(uiTab);
      chrome.tabs.update(payload, { "active": true, "highlighted": true });
      break;
  }
});

const updateLastFive = (uitab) => {
  if (lastFive.length !== 5) {
    lastFive.pop();
  }
  lastFive.push(uitab);
};