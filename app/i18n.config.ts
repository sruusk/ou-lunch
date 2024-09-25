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
            },
            filters: {
                filter: 'Filter',
                eggFree: 'Egg-free (Mu)',
                glutenFree: 'Gluten free (G)',
                lactoseFree: 'Lactose free (L)',
                milkFree: 'Milk free (M)',
                vegan: 'Vegan (VEG)',
                recommended: 'Recommended (*)',
                apply: 'Apply',
                method: 'Select filter method',
                highlight: 'Highlight',
                hide: 'Hide',
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
            },
            filters: {
                filter: 'Suodata',
                eggFree: 'Munaton (Mu)',
                glutenFree: 'Gluteeniton (G)',
                lactoseFree: 'Laktoositon (L)',
                milkFree: 'Maidoton (M)',
                vegan: 'Vegaani (VEG)',
                recommended: 'Suositusten mukainen (*)',
                apply: 'Tallenna',
                method: 'Valitse suodatustapa',
                highlight: 'Korosta',
                hide: 'Piilota',
            }
        }
    }
}))
