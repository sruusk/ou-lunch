/**
 * @file Schema validation for MongoDB.
 */
module.exports = {
    restaurants: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['name', 'url', 'campus', 'menu'],
            properties: {
                name: {
                    bsonType: 'string',
                    description: 'Restaurant name',
                },
                url: {
                    bsonType: 'string',
                    description: 'Restaurant URL',
                },
                campus: {
                    bsonType: 'string',
                    description: 'Campus',
                },
                menu: {
                    bsonType: 'array',
                    description: 'Menu items',
                    items: {
                        bsonType: 'object',
                        required: ['date', 'en', 'fi'],
                        properties: {
                            date: {
                                bsonType: 'date',
                                description: 'Date of the menu',
                            },
                            en: {
                                bsonType: 'array',
                                description: 'Menu items in English',
                            },
                            fi: {
                                bsonType: 'array',
                                description: 'Menu items in Finnish',
                            },
                        },
                    },
                },
            },
        },
    }
};
