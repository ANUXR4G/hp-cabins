'use client';

import React, { useState } from 'react';
import { Search, MapPin, Building, ShieldAlert, Maximize2, DollarSign, Cpu } from 'lucide-react';

interface SearchFormProps {
  onSearch?: (filters: any) => void;
  compact?: boolean;
}

export default function SearchForm({ onSearch, compact = false }: SearchFormProps) {
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [size, setSize] = useState('');
  const [budget, setBudget] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ city, category, size, budget });
    }
  };

  const cities = ['Hyderabad', 'Bangalore', 'Visakhapatnam', 'Delhi', 'Ranchi', 'Ahmedabad'];
  
  const categories = [
    'Office Cabins',
    'Accommodation Cabins',
    'Security Cabins',
    'Toilet Cabins',
    'Container Cabins',
    'Custom Modular Cabins'
  ];

  return (
    <form 
      onSubmit={handleSearch} 
      className={`glass-panel p-6 sm:p-7 rounded-none border border-white/60 max-w-6xl mx-auto w-full transition-all duration-300 ${
        compact ? 'shadow-md p-4' : 'translate-y-[-20%]'
      }`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 items-end">
        
        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-sm uppercase tracking-wider font-bold text-gray-500 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-crimson" />
            <span>Cabin Category</span>
          </label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-white/80 border border-gray-200/80 rounded-none px-3 py-3 text-sm text-premium-black font-semibold focus:outline-none focus:border-crimson transition-colors duration-200 cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* UAE Delivery City Filter */}
        <div className="space-y-2">
          <label className="text-sm uppercase tracking-wider font-bold text-gray-500 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-crimson" />
            <span>Delivery Region</span>
          </label>
          <select 
            value={city} 
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-white/80 border border-gray-200/80 rounded-none px-3 py-3 text-sm text-premium-black font-semibold focus:outline-none focus:border-crimson transition-colors duration-200 cursor-pointer"
          >
            <option value="">All Regions (India-wide)</option>
            {cities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Size Range Filter */}
        <div className="space-y-2">
          <label className="text-sm uppercase tracking-wider font-bold text-gray-500 flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-crimson" />
            <span>Footprint Size</span>
          </label>
          <select 
            value={size} 
            onChange={(e) => setSize(e.target.value)}
            className="w-full bg-white/80 border border-gray-200/80 rounded-none px-3 py-3 text-sm text-premium-black font-semibold focus:outline-none focus:border-crimson transition-colors duration-200 cursor-pointer"
          >
            <option value="">Any Dimensions</option>
            <option value="compact">Compact (Under 150 sqft)</option>
            <option value="medium">Medium (150 - 450 sqft)</option>
            <option value="large">Large Complexes (Over 450 sqft)</option>
          </select>
        </div>

        {/* Budget Filter */}
        <div className="space-y-2">
          <label className="text-sm uppercase tracking-wider font-bold text-gray-500 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-crimson" />
            <span>Budget Range</span>
          </label>
          <select 
            value={budget} 
            onChange={(e) => setBudget(e.target.value)}
            className="w-full bg-white/80 border border-gray-200/80 rounded-none px-3 py-3 text-sm text-premium-black font-semibold focus:outline-none focus:border-crimson transition-colors duration-200 cursor-pointer"
          >
            <option value="">Request Quote</option>
          </select>
        </div>

      </div>

      {/* Search Button Panel */}
      <div className="flex justify-end mt-5">
        <button 
          type="submit" 
          className="flex items-center justify-center gap-2 bg-crimson hover:bg-crimson-dark text-white font-sans uppercase font-bold text-sm tracking-wider py-3.5 px-8 rounded-none transition-all duration-300 w-full lg:w-auto cursor-pointer"
        >
          <Search className="w-4 h-4 text-white" />
          <span>Find Modular Cabins</span>
        </button>
      </div>

    </form>
  );
}
