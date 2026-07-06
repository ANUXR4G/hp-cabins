'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Building, ChevronRight, Home } from 'lucide-react';
import { projectsData, DevelopmentProject } from '@/data/projects';
import { getCms } from '@/lib/cms';

const cms = getCms();

function mapProjects(data: typeof cms.projects) {
  return data.map((p: any, i: number) => ({
    id: p.id || `project-${i}`,
    name: p.name,
    category: 'Construction' as const,
    location: p.location || 'India',
    city: 'Hyderabad' as const,
    image: p.img || '/wp-content/uploads/2025/05/bgimg.jpg',
    description: p.description,
    startingPrice: 0,
    deliveryDate: p.date || 'Completed',
  }));
}

const initialProjects: DevelopmentProject[] = cms.projects?.length
  ? mapProjects(cms.projects)
  : projectsData;

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [activeCity, setActiveCity] = useState('All Locations');
  const [allProjects] = useState<DevelopmentProject[]>(initialProjects);
  const [filteredProjects, setFilteredProjects] = useState<DevelopmentProject[]>(initialProjects);

  const categories = ['All Categories', 'Industrial', 'Commercial', 'Construction', 'Residential'];
  const cities = ['All Locations', 'Hyderabad', 'Bangalore', 'Visakhapatnam', 'Delhi', 'Mumbai'];

  useEffect(() => {
    let result = allProjects;

    if (activeCategory !== 'All Categories') {
      result = result.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
    }

    if (activeCity !== 'All Locations') {
      result = result.filter(p => p.city.toLowerCase() === activeCity.toLowerCase());
    }

    setFilteredProjects(result);
  }, [activeCategory, activeCity, allProjects]);

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-24 font-sans text-premium-black">
      
      {/* Page Header */}
      <div className="relative bg-premium-black py-16 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="/wp-content/uploads/2025/05/bgimg.jpg" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-premium-black" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-extrabold text-white font-serif tracking-wide">Completed Projects</h1>
          
          {/* Breadcrumbs */}
          <div className="flex items-center justify-center gap-2 text-white/50 text-[10px] uppercase tracking-wider mt-4">
            <Link href="/" className="hover:text-crimson flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-crimson font-bold">Projects</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/60 shadow-sm flex flex-col sm:flex-row items-center gap-4 justify-between">
          
          <div className="flex flex-wrap gap-3 items-center w-full sm:w-auto">
            {/* Category selector */}
            <div className="space-y-1 w-full sm:w-auto">
              <span className="text-[10px] text-gray-400 font-extrabold uppercase block sm:hidden">Project Application</span>
              <select 
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-premium-black font-semibold focus:outline-none focus:border-crimson w-full sm:w-48 cursor-pointer"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            {/* City selector */}
            <div className="space-y-1 w-full sm:w-auto">
              <span className="text-[10px] text-gray-400 font-extrabold uppercase block sm:hidden">Location Region</span>
              <select 
                value={activeCity}
                onChange={(e) => setActiveCity(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-premium-black font-semibold focus:outline-none focus:border-crimson w-full sm:w-48 cursor-pointer"
              >
                {cities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-500 font-light shrink-0">
            Showing <span className="font-bold text-premium-black">{filteredProjects.length}</span> Compounds
          </div>

        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div 
                key={project.id} 
                className="group bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm luxury-card hover:border-crimson/50 transition-all duration-300 flex flex-col justify-between"
              >
                
                {/* Project Image & Category */}
                <div className="relative h-60 overflow-hidden bg-gray-150 shrink-0">
                  <img 
                    src={project.image} 
                    alt={project.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-4 left-4 bg-black/85 text-white border border-white/10 text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-lg">
                    {project.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex-grow flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-gray-400 text-[10px] uppercase tracking-wider font-bold">
                      <MapPin className="w-3.5 h-3.5 text-crimson shrink-0" />
                      <span>{project.location}, {project.city}</span>
                    </div>
                    <h3 className="text-base font-extrabold text-premium-black group-hover:text-crimson transition-colors duration-200 line-clamp-1 font-serif">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 font-light">
                      {project.description}
                    </p>
                  </div>

                  <div className="border-t border-gray-100 pt-4 flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-[9px] text-gray-400 uppercase block font-bold">Project Value</span>
                      <span className="text-sm font-bold font-mono text-premium-black">
                        {project.startingPrice > 0 ? `₹ ${project.startingPrice.toLocaleString()}` : 'On Request'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 uppercase block text-right font-bold">Status</span>
                      <span className="text-sm font-bold text-crimson font-mono">{project.deliveryDate}</span>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-16 text-center space-y-4">
            <span className="text-gray-400 text-sm font-light">No modular compounds found matching the selected parameters.</span>
            <button 
              onClick={() => {
                setActiveCategory('All Categories');
                setActiveCity('All Locations');
              }}
              className="bg-crimson hover:bg-crimson-dark text-white text-sm font-bold uppercase tracking-widest py-3 px-6 rounded-xl block mx-auto shadow-md cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
