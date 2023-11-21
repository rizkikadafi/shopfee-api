document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(form);

    const response = await fetch('/insert', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if(data.success) {
      alert(data.message);
      window.location.href = '/';
    } else {
      alert(data.message);
    }
  });
});