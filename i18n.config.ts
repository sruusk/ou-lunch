export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'en',
    messages: {
        en: {
            title: 'Oulu University Food',
            description: 'Lunch menus of the University of Oulu',
            noMenu: 'No menu available for selected day',
            notAvailableForLanguage: 'No English translation available',
            footer: {
                feedback: 'Feedback',
                feedbackTelegram: 'Give feedback on Telegram',
                feedbackGithub: 'Give feedback on GitHub',
            },
            aria: {
                ingredients: 'Ingredients',
                source: 'Source code on GitHub',
                filterOptions: 'Filter options',
                logo: 'Oulu University Food logo',
                colourMode: 'Toggle color mode',
                language: 'Select language',
                open: 'Open',
                page: 'restaurant\'s own page',
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
                hide: 'Hide others',
                order: 'Order (drag and drop)',
            }
        },
        fi: {
            title: 'Oulun Yliopiston Lounaat',
            description: 'Oulun yliopiston lounasravintoloiden ruokalistat',
            noMenu: 'Valitulle päivälle ei ole saatavilla ruokalistaa',
            notAvailableForLanguage: '',
            footer: {
                feedback: 'Anna palautetta',
                feedbackTelegram: 'Anna palautetta Telegramissa',
                feedbackGithub: 'Anna palautetta GitHubissa',
            },
            aria: {
                ingredients: 'Ainesosat',
                source: 'Lähdekoodi GitHub',
                filterOptions: 'Suodatusvaihtoehdot',
                logo: 'Oulun Yliopiston Lounaat logo',
                colourMode: 'Vaihda värimoodi',
                language: 'Valitse kieli',
                open: 'Avaa',
                page: 'ravintolan omat sivut',
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
                hide: 'Piilota muut',
                order: 'Järjestys (vedä ja pudota)',
            }
        }
    }
}))
