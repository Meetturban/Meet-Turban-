import React, { useState, useEffect } from 'react';
import { fetchServices } from '@backend/services/bookingService';
import ServiceCard from '../components/services/ServiceCard';
import ServiceDetailModal from '../components/services/ServiceDetailModal';
import { Search, Sparkles, Filter } from 'lucide-react';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedModalService, setSelectedModalService] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchServices();
      setServices(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const categories = ['All', ...new Set(services.map(s => s.category).filter(Boolean))];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 apple-fade-in">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full inline-flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          <span>Full Catalog & Packages</span>
        </span>
        <h1 className="text-4xl font-black text-slate-100">
          Royal Safa & Event Services
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Browse our full array of wedding turban tying packages, Maharaja groom styling, vintage entry cars, and floral walkway canopies.
        </p>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-panel p-4 rounded-3xl border border-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'gold-gradient-bg text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-amber-500"
          />
        </div>

      </div>

      {/* Services Grid or Empty State */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-amber-500 mx-auto"></div>
          <p className="text-xs text-amber-400 mt-4">Loading royal catalog...</p>
        </div>
      ) : filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelectDetail={(s) => setSelectedModalService(s)}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4 max-w-md mx-auto">
          <Filter className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-200">No Services Found</h3>
          <p className="text-xs text-slate-400">
            No matching services found for your current search or category filter.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="text-xs font-bold text-amber-400 underline"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Modal Detail View */}
      {selectedModalService && (
        <ServiceDetailModal
          service={selectedModalService}
          onClose={() => setSelectedModalService(null)}
        />
      )}

    </div>
  );
};

export default ServicesPage;
