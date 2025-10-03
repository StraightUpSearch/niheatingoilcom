import Database from 'better-sqlite3';

console.log('🚀 Adding test supplier data...\n');

const db = new Database('heating-oil.db');

// Clear existing data (optional - uncomment if you want fresh start)
// db.exec('DELETE FROM oil_prices');
// db.exec('DELETE FROM suppliers');

// Add test suppliers
console.log('📦 Adding suppliers...');

const suppliersData = [
  {
    name: 'Belfast Fuel Direct',
    location: 'Belfast',
    phone: '028 9066 3300',
    website: 'https://belfastfueldirect.com',
    coverage_areas: 'Belfast, Lisburn, Newtownabbey, Castlereagh, Antrim',
    rating: '4.7',
    review_count: 245,
  },
  {
    name: 'Derry Home Heating',
    location: 'Londonderry',
    phone: '028 7126 4500',
    website: 'https://derryhomeheating.com',
    coverage_areas: 'Derry, Limavady, Strabane, Coleraine',
    rating: '4.5',
    review_count: 189,
  },
  {
    name: 'Budget Oil NI',
    location: 'Bangor',
    phone: '028 9145 6789',
    website: 'https://budgetoilni.com',
    coverage_areas: 'Bangor, Newtownards, Holywood, Donaghadee, Ards',
    rating: '4.3',
    review_count: 156,
  },
  {
    name: 'Armagh Oil Supplies',
    location: 'Armagh',
    phone: '028 3752 2100',
    website: 'https://armaghoil.com',
    coverage_areas: 'Armagh, Portadown, Craigavon, Lurgan, Newry',
    rating: '4.8',
    review_count: 312,
  },
  {
    name: 'Tyrone Fuels Ltd',
    location: 'Omagh',
    phone: '028 8224 3600',
    website: 'https://tyronefuels.com',
    coverage_areas: 'Omagh, Strabane, Cookstown, Dungannon, Tyrone',
    rating: '4.6',
    review_count: 198,
  },
  {
    name: 'Fermanagh Heating Oil',
    location: 'Enniskillen',
    phone: '028 6632 5400',
    website: 'https://fermanaghoil.com',
    coverage_areas: 'Enniskillen, Fermanagh, Lisnaskea, Irvinestown',
    rating: '4.4',
    review_count: 134,
  },
  {
    name: 'Antrim Oil Services',
    location: 'Antrim',
    phone: '028 9446 7800',
    website: 'https://antrimoil.com',
    coverage_areas: 'Antrim, Ballymena, Ballyclare, Randalstown, Toomebridge',
    rating: '4.7',
    review_count: 267,
  },
  {
    name: 'Down Oil Direct',
    location: 'Downpatrick',
    phone: '028 4461 3300',
    website: 'https://downoildirect.com',
    coverage_areas: 'Downpatrick, Newcastle, Ballynahinch, Castlewellan, Down',
    rating: '4.5',
    review_count: 203,
  },
];

const supplierInsert = db.prepare(`
  INSERT INTO suppliers (name, location, phone, website, coverage_areas, rating, review_count, is_active, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))
`);

const insertedSuppliers = [];
for (const supplier of suppliersData) {
  const result = supplierInsert.run(
    supplier.name,
    supplier.location,
    supplier.phone,
    supplier.website,
    supplier.coverage_areas,
    supplier.rating,
    supplier.review_count
  );
  insertedSuppliers.push({ id: result.lastInsertRowid, ...supplier });
  console.log(`  ✅ ${supplier.name}`);
}

// Add prices for different volumes and postcodes
console.log('\n💰 Adding prices...');

const priceInsert = db.prepare(`
  INSERT INTO oil_prices (supplier_id, volume, price, price_per_litre, includes_vat, postcode, created_at)
  VALUES (?, ?, ?, ?, 1, ?, datetime('now'))
`);

// Pricing data: [volume, base_price_per_litre]
// Larger volumes get better rates per litre
const volumePricing = [
  { volume: 300, base_ppl: 0.95 },
  { volume: 500, base_ppl: 0.87 },
  { volume: 900, base_ppl: 0.79 },
];

// Postcodes to generate prices for
const postcodes = [
  'BT1',   // Belfast City Centre
  'BT9',   // South Belfast
  'BT15',  // North Belfast
  'BT18',  // Holywood
  'BT19',  // Bangor
  'BT20',  // Newtownards
  'BT28',  // Lisburn
  'BT36',  // Newtownabbey
  'BT38',  // Carrickfergus
  'BT41',  // Antrim
  'BT42',  // Ballymena
  'BT43',  // Ballyclare
  'BT47',  // Derry
  'BT48',  // Derry/Londonderry
  'BT52',  // Coleraine
  'BT61',  // Armagh
  'BT62',  // Craigavon
  'BT63',  // Portadown
  'BT66',  // Lurgan
  'BT74',  // Enniskillen
  'BT78',  // Omagh
  'BT79',  // Strabane
  'BT80',  // Cookstown
  'BT30',  // Downpatrick
  'BT33',  // Newcastle
];

let priceCount = 0;

// For each supplier, add prices for random postcodes
for (const supplier of insertedSuppliers) {
  // Each supplier covers 3-5 random postcodes
  const coverageCount = Math.floor(Math.random() * 3) + 3;
  const supplierPostcodes = postcodes
    .sort(() => Math.random() - 0.5)
    .slice(0, coverageCount);

  for (const postcode of supplierPostcodes) {
    for (const { volume, base_ppl } of volumePricing) {
      // Add slight variation to prices (+/- 5%)
      const variation = (Math.random() * 0.1 - 0.05);
      const pricePerLitre = base_ppl * (1 + variation);
      const totalPrice = (pricePerLitre * volume).toFixed(2);

      priceInsert.run(
        supplier.id,
        volume,
        totalPrice,
        pricePerLitre.toFixed(3),
        postcode
      );
      priceCount++;
    }
  }
}

console.log(`  ✅ Added ${priceCount} price entries`);

// Show summary
console.log('\n📊 Database Summary:');
const supplierCount = db.prepare('SELECT COUNT(*) as count FROM suppliers').get().count;
const priceCountTotal = db.prepare('SELECT COUNT(*) as count FROM oil_prices').get().count;

console.log(`  📦 Suppliers: ${supplierCount}`);
console.log(`  💰 Prices: ${priceCountTotal}`);

// Show sample prices
console.log('\n🔍 Sample Prices (500L in Belfast BT1):');
const samplePrices = db.prepare(`
  SELECT
    s.name as supplier,
    p.price,
    p.price_per_litre
  FROM oil_prices p
  JOIN suppliers s ON p.supplier_id = s.id
  WHERE p.volume = 500 AND p.postcode = 'BT1'
  ORDER BY CAST(p.price AS REAL) ASC
  LIMIT 5
`).all();

if (samplePrices.length > 0) {
  samplePrices.forEach((price, i) => {
    console.log(`  ${i + 1}. ${price.supplier}: £${price.price} (${price.price_per_litre}p/L)`);
  });
} else {
  console.log('  No prices found for BT1 postcode');
}

db.close();

console.log('\n✅ Test data added successfully!');
console.log('\n💡 Next steps:');
console.log('   1. Refresh your website: http://niheatingoil.local');
console.log('   2. Try searching for "BT1" or any other postcode');
console.log('   3. View the suppliers page');
console.log('   4. Restart the Express server if needed: npm run dev');
