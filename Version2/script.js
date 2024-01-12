document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent the form from submitting the traditional way
      const customerNumber = document.getElementById('customerNumber').value.trim();
  
      fetch('https://raw.githubusercontent.com/GpBrenden/ToteTracking/main/WebView.csv')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok'); // This will handle HTTP error statuses
          }
          return response.text();
        })
        .then(csvText => {
          let found = false;
          const rows = csvText.split('\n');
          rows.shift(); // Skip headers
  
          for (const row of rows) {
            const columns = row.split(',');
            // Assuming customer number is in the second column (index 1)
            if (columns[1] === customerNumber) {
              found = true;
              const customerName = columns[2]; // Assuming customer name is in the third column (index 2)
              window.location.href = `welcome.html?name=${encodeURIComponent(customerName)}`;
              break; // Stop the loop once we find the customer
            }
          }
  
          if (!found) {
            alert('Customer number not found.'); // Alert if no customer number match
          }
        })
        .catch(error => {
          // Handle network errors or other fetch issues
          console.error('Fetch error:', error);
          alert('There was a problem retrieving the data. Please try again later.');
        });
    });
  });