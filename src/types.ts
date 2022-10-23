export type Media = {
  id: string;
  url: string;
  type: 'image' | 'video';
};

export type CarFuel = 'Diesel' | 'Gasoline' | 'Hybrid' | 'Electric';

export type Car = {
  id: number;
  make: string;
  model: string;
  colour: string;
  price: number;
  mileage: number;
  firstRegistration: string;
  fuel: CarFuel;
  seller: {
    type: 'Private' | 'Dealer';
    phone: string;
    city: string;
  };
  images: Media[];
  description: string;
};
