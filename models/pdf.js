const PDFParser = require("pdf2json");

Date.prototype.getWeek = function() {
    const d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
}

/**
 * Download PDF file to buffer
 * @param {string} url - URL to PDF file
 * @returns {Promise<Buffer>} - PDF file
 */
const downloadPDF = async (url) => {
    return fetch(url, {
        method: 'GET',
        redirect: 'error'
    }).then(response => response.arrayBuffer());
}

/**
 * Get Makosa PDF URL
 * @returns {string} - URL to Makosa PDF
 */
const getMakosaUrl = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const week = new Date().getWeek();
    return `https://www.ravintolamakosa.fi/wp-content/uploads/${year}/${month}/Makosa_vko${week}Valtti.pdf`;
}

/**
 * Parse PDF file
 * @param {Buffer} pdf - PDF file
 * @returns {Promise<Object>} - Parsed PDF data
 */
const parsePDF = (pdf) => {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser();

        pdfParser.on("pdfParser_dataError", errData => {
            reject(errData);
        });
        pdfParser.on("pdfParser_dataReady", pdfData => {
            resolve(pdfData);
        });

        pdfParser.parseBuffer(pdf);
    });
}

/**
 * Get Makosa menu
 * @returns {Promise<Object>} - Makosa menu
 */
const getMakosaMenu = async () => {
    const pdf = await downloadPDF(getMakosaUrl());
    const pdfData = await parsePDF(pdf);
    const text = pdfData.Pages[0].Texts.map(t => decodeURIComponent(t.R[0].T));
    const days = {
        MA: [],
        TI: [],
        KE: [],
        TO: [],
        PE: []
    }
    // Separate days
    Object.keys(days).forEach(day => {
        const index = text.indexOf(day);
        if(index !== -1) {
            // Find the next day or the end of the text
            const endIndex = text.slice(index + 1).findIndex(t => Object.keys(days).includes(t));
            days[day] = text.slice(index + 1, endIndex !== -1 ? endIndex + index + 1 : undefined);
        }
    });
    // Separate languages
    Object.keys(days).forEach(day => {
        const cleaned = days[day]
            .join('')
            .replaceAll('(FI)', '')
            .replaceAll('  ', '/');
        const regex = /((?! )[\w\säöå\-]+?(?:\(.+?\)|$|(?=\/)))(?! ?ja| ?and)/gi;
        const matches = [...cleaned.matchAll(regex)];
        // Separate Finnish and English. Every other match is Finnish and every other is English starting from Finnish
        const fi = matches.filter((_, i) => i % 2 === 0).map(m => m[1].trim());
        const en = matches.filter((_, i) => i % 2 === 1).map(m => m[1].trim());

        // Separate diet information
        const dietRegex = /\((.+?)\)/g;
        [fi, en].forEach(lang => {
            lang.forEach((item, i) => {
                const diets = [...item.matchAll(dietRegex)].map(d => d[1].replaceAll('/', ''));
                lang[i] = {
                    name: item.replace(dietRegex, '').trim(),
                    diets: diets.length > 0 ? diets.join(', ') : undefined
                }
            });
        });

        days[day] = {
            fi: [
                {
                    name: 'Lounas',
                    items: fi
                }
            ],
            en: [
                {
                    name: 'Lunch',
                    items: en
                }
            ]
        }
    });

    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
    monday.setUTCHours(0, 0, 0, 0);

    return [{
        date: monday,
        fi: days.MA.fi,
        en: days.MA.en,
    }, {
        date: new Date(new Date(monday).setDate(monday.getDate() + 1)),
        fi: days.TI.fi,
        en: days.TI.en,
    }, {
        date: new Date(new Date(monday).setDate(monday.getDate() + 2)),
        fi: days.KE.fi,
        en: days.KE.en,
    }, {
        date: new Date(new Date(monday).setDate(monday.getDate() + 3)),
        fi: days.TO.fi,
        en: days.TO.en,
    }, {
        date: new Date(new Date(monday).setDate(monday.getDate() + 4)),
        fi: days.PE.fi,
        en: days.PE.en,
    }];
}
