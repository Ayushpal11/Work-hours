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

// Sets to keep track of unique employees for each analysis
const employeesFor7ConsecutiveDays = new Set();
const employeesForLessThan10HoursBetweenShifts = new Set();
const employeesForMoreThan14HoursInSingleShift = new Set();

// Read the CSV file and analyze the data
fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
        const employeeName = row['Employee Name'];
        const positionID = row['Position ID'];

        // Perform analysis for 7 consecutive days
        const currentDate = new Date(row['Pay Cycle End Date']);
        currentDate.setDate(currentDate.getDate() + 1);
        const last7Days = new Date(currentDate);
        last7Days.setDate(currentDate.getDate() - 6);
        const rowDate = new Date(row['Pay Cycle End Date']);

        if (rowDate >= last7Days && rowDate <= currentDate) {
            employeesFor7ConsecutiveDays.add(`${employeeName}-${positionID}`);
        }

        // Perform analysis for less than 10 hours between shifts
        const timeOut = new Date(row['Time Out']);
        const timeIn = new Date(row['Time']);
        const timeDifference = getTimeDifference(timeIn.toLocaleTimeString(), timeOut.toLocaleTimeString());

        if (timeDifference > 60 && timeDifference < 600) {
            employeesForLessThan10HoursBetweenShifts.add(`${employeeName}-${positionID}`);
        }

        // Perform analysis for more than 14 hours in a single shift
        const shiftDuration = parseTimeToMinutes(row['Timecard Hours (as Time)']);
        if (shiftDuration > 840) {
            employeesForMoreThan14HoursInSingleShift.add(`${employeeName}-${positionID}`);
        }
    })
    .on('end', () => {
        // Analysis completed
        console.log('Employees who worked for 7 consecutive days:', [...employeesFor7ConsecutiveDays]);
        console.log('Employees with less than 10 hours between shifts:', [...employeesForLessThan10HoursBetweenShifts]);
        console.log('Employees who worked for more than 14 hours in a single shift:', [...employeesForMoreThan14HoursInSingleShift]);
    });