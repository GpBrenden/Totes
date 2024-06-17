function initializeTotes() {
    const customerNumber = new URLSearchParams(window.location.search).get('number');

    fetchInitialData(customerNumber);

    async function fetchInitialData(customerNumber) {
        try {
            const response = await fetch(`/.netlify/functions/fetchCSV?number=${encodeURIComponent(customerNumber)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const filteredRecords = await response.json();
            console.log("Filtered Records:", filteredRecords); // Log the filtered records

            // Populate table with initial filtered records
            populateTable(filteredRecords);
        } catch (error) {
            console.error('Fetch error:', error);
            alert('There was a problem retrieving the data. Please try again later.');
        }
    }

    function populateTable(records) {
        const tableBody = document.querySelector("#recordsTable tbody");
        tableBody.innerHTML = "";
        let totalBalance = 0;

        records.forEach(record => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${record.Date}</td>
                <td>${record['Customer Name']}</td>
                <td>${parseFloat(record.Quantity).toFixed(2)}</td>
            `;
            tableBody.appendChild(row);
            totalBalance += parseFloat(record.Quantity);
        });

        document.getElementById("totalBalance").innerText = totalBalance.toFixed(2);
    }
}

document.addEventListener('DOMContentLoaded', initializeTotes);
