/**
 * @file Schema validation for MongoDB.
 */
module.exports = {
    restaurants: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['name', 'url', 'campus', 'city', 'menu'],
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
                    description: 'Campus name',
                },
                city: {
                    bsonType: 'string',
                    description: 'City',
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
                                items: {
                                    bsonType: 'object',
                                    required: ['name', 'items'],
                                    properties: {
                                        name: {
                                            bsonType: 'string',
                                            description: 'Menu category name',
                                        },
                                        items: {
                                            bsonType: 'array',
                                            description: 'Menu items',
                                            items: {
                                                bsonType: 'object',
                                                required: ['name'],
                                                properties: {
                                                    name: {
                                                        bsonType: 'string',
                                                        description: 'Menu item name',
                                                    },
                                                    diets: {
                                                        bsonType: 'string',
                                                        description: 'Dietary restrictions',
                                                    },
                                                    ingredients: {
                                                        bsonType: 'string',
                                                        description: 'Ingredients',
                                                    }
                                                },
                                            },
                                        }
                                    },
                                },
                            },
                            fi: {
                                bsonType: 'array',
                                description: 'Menu items in Finnish',
                                items: {
                                    bsonType: 'object',
                                    required: ['name', 'items'],
                                    properties: {
                                        name: {
                                            bsonType: 'string',
                                            description: 'Menu category name',
                                        },
                                        items: {
                                            bsonType: 'array',
                                            description: 'Menu items',
                                            items: {
                                                bsonType: 'object',
                                                required: ['name'],
                                                properties: {
                                                    name: {
                                                        bsonType: 'string',
                                                        description: 'Menu item name',
                                                    },
                                                    diets: {
                                                        bsonType: 'string',
                                                        description: 'Dietary restrictions',
                                                    },
                                                    ingredients: {
                                                        bsonType: 'string',
                                                        description: 'Ingredients',
                                                    }
                                                },
                                            },
                                        }
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    }
};
