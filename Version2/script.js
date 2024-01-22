document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('loginForm');
  form.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent the form from submitting the traditional way
      const customerNumber = document.getElementById('customerNumber').value.trim();

      // Fetching data from the Netlify Function instead of directly from GitHub
      fetch('/.netlify/functions/fetchCSV')
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.text();
      })
      .then(csvText => {
          let found = false;
          const rows = csvText.split('\n');
          rows.shift(); // Skip headers

          for (const row of rows) {
              const columns = row.split(',');
              if (columns[1] === customerNumber) {
                  found = true;
                  const customerName = columns[2];
                  window.location.href = `welcome.html?number=${encodeURIComponent(customerNumber)}&name=${encodeURIComponent(customerName)}`;
                  break;
              }
          }

          if (!found) {
              alert('Customer number not found.');
          }
      })
      .catch(error => {
          console.error('Fetch error:', error);
          alert('There was a problem retrieving the data. Please try again later.');
      });
  });
});
