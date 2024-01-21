let customerName; // Declare customerName variable at the top of your script

// An array to keep track of processed customer names
const processedCustomerNames = [];

// Function to check for similar customer names and populate the navigation dropdown
function checkForSimilarCustomerNames(customerName, allRows) {
  // Clear previous customer options
  const customerDropdown = document.getElementById('customerDropdown');
  customerDropdown.innerHTML = '<option value="" disabled selected>Similar Customers</option>';

  // Get the first six characters of the current customer name for comparison
  const currentNamePrefix = customerName.substring(0, 6).toLowerCase();

  // Use a Set to track unique customer names
  const uniqueCustomerNames = new Set();

  // Extract customer names and numbers from all rows
  allRows.forEach(row => {
    const columns = row.split(',');
    const name = columns[2]; // Assuming 'Customer Name' is the third column
    const number = columns[1]; // Assuming 'Customer Number' is the second column

    // Check if the name starts with the same six characters and isn't already in the set
    if (name.toLowerCase().startsWith(currentNamePrefix) && !uniqueCustomerNames.has(name.toLowerCase())) {
      uniqueCustomerNames.add(name.toLowerCase());

      // Add the customer to the dropdown if it's not the current customer
      if (name.toLowerCase() !== customerName.toLowerCase()) {
        const optionElement = document.createElement('option');
        optionElement.value = number;
        optionElement.textContent = `Navigate to ${name}`;
        customerDropdown.appendChild(optionElement);
      }
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
function fetchAndDisplayData(selectedMonth, customerNumber) {
  fetch('https://raw.githubusercontent.com/GpBrenden/ToteTracking/main/WebView.csv')
    .then(response => response.text())
    .then(csvText => {
      const allRows = csvText.trim().split('\n');
      const headers = allRows.shift().split(',');

      // Find the indices of the columns you want to display
      const customerNameIndex = headers.indexOf('Customer Name');
      const dateIndex = headers.indexOf('Date');
      const quantityIndex = headers.indexOf('Quantity');

      let tableHTML = '<table id="dataDisplayTable"><thead><tr>';
      tableHTML += `<th>${headers[customerNameIndex]}</th>`;
      tableHTML += `<th>${headers[dateIndex]}</th>`;
      tableHTML += `<th>${headers[quantityIndex]}</th>`;
      tableHTML += '</tr></thead><tbody>';

      let totalQuantity = 0;

      // Filter rows and create table rows
      allRows.forEach(row => {
        const columns = row.split(',');
        const customerNumberCell = columns[1]; // Assuming 'Customer Number' is the second column

        if (customerNumberCell === customerNumber) {
          tableHTML += '<tr>';
          tableHTML += `<td>${columns[customerNameIndex]}</td>`;
          tableHTML += `<td>${formatDate(columns[dateIndex])}</td>`;
          tableHTML += `<td>${columns[quantityIndex]}</td>`;
          tableHTML += '</tr>';

          // Add to the total quantity
          totalQuantity += parseInt(columns[quantityIndex], 10);
        }
      });

      tableHTML += '</tbody>';
      // Add a footer row with the total quantity
      tableHTML += `<tfoot><tr><td colspan="2">Total Quantity</td><td>${totalQuantity}</td></tr></tfoot>`;
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
  
  // Get the dropdown elements
  const monthDropdown = document.getElementById('monthDropdown');
  const customerDropdown = document.getElementById('customerDropdown');

  // Attach a change event listener to the month dropdown
  monthDropdown.addEventListener('change', function() {
    // Get the selected month value from the dropdown
    const selectedMonth = this.value;

    // Parse the URL query parameters for customer number
    const params = new URLSearchParams(window.location.search);
    const customerNumber = params.get('number');

    // Call fetchAndDisplayData with the selected month and customerNumber
    fetchAndDisplayData(selectedMonth, customerNumber);
  });

  // Attach an event listener to the customer dropdown for the 'change' event
  customerDropdown.addEventListener('change', function() {
    const selectedCustomerNumber = this.value;
    // Update the URL with the new customer number and reload the page, or call the relevant function to update the page content
    navigateToCustomer(selectedCustomerNumber);
  });
    // Update the contact link with query parameters
    const queryParams = new URLSearchParams(window.location.search);
    const customerNumber = queryParams.get('number');
    const customerName = queryParams.get('name');
  
    const contactLink = document.getElementById('contactUsLink');
    let newHref = 'contact.html';
    if (customerNumber && customerName) {
        newHref += `?number=${encodeURIComponent(customerNumber)}&name=${encodeURIComponent(customerName)}`;
    }
    contactLink.href = newHref;
});