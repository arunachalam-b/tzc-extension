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
