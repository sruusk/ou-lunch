export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'en',
    messages: {
        en: {
            title: 'OU Lunches',
            noMenu: 'No menu available for selected day',
            footer: {
                feedback: 'Feedback',
                joinTelegram: 'Join Telegram',
            }
        },
        fi: {
            title: 'OY Lounaat',
            noMenu: 'Ruokalista ei ole saatavilla valitulle päivälle',
            footer: {
                feedback: 'Anna palautetta',
                joinTelegram: 'Liity Telegramiin',
            }
        }
    }
}))
