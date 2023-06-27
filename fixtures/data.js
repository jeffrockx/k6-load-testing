import faker from 'https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.min.js' // https://cdnjs.com/libraries/Faker/3.1.0

export const userData = () => ({
    'name': `${faker.name.firstName()} ${faker.name.lastName()}`,
    'sex': 'M',
    'date_of_birth': '2000-09-22'
})