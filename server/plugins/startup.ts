export default defineNitroPlugin((nitroApp) => {
  console.log('Running scheduled tasks on startup');
  runTask('updateMenu').then((a) => {
    console.log(a);

    runTask('updatePrices').then(console.log).catch(console.error);
    if(!process.dev) runTask('updateHours').then(console.log).catch(console.error);
  }).catch(console.error);
})
