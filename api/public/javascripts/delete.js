const confirmDelete = (coffeeId) => {
  const shouldDelete = confirm('Apakah anda yakin');

  if(shouldDelete) {
    deleteCoffee(coffeeId);
  }
}

const deleteCoffee = async (coffeeId) => {
  await fetch(`/delete?id=${coffeeId}`, {
    method: 'DELETE',
  })
    .then(response => {
      console.log(response);
      if(response.ok) {
        alert('data berhasil dihapus');
        window.location.href = '/';
      }
    })
}