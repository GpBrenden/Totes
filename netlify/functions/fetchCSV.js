const fetch = require('node-fetch');
require('dotenv').config();

exports.handler = async function(event, context) {
    const url = 'https://raw.githubusercontent.com/GpBrenden/ToteTracking/main/WebView.csv';
    const customerNumber = event.queryStringParameters.number;

    console.log("Received customer number:", customerNumber);

    if (!customerNumber) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Customer number is required" })
        };
    }

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `token ${process.env.GITHUB_TOKEN}`
            }
        });

        if (!response.ok) {
            console.error("Failed to fetch CSV:", response.statusText);
            return {
                statusCode: response.status,
                body: response.statusText
            };
        }

        const data = await response.text();
        console.log("Fetched CSV data");
        const filteredData = filterCSVData(data, customerNumber);

        console.log("Filtered Data:", filteredData);

        return {
            statusCode: 200,
            body: JSON.stringify(filteredData)
        };

    } catch (error) {
        console.error("Error fetching CSV data:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.toString() })
        };
    }
};

function filterCSVData(csvText, customerNumber) {
    const rows = csvText.split('\n');
    const headers = rows[0].split(',');

    const records = rows.slice(1).filter(row => row.trim() !== "").map(row => {
        const values = row.split(',');
        let record = {};
        headers.forEach((header, index) => {
            record[header.trim()] = values[index] ? values[index].trim() : ''; // Handle undefined values
        });
        return record;
    });

    console.log("All records:", records);

    const filteredRecords = records.filter(record => {
        console.log(`Comparing ${record['Customer Number']} with ${customerNumber}`);
        return record['Customer Number'] === customerNumber;
    });
    console.log("Filtered records for customer number:", customerNumber, filteredRecords);
    return filteredRecords;
}
