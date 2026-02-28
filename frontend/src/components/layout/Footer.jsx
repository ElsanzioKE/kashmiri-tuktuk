import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-forest-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-ember-500 rounded-full flex items-center justify-center text-white font-bold text-xl">K</div>
              <div>
                <div className="font-display font-bold text-white text-lg leading-tight">Kashmiri TukTuk</div>
                <div className="text-ember-400 text-xs">Spare Parts</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Trusted supplier of quality TukTuk spare parts for Kashmir and East Africa. Bajaj, TVS, Piaggio and more.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[['/', 'Home'], ['/products', 'Products'], ['/about', 'About Us'], ['/contact', 'Contact']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-ember-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands */}
          <div>
            <h4 className="font-semibold text-white mb-4">Brands</h4>
            <ul className="space-y-2 text-sm">
              {['Bajaj', 'TVS', 'Piaggio', 'Universal'].map((brand) => (
                <li key={brand}>
                  <Link to={`/products?brand=${brand}`} className="hover:text-ember-400 transition-colors">
                    {brand}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-sm space-y-3">
              <li className="flex items-start space-x-2">
                <svg className="w-4 h-4 text-ember-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Lal Chowk, Srinagar, J&K 190001</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-ember-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+91 194 XXX XXXX</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-ember-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@kashmirituktuk.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-forest-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2024 Kashmiri TukTuk Spare Parts. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Serving Kashmir & East Africa</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
