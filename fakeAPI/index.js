const { faker } = require('@faker-js/faker');
const fs = require('fs');

function generateCars() {
  let cars = [];

  for (let id = 1; id <= 100; id++) {
    cars.push({
      id: id,
      make: faker.vehicle.manufacturer(),
      model: faker.vehicle.model(),
      colour: faker.vehicle.color(),
      price: faker.commerce.price(),
      mileage: faker.datatype.number({ min: 1 }),
      firstRegistration: faker.date.past(),
      fuel: faker.helpers.arrayElement([
        'Diesel',
        'Gasoline',
        'Hybrid',
        'Electric',
      ]),
      seller: {
        type: faker.helpers.arrayElement(['Private', 'Dealer']),
        phone: faker.phone.number(),
        city: faker.address.city(),
      },
      images: [
        faker.internet.avatar(),
        faker.internet.avatar(),
        faker.internet.avatar(),
      ],
      description: faker.lorem.paragraph(),
    });
  }

  return { data: cars };
}

const dataObj = generateCars();

fs.writeFileSync('fakeAPI/data.json', JSON.stringify(dataObj, null, '\t'));
