document.addEventListener('DOMContentLoaded', function() {
  // Parse the URL query parameters for customer number and name
  const params = new URLSearchParams(window.location.search);
  const customerNumber = params.get('number');
  const customerName = params.get('name');

  // Update the welcome message with the customer's name
  if (customerName) {
    document.getElementById('welcomeMessage').textContent += ` ${customerName}!`;
  }

  // Attach click event listeners to each month button
  document.querySelectorAll('.month-button').forEach(button => {
    button.addEventListener('click', function() {
      const monthName = button.textContent.trim();
      const month = new Date(Date.parse(monthName + " 1, 2021")).getMonth() + 1;
      fetchAndDisplayData(month < 10 ? '0' + month : month.toString());
    });
  });

  // Function to fetch and display data based on the selected month
  function fetchAndDisplayData(selectedMonth) {
    fetch('https://raw.githubusercontent.com/GpBrenden/ToteTracking/main/WebView.csv')
      .then(response => response.text())
      .then(csvText => {
        const allRows = csvText.trim().split('\n');
        const headers = allRows.shift().split(',');
        let tableHTML = '<table id="dataDisplayTable"><thead><tr>';

        headers.forEach(header => {
          tableHTML += `<th>${header}</th>`;
        });
        tableHTML += '</tr></thead><tbody>';

        let totalQuantity = 0;

        // Filter rows and create table rows
        allRows.forEach(row => {
          const columns = row.split(',');
          const date = formatDate(columns[headers.indexOf('Date')]);
          const month = date.split('/')[0];
          const who = columns[headers.indexOf('Who?')];

          // Only include rows that match the customer number and the selected month
          // and the 'Who?' field is either 'LOADG' or 'SAMSAR'
          if (columns[headers.indexOf('Customer Number')] === customerNumber &&
              month === selectedMonth/* &&
              (who === 'LOADG' || Who? === 'SAMSAR')*/) {
            tableHTML += '<tr>';
            columns.forEach(column => {
              tableHTML += `<td>${column}</td>`;
            });
            tableHTML += '</tr>';

            // Add to the total quantity
            totalQuantity += parseInt(columns[headers.indexOf('Quantity')], 10);
          }
        });

        tableHTML += '</tbody>';

        // Add a footer row with the total quantity
        tableHTML += `<tfoot><tr><td colspan="${headers.length - 1}">Total Quantity</td><td>${totalQuantity}</td></tr></tfoot>`;
        tableHTML += '</table>';

        // Display the table in the 'dataDisplay' div
        document.getElementById('dataDisplay').innerHTML = tableHTML;
      })
      .catch(error => {
        console.error('Fetch Error:', error);
        alert('There was an error fetching the transaction data.');
      });
  }

  // Function to format the CSV date
  function formatDate(csvDate) {
    if (!csvDate || csvDate.length < 7) return 'Invalid Date';
    const year = '20' + csvDate.substr(1, 2);
    const month = csvDate.substr(3, 2);
    const day = csvDate.substr(5, 2);
    return `${month}/${day}/${year}`;
  }

});
