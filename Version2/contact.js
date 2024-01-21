document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', function(event) {
      event.preventDefault();

      // Extract customer number and name from the URL parameters
      const params = new URLSearchParams(window.location.search);
      const customerNumber = params.get('number') || 'N/A';
      const customerName = params.get('name') || 'N/A';

      // Prepare the formData
      const formData = {
          name: document.getElementById('contactName').value.trim(),
          email: document.getElementById('contactEmail').value.trim(),
          message: document.getElementById('contactMessage').value.trim(),
          customerNumber: customerNumber,
          customerName: customerName
      };

      // Replace 'YOUR_POWER_AUTOMATE_CONNECTOR_URL' with your actual connector URL
      fetch('https://prod-147.westus.logic.azure.com:443/workflows/f9fb63ca70144d6c85eab70d3e2e0de5/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=rJb6FkwAg3zrINujRzzwG3dYwhxUWg1HqDMObD2Ypx4', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
      })
      .then(response => {
          if (!response.ok) {
              // Log the response status and status text
              console.error(`HTTP Error Response: ${response.status} ${response.statusText}`);
              return response.text().then(text => { throw new Error(text) }); // Throw the response body as an error message
          }
          return response.text();
      })
      .then(data => {
          // Handle the successful submission here
          alert('Message sent successfully!');
          setTimeout(() => {
              window.history.back();
          }, 1000); // 1000 milliseconds = 2 seconds
      })
      .catch(error => {
          console.error('Fetch Error:', error);
          alert('There was a problem sending your message. Check the console for more details.');
      });
  });
});
