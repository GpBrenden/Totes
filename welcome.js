// JavaScript for Customer Data Interaction

// Function to sort table columns
function sortTableByColumn(table, columnIndex, isAscending) {
  const directionModifier = isAscending ? 1 : -1;
  const rows = Array.from(table.tBodies[0].rows);

  const sortedRows = rows.sort((a, b) => {
      const aColText = a.querySelector(`td:nth-child(${columnIndex + 1})`).textContent.trim();
      const bColText = b.querySelector(`td:nth-child(${columnIndex + 1})`).textContent.trim();

      return aColText.localeCompare(bColText, undefined, { numeric: true }) * directionModifier;
  });

  while (table.tBodies[0].firstChild) {
      table.tBodies[0].removeChild(table.tBodies[0].firstChild);
  }

  table.tBodies[0].append(...sortedRows);

  table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
  table.querySelector(`th:nth-child(${columnIndex + 1})`).classList.toggle("th-sort-asc", isAscending);
  table.querySelector(`th:nth-child(${columnIndex + 1})`).classList.toggle("th-sort-desc", !isAscending);
}

// Function to format the CSV date
function formatDate(csvDate) {
  if (!csvDate || csvDate.length < 7) return 'Invalid Date';
  const year = '20' + csvDate.substr(1, 2);
  const month = csvDate.substr(3, 2);
  const day = csvDate.substr(5, 2);
  return `${month}/${day}/${year}`;
}

// Function to check for similar customer names and populate the navigation dropdown
function checkForSimilarCustomerNames(customerName, allRows) {
  const customerDropdown = document.getElementById('customerDropdown');
  customerDropdown.innerHTML = '<option value="" disabled selected>Similar Customers</option>';

  const currentNamePrefix = customerName.substring(0, 6).toLowerCase();
  const uniqueCustomerNames = new Set();

  allRows.forEach(row => {
      const columns = row.split(',');
      const name = columns[2];
      const number = columns[1];

      if (name.toLowerCase().startsWith(currentNamePrefix) && !uniqueCustomerNames.has(name.toLowerCase())) {
          uniqueCustomerNames.add(name.toLowerCase());

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
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.set('number', newCustomerNumber);
  window.location.href = newUrl.toString();
}

// Function to fetch and display data based on the selected month
function fetchAndDisplayData(selectedMonth, customerNumber) {
  fetch('/.netlify/functions/fetchCSV')
      .then(response => response.text())
      .then(csvText => {
          const allRows = csvText.trim().split('\n');
          const headers = allRows.shift().split(',');

          const customerNameIndex = headers.indexOf('Customer Name');
          const dateIndex = headers.indexOf('Date');
          const quantityIndex = headers.indexOf('Quantity');

          let tableHTML = '<table id="dataDisplayTable"><thead><tr>';
          tableHTML += `<th onclick="sortTableByColumn(document.getElementById('dataDisplayTable'), ${dateIndex}, true)">${headers[dateIndex]}</th>`;
          tableHTML += `<th onclick="sortTableByColumn(document.getElementById('dataDisplayTable'), ${quantityIndex}, true)">${headers[quantityIndex]}</th>`;
          tableHTML += '</tr></thead><tbody>';

          let totalQuantity = 0;

          allRows.forEach(row => {
              const columns = row.split(',');
              const customerNumberCell = columns[1];

              if (customerNumberCell === customerNumber) {
                  tableHTML += '<tr>';
                  tableHTML += `<td>${formatDate(columns[dateIndex])}</td>`;
                  tableHTML += `<td>${columns[quantityIndex]}</td>`;
                  tableHTML += '</tr>';

                  totalQuantity += parseInt(columns[quantityIndex], 10);
              }
          });

          tableHTML += '</tbody>';
          tableHTML += `<tfoot><tr><td colspan="2">Total Quantity</td><td>${totalQuantity}</td></tr></tfoot>`;
          tableHTML += '</table>';

          document.getElementById('dataDisplay').innerHTML = tableHTML;
      })
      .catch(error => {
          console.error('Fetch Error:', error);
          alert('There was an error fetching the transaction data.');
      });
}

// Function to initialize the page
function initializePage() {
  const params = new URLSearchParams(window.location.search);
  const customerNumber = params.get('number');
  let customerName = params.get('name');

  fetch('/.netlify/functions/fetchCSV')
      .then(response => response.text())
      .then(csvText => {
          const allRows = csvText.trim().split('\n').slice(1);

          allRows.forEach(row => {
              const columns = row.split(',');
              if (columns[1] === customerNumber) {
                  customerName = columns[2];
              }
          });

          if (customerName) {
              document.getElementById('welcomeMessage').textContent = `Welcome ${customerName}!`;
          }

          checkForSimilarCustomerNames(customerName, allRows);
      })
      .catch(error => {
          console.error('Fetch Error:', error);
          alert('There was an error fetching the transaction data.');
      });
}

document.addEventListener('DOMContentLoaded', function() {
  initializePage();

  const monthDropdown = document.getElementById('monthDropdown');
  const customerDropdown = document.getElementById('customerDropdown');

  monthDropdown.addEventListener('change', function() {
      const selectedMonth = this.value;
      const params = new URLSearchParams(window.location.search);
      const customerNumber = params.get('number');
      fetchAndDisplayData(selectedMonth, customerNumber);
  });

  customerDropdown.addEventListener('change', function() {
      const selectedCustomerNumber = this.value;
      navigateToCustomer(selectedCustomerNumber);
  });

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
