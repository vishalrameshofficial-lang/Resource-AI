import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Sparkles, 
  Search, 
  MapPin, 
  Truck, 
  Phone, 
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UrgencyLevel } from '../types';
import { PageBackground } from '../components/common/PageBackground';
import { PageHeading } from '../components/common/PageHeading';

export const MapView: React.FC = () => {
  const { 
    locations, 
    recommendations, 
    selectedLocationId, 
    setSelectedLocationId,
    setSelectedAllocationModal,
    searchQuery,
    setSearchQuery,
    isDarkMode
  } = useApp();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [showRecOverlay, setShowRecOverlay] = useState<boolean>(true);

  // Filter locations
  const filteredLocations = locations.filter(loc => {
    const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          loc.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUrgency = urgencyFilter === 'all' || loc.urgencyLevel === urgencyFilter;
    return matchesSearch && matchesUrgency;
  });

  // Selected location details
  const activeLocation = locations.find(l => l.id === selectedLocationId) || filteredLocations[0];
  const activeRec = recommendations.find(r => r.locationId === activeLocation?.id);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default India coordinates
      const map = L.map(mapContainerRef.current, {
        center: [22.5937, 78.9629],
        zoom: 5,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // CartoDB tiles based on light/dark mode preference
      const tileUrl = isDarkMode 
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      L.tileLayer(tileUrl, {
        attribution: '&copy; CartoDB &copy; OpenStreetMap',
        maxZoom: 19
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    } else {
      const tileUrl = isDarkMode 
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          layer.setUrl(tileUrl);
        }
      });
    }
  }, [isDarkMode]);

  // Update Markers on Map when locations/filters change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    const colorHexMap: Record<UrgencyLevel, string> = {
      critical: '#ef4444',
      high: '#f59e0b',
      medium: '#eab308',
      low: '#16a974'
    };

    filteredLocations.forEach(loc => {
      const colorHex = colorHexMap[loc.urgencyLevel];
      const isSelected = loc.id === selectedLocationId;

      const markerHtml = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center;">
          ${loc.urgencyLevel === 'critical' ? `<div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: ${colorHex}; opacity: 0.35;" class="animate-ring"></div>` : ''}
          <div style="
            width: ${isSelected ? '28px' : '20px'};
            height: ${isSelected ? '28px' : '20px'};
            border-radius: 50%;
            background: ${colorHex};
            border: 3px solid #ffffff;
            box-shadow: 0 4px 12px ${colorHex}88;
            cursor: pointer;
            transition: all 0.2s ease;
          "></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-map-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = L.marker([loc.lat, loc.lng], { icon: customIcon });

      marker.on('click', () => {
        setSelectedLocationId(loc.id);
        mapInstanceRef.current?.panTo([loc.lat, loc.lng], { animate: true, duration: 0.5 });
      });

      markersLayerRef.current?.addLayer(marker);
    });

    if (filteredLocations.length > 0 && mapInstanceRef.current) {
      const bounds = L.latLngBounds(filteredLocations.map(l => [l.lat, l.lng]));
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [filteredLocations, selectedLocationId]);

  return (
    <PageBackground>
      <div className="space-y-6 pb-16">
        {/* Page Title & Highlight Header */}
        <PageHeading
          category="CORE OPERATIONS"
          title="GIS Urgency Map"
          highlightKeyword="Urgency"
          description="Geographic intelligence heat map and real-time urgency distribution across 60 Indian location nodes."
        />

        {/* Enterprise Map Container Shell */}
        <div className="relative h-[calc(100vh-14rem)] w-full rounded-[16px] overflow-hidden border border-[#E5EAF0] bg-[#0B1F3A] shadow-card flex">
          {/* Interactive Map Canvas */}
          <div ref={mapContainerRef} className="h-full w-full z-10" />

          {/* Top Floating Filter & Search Bar */}
          <div className="absolute top-4 left-4 right-4 sm:right-auto z-20 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-xl">
            {/* Search input */}
            <div className="relative flex-1 bg-white/95 backdrop-blur-md border border-[#E5EAF0] rounded-xl shadow-lg">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter map by facility name or region..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent pl-9 pr-4 py-2 text-xs text-[#102A43] font-medium placeholder-slate-400 focus:outline-none"
              />
            </div>

            {/* Urgency Selector */}
            <div className="flex items-center space-x-1 bg-white/95 backdrop-blur-md border border-[#E5EAF0] p-1 rounded-xl shadow-lg">
              {(['all', 'critical', 'high', 'medium', 'low'] as string[]).map((u) => (
                <button
                  key={u}
                  onClick={() => setUrgencyFilter(u)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition-all ${
                    urgencyFilter === u 
                      ? u === 'critical' ? 'bg-[#EF4444] text-white' : u === 'high' ? 'bg-[#F59E0B] text-white' : u === 'low' ? 'bg-[#16A974] text-white' : 'bg-[#1677E8] text-white'
                      : 'text-slate-600 hover:text-[#102A43] hover:bg-slate-100'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {/* Top Right AI Recommendation Panel Overlay */}
          {showRecOverlay && recommendations.length > 0 && (
            <div className="hidden lg:block absolute top-4 right-4 z-20 w-80 bg-white/95 backdrop-blur-md border border-[#E5EAF0] rounded-xl shadow-2xl p-4 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between border-b border-[#E5EAF0] pb-2">
                <div className="flex items-center space-x-2 text-[#1677E8]">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#102A43]">Top AI Dispatch Proposal</span>
                </div>
                <button 
                  onClick={() => setShowRecOverlay(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {recommendations[0] && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#102A43]">{recommendations[0].locationName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-[#EF4444] border border-rose-200">
                      Priority {recommendations[0].priorityScore}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-snug line-clamp-3">
                    {recommendations[0].explainabilityReason}
                  </p>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1677E8]">
                      {recommendations[0].recommendedAmount} {recommendations[0].unit}
                    </span>
                    <button
                      onClick={() => setSelectedAllocationModal(recommendations[0])}
                      className="px-3 py-1.5 rounded-lg bg-[#1677E8] hover:bg-[#1366C8] text-white text-xs font-bold shadow-md flex items-center space-x-1 transition-all"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Inspect & Dispatch</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bottom Location Detail Drawer */}
          {activeLocation && (
            <div className="absolute bottom-4 left-4 right-4 z-20 max-w-2xl mx-auto bg-white/95 backdrop-blur-md border border-[#E5EAF0] rounded-2xl shadow-2xl p-4 sm:p-5 space-y-4 animate-slide-up">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-[#102A43]">{activeLocation.name}</h3>
                    <span className="text-xs font-semibold text-slate-500">({activeLocation.code})</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      activeLocation.urgencyLevel === 'critical' ? 'bg-rose-50 text-[#EF4444] border-rose-200' :
                      activeLocation.urgencyLevel === 'high' ? 'bg-amber-50 text-[#F59E0B] border-amber-200' :
                      'bg-emerald-50 text-[#16A974] border-emerald-200'
                    }`}>
                      {activeLocation.urgencyLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activeLocation.address}</span>
                  </p>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <a
                    href={`tel:${activeLocation.contactPhone}`}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#102A43] transition-colors border border-[#E5EAF0]"
                    title="Call Facility Operations"
                  >
                    <Phone className="w-4 h-4" />
                  </a>

                  {activeRec ? (
                    <button
                      onClick={() => setSelectedAllocationModal(activeRec)}
                      className="px-4 py-2 rounded-xl bg-[#1677E8] hover:bg-[#1366C8] text-white text-xs font-bold shadow-md flex items-center space-x-2 transition-all active:scale-95"
                    >
                      <Truck className="w-4 h-4" />
                      <span>Dispatch AI Rec ({activeRec.recommendedAmount} {activeRec.unit})</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedLocationId(activeLocation.id);
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#102A43] text-xs font-semibold border border-[#E5EAF0]"
                    >
                      Inspect Node
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#E5EAF0] text-xs">
                <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E5EAF0]">
                  <p className="text-[10px] text-slate-500 font-medium">Priority Score</p>
                  <p className="text-base font-extrabold text-[#1677E8]">{activeLocation.priorityScore}/100</p>
                </div>
                <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E5EAF0]">
                  <p className="text-[10px] text-slate-500 font-medium">Deficit Stress</p>
                  <p className="text-base font-extrabold text-[#EF4444]">{activeLocation.occupancyOrDeficitPct}%</p>
                </div>
                <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E5EAF0]">
                  <p className="text-[10px] text-slate-500 font-medium">Population Impact</p>
                  <p className="text-base font-extrabold text-[#102A43]">{activeLocation.population.toLocaleString()}</p>
                </div>
                <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E5EAF0]">
                  <p className="text-[10px] text-slate-500 font-medium">Transit Access Index</p>
                  <p className="text-base font-extrabold text-[#F59E0B]">{Math.round(activeLocation.accessibilityIndex * 100)}%</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageBackground>
  );
};
