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
  const timezoneButtonText = "Add/Remove";

  let popup = document.createElement("div");
  popup.style.position = "absolute";
  popup.style.background = "#ffffff";
  popup.style.border = "1px solid #ddd";
  popup.style.padding = "15px";
  popup.style.zIndex = "10000";
  popup.style.borderRadius = "8px";
  popup.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
  popup.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  popup.style.opacity = "0";
  popup.style.transform = "translateY(-10px)";

  setTimeout(() => {
    popup.style.opacity = "1";
    popup.style.transform = "translateY(0)";
  }, 10);

  popup.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    popup.style.left = `${rect.left + window.scrollX}px`;
    popup.style.top = `${rect.bottom + window.scrollY}px`;
  }

  let timeRoot = document.createElement("div");
  timeRoot.id = "timeRoot";
  popup.appendChild(timeRoot);
  
  const showUserTimezone = () => {
    const userTimezone = timezones.find(tz => tz.offset === userTimezoneOffset);
    if (userTimezone) {
      let localTime = new Date(date.getTime() + userTimezone.offset * 3600 * 1000);

      // Create a container for the user's timezone box
      let userTimezoneBox = document.createElement("div");
      userTimezoneBox.style.display = "flex";
      userTimezoneBox.style.marginBottom = "10px";
      userTimezoneBox.style.padding = "10px";
      userTimezoneBox.style.background = "#e9f7ef"; // Slightly different background for user timezone
      userTimezoneBox.style.borderRadius = "5px";
      userTimezoneBox.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";

      // Create the left section (50%)
      let leftSection = document.createElement("div");
      leftSection.style.flex = "1";
      leftSection.style.display = "flex";
      leftSection.style.flexDirection = "column";
      leftSection.style.justifyContent = "space-between";
      leftSection.style.paddingRight = "10px";

      // Add location (bolded) to the top half with ellipsis and tooltip
      let locationElement = document.createElement("div");
      locationElement.textContent = userTimezone.location;
      locationElement.style.fontWeight = "450";
      locationElement.style.marginBottom = "5px";
      locationElement.style.whiteSpace = "nowrap";
      locationElement.style.overflow = "hidden";
      locationElement.style.textOverflow = "ellipsis";
      locationElement.style.maxWidth = "200px"; // Explicitly set max width
      locationElement.title = userTimezone.location; // Tooltip
      leftSection.appendChild(locationElement);

      // Add abbreviation (greyed out) to the bottom half
      let abbreviationElement = document.createElement("div");
      abbreviationElement.textContent = userTimezone.abbreviation;
      abbreviationElement.style.color = "#6c757d";
      leftSection.appendChild(abbreviationElement);

      // Create the right section (50%)
      let rightSection = document.createElement("div");
      rightSection.style.flex = "1";
      rightSection.style.display = "flex";
      rightSection.style.flexDirection = "column";
      rightSection.style.justifyContent = "space-between";

      // Add date and time in 24-hour format to the top half
      let dateTime24Element = document.createElement("div");
      dateTime24Element.textContent = `${formatDate(localTime)} ${localTime.toISOString().slice(11, 19)}`; // Date and time in 24-hour format
      dateTime24Element.style.marginBottom = "5px";
      rightSection.appendChild(dateTime24Element);

      // Add date and time in 12-hour format to the bottom half
      let dateTime12Element = document.createElement("div");
      const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
      dateTime12Element.textContent = `${formatDate(localTime)} ${localTime.toLocaleTimeString('en-US', options)}`; // Date and time in 12-hour format
      rightSection.appendChild(dateTime12Element);

      // Append sections to the user's timezone box
      userTimezoneBox.appendChild(leftSection);
      userTimezoneBox.appendChild(rightSection);

      // Append the user's timezone box to the root
      timeRoot.appendChild(userTimezoneBox);
    }
  };

  const clearTimeRoot = () => {
    while (timeRoot && timeRoot.firstChild) {
      timeRoot.removeChild(timeRoot.firstChild);
    }
  }

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const displaySavedTimezones = () => {
    clearTimeRoot();
    showUserTimezone();
    const savedTimezones = JSON.parse(localStorage.getItem("selectedTimezones")) || [];
    savedTimezones.forEach(({ location, abbreviation, offset }) => {
      let localTime = new Date(date.getTime() + offset * 3600 * 1000);

      // Create a container for the timezone box
      let timezoneBox = document.createElement("div");
      timezoneBox.style.display = "flex";
      timezoneBox.style.marginBottom = "10px";
      timezoneBox.style.padding = "10px";
      timezoneBox.style.background = "#f9f9f9";
      timezoneBox.style.borderRadius = "5px";
      timezoneBox.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";

      // Create the left section (50%)
      let leftSection = document.createElement("div");
      leftSection.style.flex = "1";
      leftSection.style.display = "flex";
      leftSection.style.flexDirection = "column";
      leftSection.style.justifyContent = "space-between";
      leftSection.style.paddingRight = "10px";

      // Add location (bolded) to the top half with ellipsis and tooltip
      let locationElement = document.createElement("div");
      locationElement.textContent = location;
      locationElement.style.fontWeight = "450";
      locationElement.style.marginBottom = "5px";
      locationElement.style.whiteSpace = "nowrap";
      locationElement.style.overflow = "hidden";
      locationElement.style.textOverflow = "ellipsis";
      locationElement.style.maxWidth = "200px"; // Explicitly set max width
      locationElement.title = location; // Tooltip
      leftSection.appendChild(locationElement);

      // Add abbreviation (greyed out) to the bottom half
      let abbreviationElement = document.createElement("div");
      abbreviationElement.textContent = abbreviation;
      abbreviationElement.style.color = "#6c757d";
      leftSection.appendChild(abbreviationElement);

      // Create the right section (50%)
      let rightSection = document.createElement("div");
      rightSection.style.flex = "1";
      rightSection.style.display = "flex";
      rightSection.style.flexDirection = "column";
      rightSection.style.justifyContent = "space-between";

      // Add date and time in 24-hour format to the top half
      let dateTime24Element = document.createElement("div");
      dateTime24Element.textContent = `${formatDate(localTime)} ${localTime.toISOString().slice(11, 19)}`; // Date and time in 24-hour format
      dateTime24Element.style.marginBottom = "5px";
      rightSection.appendChild(dateTime24Element);

      // Add date and time in 12-hour format to the bottom half
      let dateTime12Element = document.createElement("div");
      const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
      dateTime12Element.textContent = `${formatDate(localTime)} ${localTime.toLocaleTimeString('en-US', options)}`; // Date and time in 12-hour format
      rightSection.appendChild(dateTime12Element);

      // Append sections to the timezone box
      timezoneBox.appendChild(leftSection);
      timezoneBox.appendChild(rightSection);

      // Append the timezone box to the root
      timeRoot.appendChild(timezoneBox);
    });
  };
  displaySavedTimezones();

  let addTimezoneButton = document.createElement("button");
  addTimezoneButton.textContent = timezoneButtonText;
  addTimezoneButton.style.marginTop = "10px";
  addTimezoneButton.style.padding = "8px 12px";
  addTimezoneButton.style.border = "none";
  addTimezoneButton.style.borderRadius = "5px";
  addTimezoneButton.style.background = "#007BFF";
  addTimezoneButton.style.color = "#ffffff";
  addTimezoneButton.style.cursor = "pointer";
  addTimezoneButton.style.transition = "background 0.3s ease";
  addTimezoneButton.onmouseover = () => addTimezoneButton.style.background = "#0056b3";
  addTimezoneButton.onmouseout = () => addTimezoneButton.style.background = "#007BFF";
  popup.appendChild(addTimezoneButton);

  let dropdown = document.createElement("div");
  dropdown.style.display = "none";
  dropdown.style.border = "1px solid #ddd";
  dropdown.style.padding = "10px";
  dropdown.style.marginTop = "10px";
  dropdown.style.background = "#f9f9f9";
  dropdown.style.maxHeight = "200px";
  dropdown.style.overflowY = "auto";
  dropdown.style.borderRadius = "5px";
  dropdown.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";

  timezones.forEach(({ location, abbreviation, offset }) => {
    let checkboxContainer = document.createElement("div");
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = JSON.stringify({ location, abbreviation, offset });
    checkbox.checked = savedTimezones.some(tz => tz.abbreviation === abbreviation);

    let label = document.createElement("label");
    label.textContent = `${location} (${abbreviation})`;
    label.style.marginLeft = "5px";

    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(label);
    dropdown.appendChild(checkboxContainer);
  });

  popup.appendChild(dropdown);

  addTimezoneButton.onclick = () => {
    if (dropdown.style.display === "none") {
      dropdown.style.display = "block";
      addTimezoneButton.textContent = "Close";
    } else {
      addTimezoneButton.textContent = timezoneButtonText;
      dropdown.style.display = "none";
    }
  };

  let saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.style.marginTop = "10px";
  saveButton.style.padding = "8px 12px";
  saveButton.style.border = "none";
  saveButton.style.borderRadius = "5px";
  saveButton.style.background = "#28a745";
  saveButton.style.color = "#ffffff";
  saveButton.style.cursor = "pointer";
  saveButton.style.transition = "background 0.3s ease";
  saveButton.onmouseover = () => saveButton.style.background = "#218838";
  saveButton.onmouseout = () => saveButton.style.background = "#28a745";
  dropdown.appendChild(saveButton);

  saveButton.onclick = () => {
    const selectedTimezones = Array.from(dropdown.querySelectorAll("input[type='checkbox']:checked")).map(checkbox => JSON.parse(checkbox.value));
    localStorage.setItem("selectedTimezones", JSON.stringify(selectedTimezones));

    addTimezoneButton.textContent = timezoneButtonText;
    dropdown.style.display = "none";
    displaySavedTimezones();
  };

  document.body.appendChild(popup);

  document.addEventListener("click", () => {
    popup.style.opacity = "0";
    popup.style.transform = "translateY(-10px)";
    setTimeout(() => popup.remove(), 300);
  }, { once: true });
}
