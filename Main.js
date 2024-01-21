const fs = require('fs');
const csv = require('csv-parser');

const filePath = 'Assignment_Timecard.xlsx - Sheet1.csv';

// Function to parse the time in HH:mm format and convert it to minutes
const parseTimeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

// Function to calculate the time difference in minutes between two time strings
const getTimeDifference = (startTime, endTime) => {
    const startMinutes = parseTimeToMinutes(startTime);
    const endMinutes = parseTimeToMinutes(endTime);
    return endMinutes - startMinutes;
};

// Read the CSV file and analyze the data
fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
        // Perform analysis for 7 consecutive days
        // Assuming 'Pay Cycle End Date' is in 'MM/DD/YYYY' format
        const currentDate = new Date(row['Pay Cycle End Date']);
        currentDate.setDate(currentDate.getDate() + 1); // Increment by one to consider the current date

        const last7Days = new Date(currentDate);
        last7Days.setDate(currentDate.getDate() - 6);

        const rowDate = new Date(row['Pay Cycle End Date']);

        if (rowDate >= last7Days && rowDate <= currentDate) {
            console.log(`Employee worked for 7 consecutive days - Employee: ${row['Employee Name']}, Position: ${row['Position ID']}`);
        }

        // Perform analysis for less than 10 hours between shifts but greater than 1 hour
        // Assuming 'Time Out' and 'Time' are in 'MM/DD/YYYY hh:mm A' format
        const timeOut = new Date(row['Time Out']);
        const timeIn = new Date(row['Time']);

        const timeDifference = getTimeDifference(timeIn.toLocaleTimeString(), timeOut.toLocaleTimeString());

        if (timeDifference > 60 && timeDifference < 600) {
            console.log(`Employee has less than 10 hours between shifts but greater than 1 hour - Employee: ${row['Employee Name']}, Position: ${row['Position ID']}`);
        }

        // Perform analysis for more than 14 hours in a single shift
        const shiftDuration = parseTimeToMinutes(row['Timecard Hours (as Time)']);

        if (shiftDuration > 840) {
            console.log(`Employee worked for more than 14 hours in a single shift - Employee: ${row['Employee Name']}, Position: ${row['Position ID']}`);
        }
    })
    .on('end', () => {
        // Analysis completed
    });
