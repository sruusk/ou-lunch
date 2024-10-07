export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('render:html', (html, { event }) => {
        const runtimeConfig = useRuntimeConfig();
        if(runtimeConfig.public.uId) {
          html.head.push(
            `<script defer src="${runtimeConfig.public.uScript}" data-website-id="${runtimeConfig.public.uId}"></script>`
          );
        }
    })
});
