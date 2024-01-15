let customerName; // Declare customerName variable at the top of your script

// Function to check for similar customer names and add navigation buttons
function checkForSimilarCustomerNames(customerName, allRows) {
  // Get the first six characters of the current customer name for comparison
  const currentNamePrefix = customerName.substring(0, 6).toLowerCase();

  // Extract customer names and numbers from all rows
  const customerInfo = allRows.map(row => {
    const columns = row.split(',');
    return {
      name: columns[2], // Assuming 'Customer Name' is the third column
      number: columns[1] // Assuming 'Customer Number' is the second column
    };
  });

  // Find customers with names that match the first six characters
  const matchingCustomers = customerInfo.filter(info => 
    info.name.substring(0, 6).toLowerCase() === currentNamePrefix
  );

  // Create navigation buttons for each matching customer
  matchingCustomers.forEach(match => {
    if (match.name.toLowerCase() !== customerName.toLowerCase()) {
      const navButton = document.createElement('button');
      navButton.textContent = `Navigate to ${match.name}`;
      navButton.onclick = () => navigateToCustomer(match.number);
      document.body.appendChild(navButton);
    }
  });
}

// Function to navigate to the given customer number
function navigateToCustomer(newCustomerNumber) {
  // Update the URL with the new customer number and reload the page
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.set('number', newCustomerNumber);
  window.location.href = newUrl.toString();
}

// Function to navigate to the given customer number
function navigateToCustomer(newCustomerNumber) {
  // Update the URL with the new customer number and reload the page
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.set('number', newCustomerNumber);
  window.location.href = newUrl.toString();
}
// Function to fetch and display data based on the selected month
function fetchAndDisplayData(selectedMonth, customerNumber, customerName) {
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

        if (columns[headers.indexOf('Customer Number')] === customerNumber &&
            month === selectedMonth) {
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

// Function to initialize the page
function initializePage() {
  // Parse the URL query parameters for customer number and name
  const params = new URLSearchParams(window.location.search);
  const customerNumber = params.get('number');
  let customerName = params.get('name');

  // Fetch the CSV data and then proceed with page initialization
  fetch('https://raw.githubusercontent.com/GpBrenden/ToteTracking/main/WebView.csv')
    .then(response => response.text())
    .then(csvText => {
      // Extract the rows as an array of strings
      const allRows = csvText.trim().split('\n').slice(1);

      // Find the current customer's full name from the CSV data
      allRows.forEach(row => {
        const columns = row.split(',');
        if (columns[1] === customerNumber) { // Assuming 'Customer Number' is the second column
          customerName = columns[2]; // Assuming 'Customer Name' is the third column
        }
      });

      // Update the welcome message with the customer's full name
      if (customerName) {
        document.getElementById('welcomeMessage').textContent = `Welcome ${customerName}!`;
      }

      // Call the function to check for similar customer names
      checkForSimilarCustomerNames(customerName, allRows);
    })
    .catch(error => {
      console.error('Fetch Error:', error);
      alert('There was an error fetching the transaction data.');
    });
}

document.addEventListener('DOMContentLoaded', function() {
  // Call the initializePage function to set up the page
  initializePage();  
  
  // Attach click event listeners to each month button
  document.querySelectorAll('.month-button').forEach(button => {
    button.addEventListener('click', function() {
      const monthName = button.textContent.trim();
      const month = new Date(Date.parse(monthName + " 1, 2021")).getMonth() + 1;
      
      // Parse the URL query parameters for customer number again
      const params = new URLSearchParams(window.location.search);
      const customerNumber = params.get('number');

      // Call fetchAndDisplayData with the month and customerNumber
      fetchAndDisplayData(month < 10 ? '0' + month : month.toString(), customerNumber, customerName);

    });
  });
});

