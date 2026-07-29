import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Crown, Sparkles, Search, ShieldCheck, Award, Users, ArrowRight } from 'lucide-react';
import { fetchServices } from '@backend/services/bookingService';
import ServiceCard from '../components/services/ServiceCard';
import ServiceDetailModal from '../components/services/ServiceDetailModal';

const Home = () => {
  const navigate = useNavigate();
  const [featuredServices, setFeaturedServices] = useState([]);
  const [selectedModalService, setSelectedModalService] = useState(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [mobileInput, setMobileInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [searchTab, setSearchTab] = useState('id'); // 'id' | 'mobile'

  useEffect(() => {
    const loadFeatured = async () => {
      const data = await fetchServices();
      setFeaturedServices(data.slice(0, 4));
    };
    loadFeatured();
  }, []);

  const handleTrackSearch = (e) => {
    e.preventDefault();
    if (searchTab === 'id' && trackingInput.trim()) {
      navigate(`/track?id=${encodeURIComponent(trackingInput.trim())}`);
    } else if (searchTab === 'mobile' && mobileInput.trim() && dateInput) {
      navigate(`/track?mobile=${encodeURIComponent(mobileInput.trim())}&date=${encodeURIComponent(dateInput)}`);
    }
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-10 px-4">
        {/* Background Decorative Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-amber-600/20 via-amber-400/10 to-transparent blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
          
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs uppercase font-extrabold tracking-widest px-4 py-2 rounded-full shadow-lg backdrop-blur-md animate-fade-in">
            <Sparkles className="w-4 h-4 fill-current" />
            <span>Rajasthan's Premier Wedding Safa Artists</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-100 tracking-tight leading-tight">
            Royal Turban & Safa Styling for <br />
            <span className="gold-gradient-text">Unforgettable Weddings</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Elevate your wedding celebration with handcrafted silk safas, Maharaja groom turbans, grand Barat entry cars, and traditional musical welcomes.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/book"
              className="w-full sm:w-auto gold-gradient-bg text-slate-950 font-black text-sm px-8 py-4 rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-105 transition-all flex items-center justify-center space-x-2"
            >
              <Crown className="w-5 h-5" />
              <span>Book Event Services</span>
            </Link>
            <Link
              to="/services"
              className="w-full sm:w-auto bg-slate-900/90 border border-amber-500/30 hover:border-amber-500 text-slate-200 font-bold text-sm px-8 py-4 rounded-2xl transition-all hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* INSTANT BOOKING TRACKING SEARCH BAR */}
          <div className="pt-10 max-w-xl mx-auto">
            <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>Instant Booking Tracker</span>
                </span>
                <div className="flex space-x-2 text-[10px] uppercase font-bold">
                  <button
                    onClick={() => setSearchTab('id')}
                    className={`px-3 py-1 rounded-full transition-all ${
                      searchTab === 'id'
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Tracking ID
                  </button>
                  <button
                    onClick={() => setSearchTab('mobile')}
                    className={`px-3 py-1 rounded-full transition-all ${
                      searchTab === 'mobile'
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Mobile + Date
                  </button>
                </div>
              </div>

              <form onSubmit={handleTrackSearch} className="space-y-3">
                {searchTab === 'id' ? (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter Tracking ID (e.g. SAFA-2026-000001)"
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-2 bg-amber-500 text-slate-950 p-1.5 rounded-lg hover:scale-105 transition-transform"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="tel"
                      placeholder="10-digit Mobile"
                      value={mobileInput}
                      onChange={(e) => setMobileInput(e.target.value)}
                      className="bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl py-3 px-3 focus:outline-none focus:border-amber-500"
                    />
                    <div className="flex space-x-2">
                      <input
                        type="date"
                        value={dateInput}
                        onChange={(e) => setDateInput(e.target.value)}
                        className="bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl py-3 px-2 w-full focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="submit"
                        className="bg-amber-500 text-slate-950 px-3 rounded-xl hover:scale-105 transition-transform font-bold"
                      >
                        <Search className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURED SERVICES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest block">
              Signature Collection
            </span>
            <h2 className="text-3xl font-black text-slate-100 mt-1">
              Featured Royal Services
            </h2>
          </div>
          <Link
            to="/services"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelectDetail={(s) => setSelectedModalService(s)}
            />
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-10 rounded-3xl border border-amber-500/20 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-3 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl gold-gradient-bg flex items-center justify-center mx-auto md:mx-0 shadow-lg shadow-amber-500/20">
              <Award className="w-6 h-6 text-slate-950" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Master Craftsmanship</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our safa artists carry generations of royal Rajasthani turban tying heritage for perfect pleats every time.
            </p>
          </div>

          <div className="space-y-3 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl gold-gradient-bg flex items-center justify-center mx-auto md:mx-0 shadow-lg shadow-amber-500/20">
              <ShieldCheck className="w-6 h-6 text-slate-950" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Punctual Venue Setup</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Guaranteed on-time arrival with mobile artist units ready at your hotel or wedding venue entrance.
            </p>
          </div>

          <div className="space-y-3 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl gold-gradient-bg flex items-center justify-center mx-auto md:mx-0 shadow-lg shadow-amber-500/20">
              <Users className="w-6 h-6 text-slate-950" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Barat & Bulk Handling</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Equipped to style 50 to 500+ guests seamlessly within tight baraat assembly timeframes.
            </p>
          </div>

        </div>
      </section>

      {/* Service Detail Modal */}
      {selectedModalService && (
        <ServiceDetailModal
          service={selectedModalService}
          onClose={() => setSelectedModalService(null)}
        />
      )}

    </div>
  );
};

export default Home;
