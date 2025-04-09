chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "convertTimezone",
    title: "Convert Timezone",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "convertTimezone" && info.selectionText) {
    const isoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
    if (isoPattern.test(info.selectionText)) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: showTimezonePopup,
        args: [info.selectionText]
      });
    }
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

  // Position the popup at the cursor's location
  document.addEventListener("mousemove", (event) => {
    popup.style.left = `${event.pageX}px`;
    popup.style.top = `${event.pageY}px`;
  }, { once: true });

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
