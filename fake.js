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
      images: Array.from({ length: 3 }).map(() => ({
        id: faker.datatype.uuid(),
        url: faker.image.imageUrl(300, 300, 'car', true),
        type: faker.helpers.arrayElement(['image', 'video']),
      })),
      description: faker.lorem.paragraph(),
    });
  }

  return { data: cars };
}

const dataObj = generateCars();

fs.writeFileSync('data.json', JSON.stringify(dataObj, null, '\t'));
