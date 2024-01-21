# Work Hours Analysis

This script analyzes work hours data from a CSV file and prints information about employees based on certain conditions.

## Requirements

- Node.js installed on your machine
- 'csv-parser' module installed (install using `npm install csv-parser`)

## Usage

1. Clone the repository to your local machine:

```bash
git clone <repository-url>
Navigate to the project directory:
bash
Copy code
cd Work-Hours-Analysis
Install dependencies:
bash
Copy code
npm install
Run the script:
bash
Copy code
node Main.js
Make sure to replace <repository-url> with the actual URL if you are using version control.

Script Overview
Main.js: The main script file that reads the CSV file and performs employee work hours analysis.
CSV File Structure
Ensure that your CSV file has the following columns:

Position ID
Position Status
Time
Time Out
Timecard Hours (as Time)
Pay Cycle Start Date
Pay Cycle End Date
Employee Name
File Number
Analysis Conditions
Employees who have worked for 7 consecutive days.
Employees who have less than 10 hours of time between shifts but greater than 1 hour.
Employees who have worked for more than 14 hours in a single shift.
Example Output
The script will print information about employees who meet the specified conditions in the console.

License
This project is licensed under the MIT License - see the LICENSE file for details.
