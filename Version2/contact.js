document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');

  form.addEventListener('submit', function(event) {
      // Add additional data or perform validations here
      // But do not prevent the default form submission

      // Example: Add hidden inputs
      addHiddenInput(this, 'customerNumber', getParameterByName('number'));
      addHiddenInput(this, 'customerName', getParameterByName('name'));
  });
});

function addHiddenInput(form, name, value) {
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = name;
  input.value = value;
  form.appendChild(input);
}

function getParameterByName(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name) || 'N/A';
}
