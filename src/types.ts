export type Car = {
  id: number;
  make: string;
  model: string;
  colour: string;
  price: number;
  mileage: number;
  firstRegistration: string;
  fuel: 'Diesel' | 'Gasoline' | 'Hybrid' | 'Electric';
  seller: {
    type: 'Private' | 'Dealer';
    phone: string;
    city: string;
  };
  images: string[];
  description: string;
};
