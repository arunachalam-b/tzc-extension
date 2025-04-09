const isoPattern1 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
const isoPattern2 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "convertTimezone",
    title: "Convert Timezone",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "convertTimezone" && info.selectionText) {
    if (isoPattern1.test(info.selectionText) || isoPattern2.test(info.selectionText)) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (selectedText) => {
          showTimezonePopup(selectedText);
        },
        args: [info.selectionText]
      });
    }
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "triggerConvertTimezone") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: (isoPattern1Source, isoPattern2Source) => {
          const isoPattern1 = new RegExp(isoPattern1Source);
          const isoPattern2 = new RegExp(isoPattern2Source);

          const selection = window.getSelection().toString();
          if (selection) {
            if (isoPattern1.test(selection) || isoPattern2.test(selection)) {
              showTimezonePopup(selection);
            } else {
              alert("Please select a valid ISO 8601 date string.");
            }
          } else {
            alert("No text selected.");
          }
        },
        args: [isoPattern1.source, isoPattern2.source]
      });
    });
  }
});
