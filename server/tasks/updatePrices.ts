export default defineTask({
  meta: {
    name: 'updatePrices',
    description: 'Update prices for restaurants',
  },
  async run() {
    console.log('Updating prices');
    await updateRestaurantPrices();
    return {result: 'Successfully updated prices'}
  }
})

