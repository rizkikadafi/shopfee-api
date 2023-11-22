const confirmDelete = (coffeeId) => {
  const shouldDelete = confirm('Apakah anda yakin');

  if(shouldDelete) {
    deleteCoffee(coffeeId);
  }
}

const deleteCoffee = async (coffeeId) => {
  await fetch(`/delete?id=${coffeeId}`, {
    method: 'DELETE',
  }).then((response) => {
    if(response.status === 200) {
      window.location.href = '/';
    }
  });
}