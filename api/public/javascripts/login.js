document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form')
  form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(form);
    const username = formData.get('username');
    const password = formData.get('password');
  
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        window.location.href = '/'; 
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Terjadi kesalahan saat login');
    }
  });
})