const date = new Date();

// Get Sri Lankan date and time
const FormattedDateTime = date.toLocaleString("en-LK", { timeZone: "Asia/Colombo" });
//console.log("Sri Lankan Date & Time:", FormattedDateTime);

// Get only the Sri Lankan date
const FormattedDate = date.toLocaleDateString("en-LK", { timeZone: "Asia/Colombo" });
//console.log("Sri Lankan Date:", FormattedDate); 

// Convert the formatted string back to a Date object
const parsedDate = new Date(FormattedDateTime);

// Extract year, month, day, and time ...
const year = parsedDate.getFullYear();
const month = parsedDate.getMonth() + 1; // Months are 0-based
const day = parsedDate.getDate();
const hours = parsedDate.getHours();
const minutes = parsedDate.getMinutes();
const seconds = parsedDate.getSeconds();

const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

module.exports = { FormattedDateTime, FormattedDate, formattedDate };
