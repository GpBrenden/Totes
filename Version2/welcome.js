document.addEventListener('DOMContentLoaded', function() {
function fetchAndDisplayData(month) {
    fetch('https://raw.githubusercontent.com/GpBrenden/ToteTracking/main/WebView.csv')
      .then(response => response.text())
      .then(csvText => {
        const rows = csvText.split('\n');
        const headers = rows.shift().split(',');
        const dateIndex = headers.indexOf('Date');
        let html = '<table><tr>';
  
        // Add table headers
        for (const header of headers) {
          html += `<th>${header}</th>`;
        }
        html += '</tr>';
  
        // Filter and add data rows
        for (const row of rows) {
          const columns = row.split(',');
          const date = formatDate(columns[dateIndex]);
          const rowMonth = date.split('/')[0];
  
          if (rowMonth === month) {
            html += '<tr>';
            for (let i = 0; i < columns.length; i++) {
              if (i === dateIndex) {
                html += `<td>${date}</td>`;
              } else {
                html += `<td>${columns[i]}</td>`;
              }
            }
            html += '</tr>';
          }
        }
  
        html += '</table>';
        document.getElementById('dataDisplay').innerHTML = html;
      })
      .catch(error => console.error('Error:', error));
  }
  
  function formatDate(csvDate) {
    const year = '20' + csvDate.substr(1, 2);
    const month = csvDate.substr(3, 2);
    const day = csvDate.substr(5, 2);
    return `${month}/${day}/${year}`;
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.month-button');
    buttons.forEach(button => {
      button.addEventListener('click', function() {
        const month = button.textContent.trim().slice(0, 2);
        fetchAndDisplayData(month);
      });
    });
  });
});