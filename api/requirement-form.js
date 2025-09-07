// api/requirement-form.js

// Get query param from URL
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name) || '';
}

// Populate readonly fields
document.getElementById('projcode').value = getQueryParam('projcode');
document.getElementById('desig').value = getQueryParam('desig');

// Form submission handler
document.getElementById('requirementForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const projcode = document.getElementById('projcode').value;
  const desig = document.getElementById('desig').value;
  const count = document.getElementById('count').value;
  const startdate = document.getElementById('startdate').value;
  const enddate = document.getElementById('enddate').value;

  try {
    const response = await fetch('/api/create-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        projcode,
        desig,
        count,
        startdate,
        enddate
      })
    });

    const result = await response.json();

    if (response.ok) {
      alert('Request submitted successfully!');
      document.getElementById('requirementForm').reset();
    } else {
      console.error('API error:', result);
      alert('Failed to submit request. Check console for details.');
    }

  } catch (err) {
    console.error('Fetch error:', err);
    alert('Error submitting the form.');
  }
});
