'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home, SlidersHorizontal } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import { propertiesData, Property } from '@/data/properties';
import { getCms } from '@/lib/cms';

const cms = getCms();

const products = ((cms.products as Property[])?.length ? cms.products : propertiesData) as Property[];

function PropertiesContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') || '';
  const initialCity = searchParams.get('city') || '';

  const categories = [
    'All Products',
    'Office Cabins',
    'Accommodation Cabins',
    'Security Cabins',
    'Toilet Cabins',
    'Container Cabins',
    'Custom Modular Cabins'
  ];

  const [activeCategory, setActiveCategory] = useState('All Products');
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(products);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync with search queries from landing page floating search
  useEffect(() => {
    if (initialType) {
      // Find category that matches type query
      const cat = categories.find(c => c.toLowerCase().includes(initialType.toLowerCase()));
      if (cat) setActiveCategory(cat);
    }
    if (initialCity) {
      setSelectedCity(initialCity);
    }
  }, [initialType, initialCity]);

  // Apply filters whenever category, city or cabins change
  useEffect(() => {
    let result = products;

    // 1. Category Filter
    if (activeCategory !== 'All Products') {
      result = result.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
    }

    // 2. City Filter
    if (selectedCity) {
      result = result.filter(p => p.city.toLowerCase() === selectedCity.toLowerCase());
    }

    setFilteredProperties(result);
  }, [activeCategory, selectedCity, products]);

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-24 font-sans text-premium-black">
      
      {/* Page Header Banner */}
      <div className="page-hero">
        <div className="page-hero-media">
          <img src="/wp-content/uploads/2025/08/Steel-Prefabricated-Portable-Cabin_21890091633_steel-prefabricated-portable-cabin.jpg" className="w-full h-full object-cover" alt="" />
        </div>
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <h1 className="inner-page-title text-white drop-shadow">Our Products</h1>
          
          {/* Breadcrumbs */}
          <div className="flex items-center justify-center gap-2 breadcrumb text-white/50 mt-4">
            <Link href="/" className="hover:text-crimson flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-crimson font-bold">Catalog</span>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT SIDEBAR - Categories Filter */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Desktop Categories Panel */}
            <div className="hidden lg:block bg-white p-6 rounded-none border border-gray-200/60">
              <h3 className="text-sm font-bold uppercase tracking-wider border-l-2 border-crimson pl-3 mb-6 text-premium-black">
                Cabin Range
              </h3>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`text-left text-sm py-3.5 px-4 rounded-none font-bold transition-all duration-200 cursor-pointer ${
                        isActive 
                          ? 'bg-premium-black text-white' 
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-premium-black'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* City Delivery Target Filter */}
              <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider border-l-2 border-crimson pl-3 text-premium-black">
                  Delivery Region
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['', 'Hyderabad', 'Bangalore', 'Visakhapatnam', 'Delhi', 'Ranchi'].map((city) => (
                    <button
                      key={city}
                      onClick={() => setSelectedCity(city)}
                      className={`text-xs uppercase font-bold py-2 px-3.5 rounded-full border transition-all duration-200 cursor-pointer ${
                        (city === '' && selectedCity === '') || selectedCity === city
                          ? 'bg-crimson border-crimson text-white font-bold'
                          : 'bg-white border-gray-200 text-gray-500 hover:border-crimson hover:text-crimson'
                      }`}
                    >
                      {city === '' ? 'All Regions' : city}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Filters Toggle Button */}
            <div className="lg:hidden flex gap-4">
              <button 
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="flex items-center gap-2 bg-premium-black text-white text-sm font-bold uppercase tracking-wider py-3.5 px-5 rounded-none border border-white/10 w-full justify-center"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters & Ranges</span>
              </button>
            </div>

            {/* Mobile Dropdown filters panel */}
            {showMobileFilters && (
              <div className="lg:hidden bg-white p-5 rounded-none border border-gray-200/60 space-y-5 animate-fade-in">
                <div className="space-y-2">
                  <span className="text-xs uppercase text-gray-400 font-extrabold block">Select Category</span>
                  <select 
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-none p-3 text-sm font-semibold"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <span className="text-xs uppercase text-gray-400 font-extrabold block">Select Region</span>
                  <select 
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-none p-3 text-sm font-semibold"
                  >
                    <option value="">All Regions</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Visakhapatnam">Visakhapatnam</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Ranchi">Ranchi</option>
                  </select>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT SIDEBAR - Cabin Grid catalog */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Catalog Info Bar */}
            <div className="flex items-center justify-between bg-white p-4 rounded-none border border-gray-200/60 text-base sm:text-sm">
              <span className="text-gray-500">
                Showing <span className="font-bold text-premium-black">{filteredProperties.length}</span> products
              </span>
              <span className="text-crimson font-extrabold uppercase tracking-widest text-xs">
                {activeCategory} {selectedCity ? `in ${selectedCity}` : 'in India'}
              </span>
            </div>

            {/* Grid Cards */}
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map((cabin) => (
                  <PropertyCard key={cabin.id} property={cabin} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-none border border-gray-200/60 p-16 text-center space-y-4">
                <span className="text-gray-400 text-sm">No modular units found matching your selection criteria.</span>
                <button 
                  onClick={() => {
                    setActiveCategory('All Products');
                    setSelectedCity('');
                  }}
                  className="bg-crimson hover:bg-crimson-dark text-white text-sm font-bold uppercase tracking-widest py-3 px-6 rounded-none block mx-auto cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="p-24 text-center text-premium-black font-semibold">Loading Catalog...</div>}>
      <PropertiesContent />
    </Suspense>
  );
}
