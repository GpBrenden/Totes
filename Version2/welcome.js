document.addEventListener('DOMContentLoaded', function() {
  // Parse the URL query parameters
  const params = new URLSearchParams(window.location.search);
  const customerNumber = params.get('number');
  const customerName = params.get('name');

  // Set the welcome message
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

  function fetchAndDisplayData(month) {
    fetch('https://raw.githubusercontent.com/GpBrenden/ToteTracking/main/WebView.csv')
      .then(response => response.text())
      .then(csvText => {
        const allRows = csvText.trim().split('\n');
        const headers = allRows.shift().split(',');
        const dateIndex = headers.indexOf('Date');
        let tableHTML = '<table><tr>';

        // Create table headers
        headers.forEach(header => {
          tableHTML += `<th>${header}</th>`;
        });
        tableHTML += '</tr>';

        // Filter rows and create table rows
        allRows.forEach(row => {
          const columns = row.split(',');
          const csvDate = columns[dateIndex];
          const formattedDate = formatDate(csvDate);
          const rowMonth = formattedDate.split('/')[0];

          if (columns[headers.indexOf('Customer Number')] === customerNumber && rowMonth === month) {
            tableHTML += '<tr>';
            columns.forEach((column, index) => {
              tableHTML += `<td>${index === dateIndex ? formattedDate : column}</td>`;
            });
            tableHTML += '</tr>';
          }
        });

        tableHTML += '</table>';
        document.getElementById('dataDisplay').innerHTML = tableHTML;
      })
      .catch(error => {
        console.error('Fetch Error:', error);
        alert('There was an error fetching the transaction data.');
      });
  }

  function formatDate(csvDate) {
    if (!csvDate || csvDate.length < 7) return 'Invalid Date';
    const year = '20' + csvDate.substr(1, 2);
    const month = csvDate.substr(3, 2);
    const day = csvDate.substr(5, 2);
    return `${month}/${day}/${year}`;
  }
});
