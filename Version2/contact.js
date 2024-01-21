document.addEventListener('DOMContentLoaded', function() {
  // Set values for hidden fields
  document.getElementById('customerNumberField').value = getParameterByName('number');
  document.getElementById('customerNameField').value = getParameterByName('name');
});

function getParameterByName(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name) || 'N/A';
}
