export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'en',
    messages: {
        en: {
            title: 'OU Lunches',
            noMenu: 'No menu available for selected day',
        },
        fi: {
            title: 'OY Lounaat',
            noMenu: 'Ruokalista ei ole saatavilla valitulle päivälle',
        }
    }
}))
