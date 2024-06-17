const fetch = require('node-fetch');
require('dotenv').config();

exports.handler = async function(event, context) {
    const url = 'https://raw.githubusercontent.com/GpBrenden/ToteTracking/main/WebView.csv';

    const customerNumber = event.queryStringParameters.number; // Get the customer number from query parameters

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
            return {
                statusCode: response.status,
                body: response.statusText
            };
        }

        const data = await response.text();
        const filteredData = filterCSVData(data, customerNumber);

        return {
            statusCode: 200,
            body: JSON.stringify(filteredData)
        };

    } catch (error) {
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

    return records.filter(record => record['Customer Number'] === customerNumber);
}
