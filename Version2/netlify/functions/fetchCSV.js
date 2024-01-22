const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const url = 'https://raw.githubusercontent.com/GpBrenden/ToteTracking/main/WebView.csv';

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `token ${process.env.GitHub}`
            }
        });

        if (!response.ok) {
            // Not successful
            return {
                statusCode: response.status,
                body: response.statusText
            };
        }

        const data = await response.text();
        return {
            statusCode: 200,
            body: data
        };

    } catch (error) {
        return { statusCode: 500, body: error.toString() };
    }
};
