import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Truck, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageBackground } from '../components/common/PageBackground';
import { PageHeading } from '../components/common/PageHeading';

export const InventoryPage: React.FC = () => {
  const { 
    categories, 
    domain, 
    setSelectedAllocationModal, 
    recommendations,
    runOptimization
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter category list
  const filteredCategories = categories.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || cat.id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage) || 1;
  const paginatedCategories = filteredCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <PageBackground>
      <div className="space-y-6 pb-16">
        {/* Page Title & Highlight Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <PageHeading
            category="CORE OPERATIONS"
            title="Stock Pool Inventory"
            highlightKeyword="Inventory"
            description={`Real-time stock monitoring, reserve capacity, and quick allocation dispatch for ${domain.toUpperCase()} domain.`}
          />

          <button
            onClick={() => runOptimization()}
            className="px-4 py-2.5 rounded-xl bg-[#1677E8] hover:bg-[#1366C8] text-white text-xs font-bold shadow-md shadow-blue-500/10 flex items-center space-x-2 self-start sm:self-auto active:scale-95 transition-all"
          >
            <Truck className="w-4 h-4" />
            <span>Batch Optimize Inventory</span>
          </button>
        </div>

        {/* Filter and Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#E5EAF0] shadow-card">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search inventory item name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F4F7FA] border border-[#E5EAF0] rounded-lg pl-9 pr-4 py-2 text-xs text-[#102A43] font-medium placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1677E8]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#F4F7FA] border border-[#E5EAF0] rounded-lg px-3 py-2 text-xs text-[#102A43] font-medium focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Desktop Data Table (visible md and up) */}
        <div className="hidden md:block bg-white border border-[#E5EAF0] rounded-[16px] overflow-hidden shadow-card">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5EAF0] bg-[#F4F7FA] text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                <th className="py-3.5 px-6">Resource Name</th>
                <th className="py-3.5 px-6">Domain Category</th>
                <th className="py-3.5 px-6">Available Stock</th>
                <th className="py-3.5 px-6">Total Capacity</th>
                <th className="py-3.5 px-6">Stock Status</th>
                <th className="py-3.5 px-6 text-right">Quick Dispatch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAF0] text-xs text-[#102A43]">
              {paginatedCategories.map((cat) => {
                const utilPct = Math.round((cat.allocatedStock / Math.max(1, cat.totalCapacity)) * 100);
                const isLowStock = cat.availableStock < cat.totalCapacity * 0.2;
                const matchingRec = recommendations.find(r => r.resourceId === cat.id);

                return (
                  <tr key={cat.id} className="hover:bg-[#F8FBFF] transition-colors">
                    <td className="py-4 px-6 font-semibold text-[#102A43] flex items-center space-x-2">
                      <Package className="w-4 h-4 text-[#1677E8]" />
                      <span>{cat.name}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 capitalize">{cat.domain}</td>
                    <td className="py-4 px-6">
                      <span className="font-extrabold text-[#102A43]">{cat.availableStock.toLocaleString()}</span>
                      <span className="text-[11px] text-slate-500 ml-1">{cat.unit}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {cat.totalCapacity.toLocaleString()} {cat.unit}
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1 max-w-[140px]">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-500 font-medium">Allocated {utilPct}%</span>
                          <span className={isLowStock ? 'text-[#EF4444] font-bold' : 'text-[#16A974] font-semibold'}>
                            {isLowStock ? 'Low Stock' : 'Optimal'}
                          </span>
                        </div>
                        <div className="w-full bg-[#E5EAF0] h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${isLowStock ? 'bg-[#EF4444]' : 'bg-[#1677E8]'}`}
                            style={{ width: `${utilPct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => {
                          if (matchingRec) {
                            setSelectedAllocationModal(matchingRec);
                          } else {
                            runOptimization(cat.id);
                          }
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-[#1677E8] text-[#1677E8] hover:text-white border border-blue-200 text-xs font-semibold inline-flex items-center space-x-1.5 transition-all"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>{matchingRec ? 'Dispatch Proposal' : 'Run AI Allocate'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Cards (visible < 768px) */}
        <div className="md:hidden space-y-3">
          {paginatedCategories.map((cat) => {
            const isLowStock = cat.availableStock < cat.totalCapacity * 0.2;
            const matchingRec = recommendations.find(r => r.resourceId === cat.id);

            return (
              <div key={cat.id} className="bg-white border border-[#E5EAF0] rounded-xl p-4 space-y-3 shadow-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-[#1677E8]" />
                    <h3 className="text-sm font-bold text-[#102A43]">{cat.name}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isLowStock ? 'bg-rose-50 text-[#EF4444] border border-rose-200' : 'bg-emerald-50 text-[#16A974] border border-emerald-200'
                  }`}>
                    {isLowStock ? 'Low Stock' : 'Available'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-[#F8FAFC] p-2.5 rounded-lg border border-[#E5EAF0]">
                  <div>
                    <p className="text-[10px] text-slate-500 font-medium">Available</p>
                    <p className="font-bold text-[#102A43]">{cat.availableStock.toLocaleString()} {cat.unit}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-medium">Total Capacity</p>
                    <p className="font-bold text-slate-600">{cat.totalCapacity.toLocaleString()} {cat.unit}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (matchingRec) {
                      setSelectedAllocationModal(matchingRec);
                    } else {
                      runOptimization(cat.id);
                    }
                  }}
                  className="w-full py-2 rounded-xl bg-[#1677E8] hover:bg-[#1366C8] text-white text-xs font-bold flex items-center justify-center space-x-2"
                >
                  <Truck className="w-4 h-4" />
                  <span>{matchingRec ? 'Dispatch Proposal' : 'Run AI Allocate'}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
          <span>Showing {paginatedCategories.length} of {filteredCategories.length} resource categories</span>

          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-1.5 rounded-lg bg-white border border-[#E5EAF0] text-[#102A43] disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium text-[#102A43]">Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="p-1.5 rounded-lg bg-white border border-[#E5EAF0] text-[#102A43] disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </PageBackground>
  );
};
