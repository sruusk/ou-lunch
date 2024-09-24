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
            },
            aria: {
                ingredients: 'Ingredients',
                source: 'Source code on GitHub',
            }
        },
        fi: {
            title: 'OY Lounaat',
            noMenu: 'Valitulle päivälle ei ole saatavilla ruokalistaa',
            footer: {
                feedback: 'Anna palautetta',
                joinTelegram: 'Liity Telegramiin',
            },
            aria: {
                ingredients: 'Ainesosat',
                source: 'Lähdekoodi GitHub',
            }
        }
    }
}))
