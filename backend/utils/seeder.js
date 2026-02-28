const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

const connectDB = require('../config/db');

const seed = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany();
  await Category.deleteMany();
  await Product.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Create admin user
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@kashmirituktuk.com',
    password: 'admin123456',
    role: 'admin',
  });

  const customer = await User.create({
    name: 'Test Customer',
    email: 'customer@test.com',
    password: 'customer123',
    role: 'customer',
  });

  console.log('✅ Users created');

  // Create categories
  const categories = await Category.insertMany([
    { name: 'Engine Parts', description: 'Engine components and spares' },
    { name: 'Electrical', description: 'Electrical systems and components' },
    { name: 'Body Parts', description: 'Body panels and exterior parts' },
    { name: 'Suspension', description: 'Suspension and steering parts' },
    { name: 'Brakes', description: 'Brake system components' },
    { name: 'Transmission', description: 'Gearbox and transmission parts' },
    { name: 'Filters', description: 'Oil, air and fuel filters' },
    { name: 'Tyres & Wheels', description: 'Tyres, rims and wheel accessories' },
  ]);

  console.log('✅ Categories created');

  // Create sample products
  const products = [
    {
      name: 'Bajaj RE Carburetor Assembly',
      description: 'Original carburetor assembly for Bajaj RE TukTuk. Compatible with all RE series models. Ensures optimal fuel efficiency and smooth performance.',
      shortDescription: 'Original Bajaj RE carburetor - optimal fuel efficiency',
      price: 2850,
      originalPrice: 3200,
      brand: 'Bajaj',
      category: categories[0]._id,
      stock: 45,
      sku: 'BAJ-CARB-001',
      isFeatured: true,
      compatibility: ['Bajaj RE', 'Bajaj RE Compact'],
      images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', alt: 'Carburetor' }],
      specifications: [{ key: 'Material', value: 'Aluminum Alloy' }, { key: 'Fuel Type', value: 'Petrol' }],
    },
    {
      name: 'TVS King Headlight Assembly',
      description: 'Complete headlight assembly for TVS King TukTuk. High-quality LED headlight with DRL for improved visibility in all conditions.',
      shortDescription: 'LED headlight assembly for TVS King',
      price: 1650,
      originalPrice: 1900,
      brand: 'TVS',
      category: categories[1]._id,
      stock: 30,
      sku: 'TVS-HEAD-001',
      isFeatured: true,
      compatibility: ['TVS King', 'TVS King Deluxe'],
      images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', alt: 'Headlight' }],
    },
    {
      name: 'Piaggio Ape Front Windshield',
      description: 'Genuine Piaggio Ape front windshield glass. Anti-UV treated, shatter-resistant. Fits all Piaggio Ape models from 2015 onwards.',
      price: 4200,
      brand: 'Piaggio',
      category: categories[2]._id,
      stock: 15,
      sku: 'PIA-WIND-001',
      isFeatured: true,
      compatibility: ['Piaggio Ape City', 'Piaggio Ape Classic'],
      images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', alt: 'Windshield' }],
    },
    {
      name: 'Universal TukTuk Oil Filter',
      description: 'High-performance oil filter compatible with most TukTuk models. Extended service life, superior filtration for engine protection.',
      price: 280,
      brand: 'Universal',
      category: categories[6]._id,
      stock: 200,
      sku: 'UNI-OIL-001',
      isFeatured: false,
      images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', alt: 'Oil Filter' }],
    },
    {
      name: 'Bajaj RE Front Disc Brake Set',
      description: 'Complete front disc brake set for Bajaj RE. Includes disc rotor, brake pads, and caliper. OEM quality for reliable stopping power.',
      price: 3800,
      originalPrice: 4500,
      brand: 'Bajaj',
      category: categories[4]._id,
      stock: 25,
      sku: 'BAJ-BRAKE-001',
      isFeatured: true,
      compatibility: ['Bajaj RE', 'Bajaj RE Compact', 'Bajaj RE Plus'],
      images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', alt: 'Brake Set' }],
    },
    {
      name: 'TVS King Shock Absorber (Pair)',
      description: 'Heavy-duty shock absorbers for TVS King. Pair of front shock absorbers for improved ride quality and stability on rough terrain.',
      price: 2200,
      brand: 'TVS',
      category: categories[3]._id,
      stock: 40,
      sku: 'TVS-SHOCK-001',
      images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', alt: 'Shock Absorber' }],
    },
  ];

  await Product.insertMany(products);
  console.log('✅ Products created');

  console.log('\n📋 Seed Data Summary:');
  console.log(`   Admin: admin@kashmirituktuk.com / admin123456`);
  console.log(`   Customer: customer@test.com / customer123`);
  console.log(`   Categories: ${categories.length}`);
  console.log(`   Products: ${products.length}`);

  process.exit(0);
};

seed().catch((err) => {
  console.error('Seeder error:', err);
  process.exit(1);
});
