import { Rental } from 'app/models';

export async function seed() {


  let streets = ['Ney', 'Boswort', 'Staples', 'Maddux', 'Los Palmes', 'Crescent Way',
                 'Jerrold', 'Folsom', 'Liberty', 'Texas']

  let randomCounts = [1, 2, 3, 4, 5];
  let randomCredits = [640, 650];
  let randomPrices = [0, 4750, 2025, 2000, 0, 1800, 3500, 5100, 0]

  let curStreet;
  for (let x = 0; x < 100; x++) {

    if (x % 10 == 0) {
      curStreet = streets[x / 10];
    }

    let rent = randomPrices[Math.floor(Math.random() * randomPrices.length)]

    let lat = Math.floor(Math.random() * 5) * 10;
    let lng = Math.floor(Math.random() * 5) * 10;
    let data = {
      name: `${1000 + x} ${curStreet} St`,
      description: "",
      address: `${1000 + x} ${curStreet} St`,
      city: 'San Francisco',
      geo_location: `{ "lat": 37.7${55013 + (x*lat)}, "lng": -122.${41396 + (x*lng)}}` ,
      type: 'house',
      target_deposit: rent,
      target_rent: rent,
      total_area: 1000 + Math.floor(Math.random() * 100),
      minimum_credit_store: randomCredits[Math.floor(Math.random() * randomCredits.length)],
      bathroom_count: randomCounts[Math.floor(Math.random() * randomCounts.length)],
      bed_count: randomCounts[Math.floor(Math.random() * randomCounts.length)]
    }

    await Rental.connection().create(data);
  }

}
