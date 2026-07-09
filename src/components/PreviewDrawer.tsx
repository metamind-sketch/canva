import { motion } from 'motion/react';
import { X, Check, Star, Sparkles, ShoppingBag, Layers, Download, CheckCircle2 } from 'lucide-react';
import { CanvaTemplate } from '../types';

interface PreviewDrawerProps {
  template: CanvaTemplate | null;
  onClose: () => void;
  onCustomize: (template: CanvaTemplate) => void;
  onBuy: (template: CanvaTemplate) => void;
}

export default function PreviewDrawer({ template, onClose, onCustomize, onBuy }: PreviewDrawerProps) {
  if (!template) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="template-detail-drawer">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-screen max-w-xl bg-white shadow-2xl flex flex-col h-full"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b-2 border-[#1A1A1A] flex items-center justify-between bg-[#FAF9F6]">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[#7D42FB]/15 text-[#7D42FB] border border-[#1A1A1A] rounded-none font-bold">
                <Layers className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-800">
                {template.categoryLabel}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 border-2 border-[#1A1A1A] hover:bg-neutral-200 text-[#1A1A1A] transition-colors"
              id="close-drawer-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-white">
            {/* Main Preview Image */}
            <div className="relative border-2 border-[#1A1A1A] overflow-hidden bg-neutral-50 aspect-[4/3] shadow-[4px_4px_0px_0px_#1A1A1A]">
              <img
                src={template.image}
                alt={template.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-[#7D42FB] text-white border border-[#1A1A1A] text-xs font-bold font-display tracking-wide uppercase shadow-[2px_2px_0px_0px_#1A1A1A] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-current" />
                  {template.pagesCount} Slides / Posts
                </span>
              </div>
            </div>

            {/* Title & Price Section */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-display font-extrabold text-2xl text-neutral-900 tracking-tight leading-snug">
                  {template.title}
                </h2>
                <div className="text-right shrink-0">
                  <span className="text-3xl font-display font-black text-neutral-900 block">
                    ${template.price}
                  </span>
                  <span className="text-[10px] text-neutral-900 font-bold bg-[#FAF9F6] border border-[#1A1A1A] px-2 py-0.5 uppercase tracking-wider shadow-[1px_1px_0px_0px_#1A1A1A]">
                    Lifetime Access
                  </span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 fill-current ${
                        i < Math.floor(template.rating) ? 'text-amber-400' : 'text-neutral-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-neutral-800">
                  {template.rating.toFixed(1)} / 5.0
                </span>
                <span className="text-sm text-neutral-400">
                  ({template.reviewsCount} verified purchases)
                </span>
              </div>
            </div>

            {/* Description list / Premium Features */}
            <div className="space-y-4">
              <h4 className="font-display font-bold text-base text-neutral-900 uppercase tracking-wide border-b-2 border-dashed border-neutral-100 pb-2">
                What is Included
              </h4>
              <ul className="space-y-3">
                {template.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-neutral-600 leading-relaxed">
                    <Check className="w-5 h-5 text-[#7D42FB] shrink-0 mt-0.5 stroke-[3]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Formatting / Design Specs */}
            <div className="bg-[#FAF9F6] p-5 border-2 border-[#1A1A1A] space-y-4 shadow-[3px_3px_0px_0px_#1A1A1A]">
              <h4 className="font-display font-extrabold text-sm text-neutral-800 uppercase tracking-wide">
                Technical Blueprint
              </h4>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs">
                <div>
                  <span className="block text-neutral-500 mb-1 font-serif italic">Software Required</span>
                  <span className="font-bold text-neutral-700">Free Canva Web Account</span>
                </div>
                <div>
                  <span className="block text-neutral-500 mb-1 font-serif italic">Commercial Rights</span>
                  <span className="font-bold text-[#7D42FB]">Lifetime Commercial License</span>
                </div>
                <div>
                  <span className="block text-neutral-500 mb-1 font-serif italic">Font Licensing</span>
                  <span className="font-bold text-neutral-700">100% Free Fonts Included</span>
                </div>
                <div>
                  <span className="block text-neutral-500 mb-1 font-serif italic">File Delivery</span>
                  <span className="font-bold text-neutral-700">Instant Digital Canva Link</span>
                </div>
              </div>
            </div>

            {/* Color Palette visualization */}
            <div className="space-y-3">
              <h4 className="font-display font-bold text-sm text-neutral-800 uppercase tracking-wide">
                Pre-defined Color Palette
              </h4>
              <div className="flex flex-wrap items-center gap-2">
                {template.colors.map((color, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 bg-[#FAF9F6] px-2.5 py-1.5 border-2 border-[#1A1A1A] text-[11px] font-mono font-bold text-neutral-700 shadow-[1px_1px_0px_0px_#1A1A1A]">
                    <span className="w-3.5 h-3.5 rounded-full border border-[#1A1A1A]" style={{ backgroundColor: color }} />
                    <span>{color.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Drawer Footer Buttons */}
          <div className="p-6 border-t-2 border-[#1A1A1A] bg-[#FAF9F6] space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  onCustomize(template);
                  onClose();
                }}
                className="w-full py-3.5 px-4 bg-white hover:bg-neutral-50 text-neutral-800 font-bold border-2 border-[#1A1A1A] text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                id={`drawer-btn-customize-${template.id}`}
              >
                <Layers className="w-4 h-4 text-[#7D42FB]" />
                Try Live Simulator
              </button>
              <button
                onClick={() => onBuy(template)}
                className="w-full py-3.5 px-4 bg-[#1A1A1A] hover:bg-[#7D42FB] text-white font-extrabold border-2 border-[#1A1A1A] text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_#7D42FB] active:scale-98 cursor-pointer"
                id={`drawer-btn-buy-${template.id}`}
              >
                <ShoppingBag className="w-4 h-4 text-white" />
                Add to Cart
              </button>
            </div>
            
            <p className="text-[10px] text-center text-neutral-500 font-serif italic">
              Payments are 100% secure. You will receive an instant digital PDF in your email with links to immediately copy templates into your Canva workspace.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
