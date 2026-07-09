import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Check, Percent, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { CanvaTemplate } from '../types';

interface BundleBuilderProps {
  templates: CanvaTemplate[];
  onPurchaseBundle: (selectedIds: string[], totalPrice: number) => void;
}

export default function BundleBuilder({ templates, onPurchaseBundle }: BundleBuilderProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(templates.map(t => t.id).slice(0, 3)); // select first 3 by default
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState(false);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectAll = () => {
    setSelectedIds(templates.map(t => t.id));
  };

  const selectNone = () => {
    setSelectedIds([]);
  };

  // Calculate regular sum
  const selectedTemplates = templates.filter(t => selectedIds.includes(t.id));
  const subtotal = selectedTemplates.reduce((sum, t) => sum + t.price, 0);

  // Discount tier calculation
  let discountPercentage = 0;
  if (selectedIds.length === 2) discountPercentage = 15;
  else if (selectedIds.length === 3) discountPercentage = 30;
  else if (selectedIds.length >= 4 && selectedIds.length < templates.length) discountPercentage = 40;
  else if (selectedIds.length === templates.length) discountPercentage = 55; // Huge "All-in" discount!

  const discountAmount = Math.round(subtotal * (discountPercentage / 100));
  
  // Coupon discount
  let couponDiscountAmount = 0;
  if (couponApplied) {
    couponDiscountAmount = Math.round((subtotal - discountAmount) * 0.1); // Extra 10%
  }

  const finalTotal = Math.max(0, subtotal - discountAmount - couponDiscountAmount);

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'CANVA10') {
      setCouponApplied(true);
      setCouponError(false);
    } else {
      setCouponError(true);
      setCouponApplied(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-[#1A1A1A] shadow-[8px_8px_0px_0px_#1A1A1A] overflow-hidden" id="interactive-bundle-builder">
      <div className="p-6 bg-[#FAF9F6] border-b-2 border-[#1A1A1A] text-[#1A1A1A] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-extrabold text-xl flex items-center gap-2">
            <Percent className="w-5 h-5 text-[#7D42FB]" />
            Interactive Bundle Builder
          </h3>
          <p className="text-xs text-neutral-500 font-serif italic">Pick multiple templates and watch the discount scale live!</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={selectAll} 
            className="text-xs font-bold bg-white hover:bg-neutral-50 px-3 py-1.5 border-2 border-[#1A1A1A] transition-all cursor-pointer"
          >
            Select All Templates
          </button>
          <button 
            onClick={selectNone} 
            className="text-xs font-bold bg-white hover:bg-neutral-50 px-3 py-1.5 border-2 border-[#1A1A1A] transition-all cursor-pointer"
          >
            Clear Selected
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Grid: Multi-select (7 cols) */}
        <div className="lg:col-span-7 p-6 border-r-2 border-[#1A1A1A] max-h-[500px] lg:max-h-[580px] overflow-y-auto custom-scrollbar bg-white">
          <span className="text-[11px] font-mono font-bold text-[#7D42FB] uppercase tracking-widest block mb-4">
            Step 1: Choose Templates to Bundle
          </span>

          <div className="space-y-3">
            {templates.map((temp) => {
              const isSelected = selectedIds.includes(temp.id);
              return (
                <div
                  key={temp.id}
                  onClick={() => toggleSelect(temp.id)}
                  className={`p-4 border-2 transition-all duration-200 flex items-center justify-between gap-4 cursor-pointer select-none ${
                    isSelected 
                      ? 'border-[#7D42FB] bg-violet-50/40 shadow-[3px_3px_0px_0px_#7D42FB]' 
                      : 'border-[#1A1A1A] hover:border-[#7D42FB] bg-white shadow-[3px_3px_0px_0px_#1A1A1A]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Checkbox square */}
                    <div className={`w-5 h-5 border-2 flex items-center justify-center shrink-0 transition-all ${
                      isSelected 
                        ? 'bg-[#7D42FB] border-[#1A1A1A] text-white' 
                        : 'border-[#1A1A1A] bg-white'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>

                    {/* Image thumb */}
                    <img
                      src={temp.image}
                      alt={temp.title}
                      className="w-12 h-12 border-2 border-[#1A1A1A] object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />

                    <div className="min-w-0">
                      <h4 className="font-display font-extrabold text-sm text-neutral-900 truncate">
                        {temp.title}
                      </h4>
                      <p className="text-xs text-neutral-500 font-serif italic">
                        {temp.categoryLabel} &bull; {temp.pagesCount} pages
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-display font-black text-sm text-[#1A1A1A] block">
                      ${temp.price}
                    </span>
                    <span className="text-[10px] text-neutral-400 block line-through font-mono">
                      {isSelected ? '' : `$${temp.price}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Cost and calculations (5 cols) */}
        <div className="lg:col-span-5 p-6 bg-[#FAF9F6] flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-mono font-bold text-[#7D42FB] uppercase tracking-widest block mb-4">
              Step 2: Live Savings Invoice
            </span>

            {/* Discount Multi-tier indicator */}
            <div className="bg-white p-4 border-2 border-[#1A1A1A] space-y-3 mb-5 shadow-[4px_4px_0px_0px_#1A1A1A]">
              <span className="text-xs font-bold text-neutral-700 block">Current Savings Bracket:</span>
              
              <div className="grid grid-cols-4 gap-1.5 text-center">
                {[
                  { qty: '2 Items', pct: '15%', active: selectedIds.length === 2 },
                  { qty: '3 Items', pct: '30%', active: selectedIds.length === 3 },
                  { qty: '4+ Items', pct: '40%', active: selectedIds.length >= 4 && selectedIds.length < templates.length },
                  { qty: 'All Items', pct: '55%', active: selectedIds.length === templates.length }
                ].map((tier, i) => (
                  <div
                    key={i}
                    className={`p-2 border-2 text-xs transition-all ${
                      tier.active
                        ? 'border-[#1A1A1A] bg-[#7D42FB] text-white font-extrabold scale-105 shadow-[2px_2px_0px_0px_#1A1A1A]'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-500'
                    }`}
                  >
                    <span className="block text-[8px] uppercase tracking-wider font-bold opacity-90">{tier.qty}</span>
                    <span className="text-xs font-display font-black">{tier.pct} Off</span>
                  </div>
                ))}
              </div>

              {selectedIds.length === 0 ? (
                <p className="text-[11px] text-neutral-400 text-center pt-2">
                  Select at least 2 templates to unlock bundle discount tiers!
                </p>
              ) : selectedIds.length === 1 ? (
                <p className="text-[11px] text-[#7D42FB] text-center font-bold pt-2">
                  Add 1 more template to save 15% immediately!
                </p>
              ) : (
                <p className="text-[11px] text-emerald-600 text-center font-bold pt-2 flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  You are saving {discountPercentage}% with {selectedIds.length} items!
                </p>
              )}
            </div>

            {/* Line items invoice breakdown */}
            <div className="space-y-2.5 text-sm border-b-2 border-dashed border-[#1A1A1A] pb-4 mb-4">
              <div className="flex justify-between text-neutral-600 font-medium">
                <span>Items Selected ({selectedIds.length})</span>
                <span className="font-mono font-bold">${subtotal}</span>
              </div>
              <div className="flex justify-between text-[#7D42FB] font-bold">
                <span>Bundle Discount (-{discountPercentage}%)</span>
                <span className="font-mono">- ${discountAmount}</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-emerald-600 font-bold text-xs">
                  <span>Promo Code "CANVA10" (Extra -10%)</span>
                  <span className="font-mono">- ${couponDiscountAmount}</span>
                </div>
              )}
            </div>

            {/* Coupon Code Input */}
            <div className="mb-5">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (Try CANVA10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border-2 border-[#1A1A1A] text-xs focus:outline-none focus:border-[#7D42FB] uppercase font-mono font-bold"
                  disabled={couponApplied}
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponApplied || !couponCode}
                  className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#7D42FB] text-white font-bold border-2 border-[#1A1A1A] text-xs uppercase disabled:bg-neutral-200 disabled:text-neutral-400 disabled:border-neutral-200 transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {couponApplied && (
                <p className="text-[11px] text-emerald-600 font-bold mt-1">
                  &bull; 10% coupon applied successfully!
                </p>
              )}
              {couponError && (
                <p className="text-[11px] text-rose-500 font-bold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Promo code is invalid! Try 'CANVA10'.
                </p>
              )}
            </div>
          </div>

          <div>
            {/* Total Block */}
            <div className="flex items-end justify-between mb-5 bg-[#FAF9F6] p-4 border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A]">
              <div>
                <span className="text-[11px] font-mono text-[#7D42FB] uppercase tracking-widest block font-extrabold">Grand Total</span>
                <span className="text-[10px] text-neutral-500 font-serif italic">Lifetime updates included</span>
              </div>
              <div className="text-right">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={finalTotal}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="text-3xl font-display font-black text-[#1A1A1A] block"
                  >
                    ${finalTotal}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            {/* Purchase CTA */}
            <button
              onClick={() => onPurchaseBundle(selectedIds, finalTotal)}
              disabled={selectedIds.length === 0}
              className="w-full py-3.5 px-6 bg-[#1A1A1A] hover:bg-[#7D42FB] disabled:bg-neutral-200 disabled:border-neutral-300 disabled:text-neutral-400 text-white font-extrabold uppercase tracking-wider border-2 border-[#1A1A1A] text-xs transition-all flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_#7D42FB] disabled:shadow-none cursor-pointer"
              id="bundle-buy-btn"
            >
              <ShoppingCart className="w-4 h-4" />
              Claim My Custom Bundle
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
