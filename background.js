chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "convertTimezone",
    title: "Convert Timezone",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "convertTimezone" && info.selectionText) {
    const isoPattern1 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
		const isoPattern2 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
    if (isoPattern1.test(info.selectionText) || isoPattern2.test(info.selectionText)) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: showTimezonePopup,
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
        func: () => {
					function showTimezonePopup(selectedText) {
						const timezones = ["IST", "EST", "PST", "UTC", "SGT", "JST", "CST"];
						const date = new Date(selectedText);
						const offsets = {
							IST: 5.5,
							EST: -5,
							PST: -8,
							UTC: 0,
							SGT: 8,
							JST: 9,
							CST: 8
						};
					
						let popup = document.createElement("div");
						popup.style.position = "absolute";
						popup.style.background = "#fff";
						popup.style.border = "1px solid #ccc";
						popup.style.padding = "10px";
						popup.style.zIndex = "10000";
					
						const selection = window.getSelection();
						if (selection.rangeCount > 0) {
							const range = selection.getRangeAt(0);
							const rect = range.getBoundingClientRect();
							popup.style.left = `${rect.left + window.scrollX}px`;
							popup.style.top = `${rect.bottom + window.scrollY}px`;
						}
					
						timezones.forEach((tz) => {
							let offset = offsets[tz];
							let localTime = new Date(date.getTime() + offset * 3600 * 1000);
							let timeElement = document.createElement("div");
							timeElement.textContent = `${tz}: ${localTime.toISOString().slice(0, 19).replace("T", " ")}`;
							popup.appendChild(timeElement);
						});
					
						let addTimezone = document.createElement("button");
						addTimezone.textContent = "Add Timezone";
						addTimezone.onclick = () => {
							let newTz = prompt("Enter timezone offset (e.g., +5.5 for IST):");
							if (newTz) {
								let offset = parseFloat(newTz);
								let localTime = new Date(date.getTime() + offset * 3600 * 1000);
								let timeElement = document.createElement("div");
								timeElement.textContent = `Custom: ${localTime.toISOString().slice(0, 19).replace("T", " ")}`;
								popup.appendChild(timeElement);
							}
						};
						popup.appendChild(addTimezone);
					
						document.body.appendChild(popup);
					
						document.addEventListener("click", () => {
							popup.remove();
						}, { once: true });
					}

          const selection = window.getSelection().toString();
          if (selection) {
            const isoPattern1 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
						const isoPattern2 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
            if (isoPattern1.test(selection) || isoPattern2.test(selection)) {
              showTimezonePopup(selection);
            } else {
              alert("Please select a valid ISO 8601 date string.");
            }
          } else {
            alert("No text selected.");
          }
        }
      });
    });
  }
});

function showTimezonePopup(selectedText) {
  const timezones = ["IST", "EST", "PST", "UTC", "SGT", "JST", "CST"];
  const date = new Date(selectedText);
  const offsets = {
    IST: 5.5,
    EST: -5,
    PST: -8,
    UTC: 0,
    SGT: 8,
    JST: 9,
    CST: 8
  };

  let popup = document.createElement("div");
  popup.style.position = "absolute";
  popup.style.background = "#fff";
  popup.style.border = "1px solid #ccc";
  popup.style.padding = "10px";
  popup.style.zIndex = "10000";

  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    popup.style.left = `${rect.left + window.scrollX}px`;
    popup.style.top = `${rect.bottom + window.scrollY}px`;
  }

  timezones.forEach((tz) => {
    let offset = offsets[tz];
    let localTime = new Date(date.getTime() + offset * 3600 * 1000);
    let timeElement = document.createElement("div");
    timeElement.textContent = `${tz}: ${localTime.toISOString().slice(0, 19).replace("T", " ")}`;
    popup.appendChild(timeElement);
  });

  let addTimezone = document.createElement("button");
  addTimezone.textContent = "Add Timezone";
  addTimezone.onclick = () => {
    let newTz = prompt("Enter timezone offset (e.g., +5.5 for IST):");
    if (newTz) {
      let offset = parseFloat(newTz);
      let localTime = new Date(date.getTime() + offset * 3600 * 1000);
      let timeElement = document.createElement("div");
      timeElement.textContent = `Custom: ${localTime.toISOString().slice(0, 19).replace("T", " ")}`;
      popup.appendChild(timeElement);
    }
  };
  popup.appendChild(addTimezone);

  document.body.appendChild(popup);

  document.addEventListener("click", () => {
    popup.remove();
  }, { once: true });
}
