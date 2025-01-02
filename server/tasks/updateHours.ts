export default defineTask({
  meta: {
    name: 'updateHours',
    description: 'Update opening hours for restaurants',
  },
  async run() {
    console.log('Updating non-normal opening hours');
    const restaurants = await getMenus({});
    await Promise.all(restaurants.filter(r => r.openingHours?.length).map(updateOpeningHours));
    return {result: 'Successfully updated non-normal opening hours'}
  }
})

// Run on server start
if(!process.dev) runTask('updateHours').then(console.log).catch(console.error);
