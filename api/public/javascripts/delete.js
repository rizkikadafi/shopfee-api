const confirmDelete = (coffeeId) => {
  const shouldDelete = confirm('Apakah anda yakin');

  if(shouldDelete) {
    deleteCoffee(coffeeId);
  }
}

const deleteCoffee = async (coffeeId) => {
  await fetch(`/delete?id=${coffeeId}`, {
    method: 'DELETE',
  });
}