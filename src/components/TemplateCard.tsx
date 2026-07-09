import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Star, Eye, Layers, Sparkles } from 'lucide-react';
import { CanvaTemplate } from '../types';

interface TemplateCardProps {
  template: CanvaTemplate;
  onPreview: (template: CanvaTemplate) => void;
  onCustomize: (template: CanvaTemplate) => void;
}

export default function TemplateCard({ template, onPreview, onCustomize }: TemplateCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['6deg', '-6deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-6deg', '6deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-white rounded-xl border-2 border-[#1A1A1A] overflow-hidden shadow-[5px_5px_0px_0px_#1A1A1A] hover:shadow-[8px_8px_0px_0px_#7D42FB] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full select-none cursor-pointer"
      id={`template-card-${template.id}`}
      onClick={() => onPreview(template)}
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 pointer-events-none">
        {template.isBestSeller && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none border border-[#1A1A1A] text-xs font-bold bg-[#7D42FB] text-white shadow-[2px_2px_0px_0px_#1A1A1A] font-display uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Best Seller
          </span>
        )}
        {template.isNew && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-none border border-[#1A1A1A] text-xs font-bold bg-[#FAF9F6] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] font-display uppercase tracking-wider">
            New
          </span>
        )}
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-none border border-[#1A1A1A] text-[11px] font-bold bg-neutral-900 text-white shadow-[2px_2px_0px_0px_#1A1A1A] w-fit">
          {template.categoryLabel}
        </span>
      </div>

      {/* Price Tag */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none">
        <span className="inline-flex items-center font-display font-extrabold text-lg bg-white text-neutral-900 px-3 py-1 border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A]">
          ${template.price}
        </span>
      </div>

      {/* Image Area */}
      <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden flex items-center justify-center border-b-2 border-[#1A1A1A]">
        <motion.img
          src={template.image}
          alt={template.title}
          referrerPolicy="no-referrer"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full object-cover object-top"
        />

        {/* Hover overlay with smooth blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-[#7D42FB]/40 backdrop-blur-xs flex items-center justify-center gap-3 z-10"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview(template);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-white text-neutral-900 border-2 border-[#1A1A1A] rounded-none text-xs font-bold shadow-[2px_2px_0px_0px_#1A1A1A] hover:bg-neutral-50 transform active:scale-95 transition-all duration-200"
            id={`btn-preview-${template.id}`}
          >
            <Eye className="w-4 h-4 text-[#7D42FB]" />
            Quick View
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCustomize(template);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1A1A1A] text-white border-2 border-[#1A1A1A] rounded-none text-xs font-bold shadow-[2px_2px_0px_0px_#7D42FB] hover:bg-[#7D42FB] transform active:scale-95 transition-all duration-200"
            id={`btn-customize-${template.id}`}
          >
            <Layers className="w-4 h-4 text-[#FAF9F6]" />
            Try Live
          </button>
        </motion.div>
      </div>

      {/* Details Area */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4 bg-white">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 fill-current ${
                    i < Math.floor(template.rating) ? 'text-amber-400' : 'text-neutral-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-neutral-700 ml-1">
              {template.rating.toFixed(1)}
            </span>
            <span className="text-xs text-neutral-400">
              ({template.reviewsCount} reviews)
            </span>
          </div>

          <h3 className="font-display font-extrabold text-lg text-neutral-900 group-hover:text-[#7D42FB] transition-colors duration-200 line-clamp-1 mb-1">
            {template.title}
          </h3>
          <p className="text-xs text-neutral-500 font-serif italic">
            {template.pagesCount} fully-editable {template.pagesCount === 1 ? 'page' : 'pages'} included
          </p>
        </div>

        {/* Tags & Action Row */}
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1 max-w-[70%]">
            {template.tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="inline-block text-[10px] font-bold text-[#1A1A1A] bg-[#FAF9F6] border border-[#1A1A1A] px-2 py-0.5 uppercase tracking-wider"
              >
                #{tag}
              </span>
            ))}
          </div>
          <span className="text-xs font-bold text-[#7D42FB] group-hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1 font-display">
            View &rarr;
          </span>
        </div>
      </div>
    </motion.div>
  );
}
