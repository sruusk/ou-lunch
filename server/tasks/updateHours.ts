export default defineTask({
  meta: {
    name: 'updateHours',
    description: 'Update opening hours for restaurants',
  },
  async run() {
    console.log('Updating menus');
    updateOpeningHours({url: 'https://www.uniresta.fi/lipasto/', provider: Provider.uniresta});
    return {result: 'Success'}
  }
})
