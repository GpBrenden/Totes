document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');

  form.addEventListener('submit', function(event) {
      event.preventDefault();

      // Extract customer number and name from the URL parameters
      const params = new URLSearchParams(window.location.search);
      const customerNumber = params.get('number') || 'N/A';
      const customerName = params.get('name') || 'N/A';

      // Append additional custom fields as hidden inputs
      addHiddenInput(this, 'customerNumber', customerNumber);
      addHiddenInput(this, 'customerName', customerName);

      // Submit the form
      fetch('/', {
          method: 'POST',
          body: new FormData(this),
      })
      .then(() => {
          // Show submission confirmation
          alert('Thank you for your submission!');
          // Redirect after a short delay
          setTimeout(() => {
              window.history.back();
          }, 2000); // 2000 milliseconds = 2 seconds
      })
      .catch((error) => {
          console.error('Error:', error);
          alert('There was a problem submitting your form. Please try again.');
      });
  });
});

function addHiddenInput(form, name, value) {
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = name;
  input.value = value;
  form.appendChild(input);
}
