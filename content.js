function showTimezonePopup(selectedText) {
  const timezones = [
    { location: "Universal Coordinated Time", abbreviation: "UTC", offset: 0 },
    { location: "Greenwich Mean Time", abbreviation: "GMT", offset: 0 },
    { location: "Western Europe (Standard)", abbreviation: "WET", offset: 0 },
    { location: "Central Europe (Standard)", abbreviation: "CET", offset: 1 },
    { location: "Eastern Europe (Standard)", abbreviation: "EET", offset: 2 },
    { location: "Moscow Standard Time", abbreviation: "MSK", offset: 3 },
    { location: "Gulf Standard Time (Dubai)", abbreviation: "GST", offset: 4 },
    { location: "India Standard Time", abbreviation: "IST", offset: 5.5 },
    { location: "Pakistan Standard Time", abbreviation: "PKT", offset: 5 },
    { location: "Indochina Time (Bangkok)", abbreviation: "ICT", offset: 7 },
    { location: "China Standard Time (Beijing)", abbreviation: "CST", offset: 8 },
    { location: "Singapore Standard Time", abbreviation: "SGT", offset: 8 },
    { location: "Philippine Standard Time", abbreviation: "PHT", offset: 8 },
    { location: "Australian Western Standard Time (Perth)", abbreviation: "AWST", offset: 8 },
    { location: "Japan Standard Time", abbreviation: "JST", offset: 9 },
    { location: "Korea Standard Time", abbreviation: "KST", offset: 9 },
    { location: "Australian Central Standard Time (Darwin)", abbreviation: "ACST", offset: 9.5 },
    { location: "Australian Eastern Standard Time (Sydney, Standard)", abbreviation: "AEST", offset: 10 },
    { location: "New Zealand Standard Time", abbreviation: "NZST", offset: 12 },
    { location: "Argentina Time", abbreviation: "ART", offset: -3 },
    { location: "Brazil Time (Sao Paulo, Standard)", abbreviation: "BRT", offset: -3 },
    { location: "Atlantic Standard Time (Halifax)", abbreviation: "AST", offset: -4 },
    { location: "Eastern Standard Time (US/Canada, New York)", abbreviation: "EST", offset: -5 },
    { location: "Central Standard Time (US/Canada, Chicago)", abbreviation: "CST", offset: -6 },
    { location: "Mountain Standard Time (US/Canada, Denver)", abbreviation: "MST", offset: -7 },
    { location: "Pacific Standard Time (US/Canada, Los Angeles)", abbreviation: "PST", offset: -8 },
    { location: "Alaska Standard Time (Anchorage)", abbreviation: "AKST", offset: -9 },
    { location: "Hawaii Standard Time", abbreviation: "HST", offset: -10 },
    { location: "Samoa Standard Time", abbreviation: "SST", offset: -11 }
  ];

  const date = new Date(selectedText);
  const savedTimezones = JSON.parse(localStorage.getItem("selectedTimezones")) || [];
  const userTimezoneOffset = -new Date().getTimezoneOffset() / 60;

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

  // Display user's local timezone
  const userTimezone = timezones.find(tz => tz.offset === userTimezoneOffset);
  if (userTimezone) {
    let localTime = new Date(date.getTime() + userTimezone.offset * 3600 * 1000);
    let timeElement = document.createElement("div");
    timeElement.textContent = `Your Timezone (${userTimezone.location} - ${userTimezone.abbreviation}): ${localTime.toISOString().slice(0, 19).replace("T", " ")}`;
    popup.appendChild(timeElement);
  }

  // Display saved timezones
  savedTimezones.forEach(({ location, abbreviation, offset }) => {
    let localTime = new Date(date.getTime() + offset * 3600 * 1000);
    let timeElement = document.createElement("div");
    timeElement.textContent = `${location} (${abbreviation}): ${localTime.toISOString().slice(0, 19).replace("T", " ")}`;
    popup.appendChild(timeElement);
  });

  // Multi-select dropdown for timezones
  let dropdown = document.createElement("select");
  dropdown.multiple = true;
  dropdown.style.width = "100%";
  dropdown.style.marginTop = "10px";

  timezones.forEach(({ location, abbreviation, offset }) => {
    let option = document.createElement("option");
    option.value = JSON.stringify({ location, abbreviation, offset });
    option.textContent = `${location} (${abbreviation})`;
    if (savedTimezones.some(tz => tz.abbreviation === abbreviation)) {
      option.selected = true;
    }
    dropdown.appendChild(option);
  });

  popup.appendChild(dropdown);

  // Save button
  let saveButton = document.createElement("button");
  saveButton.textContent = "Save Timezones";
  saveButton.style.marginTop = "10px";
  saveButton.onclick = () => {
    const selectedOptions = Array.from(dropdown.selectedOptions).map(option => JSON.parse(option.value));
    localStorage.setItem("selectedTimezones", JSON.stringify(selectedOptions));
    alert("Timezones saved!");
  };
  popup.appendChild(saveButton);

  document.body.appendChild(popup);

  document.addEventListener("click", () => {
    popup.remove();
  }, { once: true });
}
