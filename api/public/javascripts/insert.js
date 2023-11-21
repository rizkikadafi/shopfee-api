document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const name = formData.get('name');
    const description = formData.get('description');
    const rating = formData.get('rating');
    const small_price = formData.get('small_price');
    const medium_price = formData.get('medium_price');
    const large_price = formData.get('large_price');

    try {
      const response = await fetch('/insert', {
        method: 'POST',
        body: JSON.stringify({ 
          name, 
          description,
          rating,
          small_price,
          medium_price,
          large_price
        }),
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
});