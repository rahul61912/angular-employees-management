chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

// background.js

// Listen for a click on the extension icon
chrome.action.onClicked.addListener(() => {
    console.log("Extension icon clicked!");
});

// // Periodically log something
// chrome.alarms.create('checkTime', { periodInMinutes: 1 });
// chrome.alarms.onAlarm.addListener((alarm) => {
//     if (alarm.name === 'checkTime') {
//         console.log('One minute passed!');
//     }
// });
