export const db_validators = {
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
        provider: {
          bsonType: 'string',
          description: 'Restaurant service provider',
        },
        prices: {
          bsonType: 'array',
          description: 'Prices object',
          items: {
            bsonType: 'object',
            description: 'Price',
            properties: {
              title_fi: {
                bsonType: 'string',
                description: 'Title in Finnish',
              },
              title_en: {
                bsonType: 'string',
                description: 'Title in English',
              },
              student: {
                bsonType: 'string',
                description: 'Student price',
              },
              staff: {
                bsonType: 'string',
                description: 'Staff price',
              },
              other: {
                bsonType: 'string',
                description: 'Other price',
              },
            },
          },
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
                          },
                        },
                      },
                    },
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
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
