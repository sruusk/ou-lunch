import {updateOpeningHours} from "~/server/utils/openingHours";

export default defineTask({
  meta: {
    name: 'updateMenu',
    description: 'Update menus for restaurants',
  },
  async run() {
    console.log('Updating menus');
    await Promise.all([
      updateJamixRestaurants(),
      updatePowerestaRestaurants(),
      updateCompassRestaurants(),
      updateSodexoRestaurants()
    ]);
    updateOpeningHours({url: 'https://juvenes.fi/foobar/', provider: Provider.juvenes});
    return {result: 'Success'}
  }
})

// Run on server start
runTask('updateMenu').then(console.log).catch(console.error);
