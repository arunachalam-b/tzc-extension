document.addEventListener("DOMContentLoaded", () => {
  const timezonesContainer = document.getElementById("timezones");
  const userTimezoneOffset = -new Date().getTimezoneOffset() / 60;

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

  const createTimezoneBox = (location, abbreviation, localTime, isUserTimezone = false) => {
    const timezoneBox = document.createElement("div");
    timezoneBox.className = `timezone-box ${isUserTimezone ? "user-timezone" : ""}`;

    const locationElement = document.createElement("div");
    locationElement.textContent = `${location} (${abbreviation})`;

    const timeElement = document.createElement("div");
    timeElement.textContent = localTime.toISOString().slice(0, 19).replace("T", " ");

    timezoneBox.appendChild(locationElement);
    timezoneBox.appendChild(timeElement);

    return timezoneBox;
  };

  const showUserTimezone = () => {
    const userTimezone = timezones.find(tz => tz.offset === userTimezoneOffset);
    if (userTimezone) {
      const localTime = new Date(new Date().getTime() + userTimezone.offset * 3600 * 1000);
      const userTimezoneBox = createTimezoneBox(userTimezone.location, userTimezone.abbreviation, localTime, true);
      timezonesContainer.appendChild(userTimezoneBox);
    }
  };

  showUserTimezone();
});
