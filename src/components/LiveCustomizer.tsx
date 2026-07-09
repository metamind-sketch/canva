import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Palette, 
  Type, 
  Sparkles, 
  Check, 
  Maximize2, 
  Undo2, 
  Download, 
  FileEdit, 
  Layers, 
  Eye, 
  Grid3X3,
  MousePointer,
  HelpCircle
} from 'lucide-react';
import { CanvaTemplate } from '../types';

interface LiveCustomizerProps {
  initialTemplate: CanvaTemplate;
  allTemplates: CanvaTemplate[];
  onOpenInCanva: (template: CanvaTemplate) => void;
}

const FONTS = [
  { name: 'Outfit (Modern)', class: 'font-display', value: 'var(--font-display)' },
  { name: 'Playfair (Elegant Serif)', class: 'font-serif', value: 'var(--font-serif)' },
  { name: 'Inter (Clean Sans)', class: 'font-sans', value: 'var(--font-sans)' },
  { name: 'JetBrains (Tech Mono)', class: 'font-mono', value: 'var(--font-mono)' },
];

export default function LiveCustomizer({ initialTemplate, allTemplates, onOpenInCanva }: LiveCustomizerProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<CanvaTemplate>(initialTemplate);
  
  // Custom states for template layout simulation
  const [text1, setText1] = useState(initialTemplate.mockText1);
  const [text2, setText2] = useState(initialTemplate.mockText2);
  const [text3, setText3] = useState(initialTemplate.mockText3);
  
  const [selectedFont, setSelectedFont] = useState(FONTS[1]); // Playfair by default for Artistic Flair
  const [paletteColors, setPaletteColors] = useState<string[]>(initialTemplate.colors);
  
  // Customizer Controls
  const [fontSize, setFontSize] = useState(32); // Title font size
  const [letterSpacing, setLetterSpacing] = useState(0); // tracking
  const [imageOpacity, setImageOpacity] = useState(30); // image contrast opacity
  const [showGrid, setShowGrid] = useState(false); // alignment helper
  const [exportSuccess, setExportSuccess] = useState(false);

  // Sync state when template changes externally
  useEffect(() => {
    setSelectedTemplate(initialTemplate);
    setText1(initialTemplate.mockText1);
    setText2(initialTemplate.mockText2);
    setText3(initialTemplate.mockText3);
    setPaletteColors(initialTemplate.colors);
  }, [initialTemplate]);

  const handleTemplateSelect = (template: CanvaTemplate) => {
    setSelectedTemplate(template);
    setText1(template.mockText1);
    setText2(template.mockText2);
    setText3(template.mockText3);
    setPaletteColors(template.colors);
  };

  const resetCustomizer = () => {
    setText1(selectedTemplate.mockText1);
    setText2(selectedTemplate.mockText2);
    setText3(selectedTemplate.mockText3);
    setSelectedFont(FONTS[1]);
    setPaletteColors(selectedTemplate.colors);
    setFontSize(32);
    setLetterSpacing(0);
    setImageOpacity(30);
    setShowGrid(false);
  };

  const handleDownloadDraft = () => {
    setExportSuccess(true);
    setTimeout(() => {
      setExportSuccess(false);
    }, 4000);
  };

  // Determine colors based on active palette
  const bgColor = paletteColors[0] || '#ffffff';
  const accentColor1 = paletteColors[1] || '#222222';
  const textColor = paletteColors[2] || '#111111';
  const secondaryColor = paletteColors[3] || '#666666';

  return (
    <div className="w-full bg-white text-[#1A1A1A] rounded-xl overflow-hidden border-2 border-[#1A1A1A] shadow-[8px_8px_0px_0px_#1A1A1A]" id="canva-live-customizer">
      {/* Editor Header Bar */}
      <div className="px-6 py-4 border-b-2 border-[#1A1A1A] bg-[#FAF9F6] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#7D42FB] border border-[#1A1A1A] text-white">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-lg leading-tight tracking-tight text-[#1A1A1A] flex items-center gap-2">
              Canva Editor Simulator
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-none bg-[#7D42FB] text-white border border-[#1A1A1A] uppercase tracking-widest font-bold shadow-[1px_1px_0px_0px_#1A1A1A]">
                Interactive
              </span>
            </h3>
            <p className="text-xs text-neutral-500 font-serif italic">Test customization layers prior to launching actual file</p>
          </div>
        </div>

        {/* Quick controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={resetCustomizer}
            className="px-3 py-2 text-[#1A1A1A] bg-white hover:bg-neutral-50 transition-all border-2 border-[#1A1A1A] flex items-center gap-1.5 text-xs font-bold"
            title="Reset Editor"
          >
            <Undo2 className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={() => onOpenInCanva(selectedTemplate)}
            className="px-4 py-2 bg-[#7D42FB] hover:bg-[#6627eb] text-white text-xs font-bold border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] transition-all flex items-center gap-1.5"
          >
            <FileEdit className="w-3.5 h-3.5" />
            Edit in Canva &rarr;
          </button>
        </div>
      </div>

      {/* Main Workspace Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Control Panel: 5 Cols */}
        <div className="lg:col-span-5 p-6 border-r-2 border-[#1A1A1A] bg-white flex flex-col gap-6 max-h-[640px] overflow-y-auto custom-scrollbar">
          {/* Section: Select a template */}
          <div>
            <span className="text-[11px] font-mono font-bold text-[#7D42FB] uppercase tracking-widest block mb-2.5">
              1. Choose A Template Frame
            </span>
            <div className="grid grid-cols-3 gap-2">
              {allTemplates.map((temp) => {
                const isActive = selectedTemplate.id === temp.id;
                return (
                  <button
                    key={temp.id}
                    onClick={() => handleTemplateSelect(temp)}
                    className={`relative aspect-[4/3] border-2 text-left group transition-all duration-200 ${
                      isActive ? 'border-[#7D42FB] ring-2 ring-[#7D42FB]/20 shadow-[2px_2px_0px_0px_#1A1A1A]' : 'border-[#1A1A1A] hover:border-[#7D42FB]'
                    }`}
                  >
                    <img 
                      src={temp.image} 
                      alt={temp.title} 
                      className="w-full h-full object-cover object-top"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-neutral-950/40 group-hover:bg-neutral-950/20 transition-all flex items-end p-1">
                      <p className="text-[9px] font-bold text-white line-clamp-1 leading-tight bg-neutral-900/90 px-1 py-0.5 w-full text-center">
                        {temp.title.split(' ')[0] || 'Template'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Live Text Modifiers */}
          <div className="border-t border-neutral-100 pt-5">
            <span className="text-[11px] font-mono font-bold text-[#7D42FB] uppercase tracking-widest block mb-3">
              2. Custom Text Layers
            </span>
            <div className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1 flex items-center justify-between">
                  <span>Layer 1: Header Accent</span>
                  <span className="text-[9px] text-neutral-400 font-serif italic">Auto-fits scale</span>
                </label>
                <input
                  type="text"
                  value={text1}
                  onChange={(e) => setText1(e.target.value.toUpperCase())}
                  maxLength={25}
                  className="w-full px-3 py-2 bg-[#FAF9F6] border-2 border-[#1A1A1A] text-sm focus:outline-none focus:border-[#7D42FB] transition-colors placeholder-neutral-400 font-display uppercase tracking-widest text-[#7D42FB] font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1 flex items-center justify-between">
                  <span>Layer 2: Main Subject</span>
                  <span className="text-[9px] text-neutral-400 font-serif italic">Edit text below</span>
                </label>
                <textarea
                  rows={2}
                  value={text2}
                  onChange={(e) => setText2(e.target.value)}
                  maxLength={80}
                  className="w-full px-3 py-2 bg-[#FAF9F6] border-2 border-[#1A1A1A] text-sm focus:outline-none focus:border-[#7D42FB] transition-colors placeholder-neutral-400 font-serif leading-normal"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                  Layer 3: Call-To-Action / Footer
                </label>
                <input
                  type="text"
                  value={text3}
                  onChange={(e) => setText3(e.target.value)}
                  maxLength={40}
                  className="w-full px-3 py-2 bg-[#FAF9F6] border-2 border-[#1A1A1A] text-sm focus:outline-none focus:border-[#7D42FB] transition-colors placeholder-neutral-400 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section: Palette & Fonts */}
          <div className="border-t border-neutral-100 pt-5">
            <span className="text-[11px] font-mono font-bold text-[#7D42FB] uppercase tracking-widest block mb-3.5">
              3. Style & Typography
            </span>
            <div className="grid grid-cols-2 gap-4">
              {/* Fonts */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-2 flex items-center gap-1">
                  <Type className="w-3 h-3 text-[#7D42FB]" /> Font Pairing
                </label>
                <div className="space-y-1">
                  {FONTS.map((font) => (
                    <button
                      key={font.name}
                      onClick={() => setSelectedFont(font)}
                      className={`w-full text-left px-2.5 py-1.5 border-2 transition-all flex items-center justify-between text-xs font-bold ${
                        selectedFont.name === font.name 
                          ? 'bg-[#7D42FB] text-white border-[#1A1A1A]' 
                          : 'bg-[#FAF9F6] border-[#1A1A1A] hover:bg-neutral-100 text-[#1A1A1A]'
                      }`}
                    >
                      <span className={font.class}>{font.name.split(' ')[0]}</span>
                      {selectedFont.name === font.name && <Check className="w-3 h-3 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Swatches */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-2 flex items-center gap-1">
                  <Palette className="w-3 h-3 text-[#7D42FB]" /> Theme Palettes
                </label>
                <div className="space-y-2">
                  {[
                    { label: 'Artistic Cream', colors: ['#FAF9F6', '#FFEBE5', '#1A1A1A', '#7D42FB'] },
                    { label: 'Earthy Clay', colors: ['#FAF5F0', '#EAE0D5', '#3E2723', '#795548'] },
                    { label: 'Nordic Sage', colors: ['#EBEFEF', '#C3C9C9', '#2E3D3D', '#5E6D6D'] },
                    { label: 'Neon Cyber', colors: ['#0C0F19', '#1A365D', '#00FFFF', '#E2E8F0'] },
                    { label: 'Warm Apricot', colors: ['#FFF8F5', '#FFE3D8', '#E65100', '#F57C00'] }
                  ].map((palette) => (
                    <button
                      key={palette.label}
                      onClick={() => setPaletteColors(palette.colors)}
                      className="w-full p-2 border-2 border-[#1A1A1A] bg-[#FAF9F6] hover:bg-neutral-100 transition-all flex items-center gap-2 justify-between"
                      title={palette.label}
                    >
                      <span className="text-[10px] text-neutral-600 font-bold truncate">{palette.label}</span>
                      <div className="flex gap-0.5 shrink-0">
                        {palette.colors.map((c, idx) => (
                          <span key={idx} className="w-2.5 h-2.5 rounded-full border border-[#1A1A1A]" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section: Geometry / Sizing Layout Options */}
          <div className="border-t border-neutral-100 pt-5">
            <span className="text-[11px] font-mono font-bold text-[#7D42FB] uppercase tracking-widest block mb-3">
              4. Formatting Sliders
            </span>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-neutral-600 font-medium">Subject Text Size</span>
                  <span className="text-[#1A1A1A] font-mono font-extrabold">{fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="22"
                  max="48"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-[#7D42FB] h-1 bg-neutral-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-neutral-600 font-medium">Letter Spacing</span>
                  <span className="text-[#1A1A1A] font-mono font-extrabold">{letterSpacing}px</span>
                </div>
                <input
                  type="range"
                  min="-3"
                  max="8"
                  value={letterSpacing}
                  onChange={(e) => setLetterSpacing(Number(e.target.value))}
                  className="w-full accent-[#7D42FB] h-1 bg-neutral-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-neutral-600 font-medium">Background Cover Contrast</span>
                  <span className="text-[#1A1A1A] font-mono font-extrabold">{imageOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={imageOpacity}
                  onChange={(e) => setImageOpacity(Number(e.target.value))}
                  className="w-full accent-[#7D42FB] h-1 bg-neutral-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Grid aligner checkbox */}
          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
            <label htmlFor="toggle-grid" className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-700 hover:text-[#7D42FB] select-none">
              <Grid3X3 className={`w-4 h-4 ${showGrid ? 'text-[#7D42FB]' : 'text-neutral-500'}`} />
              Show Layout Alignment Grid
            </label>
            <input
              type="checkbox"
              id="toggle-grid"
              checked={showGrid}
              onChange={() => setShowGrid(!showGrid)}
              className="w-4 h-4 text-[#7D42FB] bg-neutral-100 border-[#1A1A1A] focus:ring-[#7D42FB] cursor-pointer"
            />
          </div>
        </div>

        {/* Right Preview Canvas Viewport: 7 Cols */}
        <div className="lg:col-span-7 bg-[#1A1A1A] p-6 flex flex-col items-center justify-center relative min-h-[450px] lg:min-h-[640px]">
          {/* Subtle instructions */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-none border border-neutral-700 text-[10px] text-neutral-300">
            <MousePointer className="w-3 h-3 text-[#7D42FB]" />
            <span>Interactive Canvas Preview</span>
          </div>

          {/* Quick Mock Canvas Board Frame */}
          <motion.div
            layout
            animate={{ 
              backgroundColor: bgColor,
              borderColor: accentColor1,
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 18 }}
            style={{ fontFamily: selectedFont.value }}
            className="w-full max-w-[340px] aspect-[4/5] sm:aspect-[3/4] rounded-none relative shadow-2xl border-2 border-[#1A1A1A] overflow-hidden flex flex-col justify-between p-6 sm:p-8"
          >
            {/* Background Image Layer (from active template) */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <img 
                src={selectedTemplate.image} 
                alt="Mock Background" 
                className="w-full h-full object-cover object-top filter grayscale contrast-125"
                referrerPolicy="no-referrer"
                style={{ opacity: imageOpacity / 100 }}
              />
              {/* Tint overlay */}
              <div 
                className="absolute inset-0 mix-blend-multiply" 
                style={{ backgroundColor: accentColor1, opacity: 0.15 }}
              />
            </div>

            {/* Layout alignment overlay */}
            {showGrid && (
              <div className="absolute inset-0 z-10 pointer-events-none border-2 border-dashed border-[#7D42FB]/20 grid grid-cols-3 grid-rows-3">
                <div className="border-r border-b border-dashed border-[#7D42FB]/10"></div>
                <div className="border-r border-b border-dashed border-[#7D42FB]/10"></div>
                <div className="border-b border-dashed border-[#7D42FB]/10"></div>
                <div className="border-r border-b border-dashed border-[#7D42FB]/10"></div>
                <div className="border-r border-b border-dashed border-[#7D42FB]/10"></div>
                <div className="border-b border-dashed border-[#7D42FB]/10"></div>
                <div className="border-r border-dashed border-[#7D42FB]/10"></div>
                <div className="border-r border-dashed border-[#7D42FB]/10"></div>
                <div></div>
              </div>
            )}

            {/* Content Layer 1: Header Accent */}
            <div className="z-10 text-left">
              <motion.span
                layout
                animate={{ color: accentColor1 }}
                style={{ letterSpacing: '4px' }}
                className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.25em] block uppercase font-display"
              >
                {text1 || 'ACCENT LAYER'}
              </motion.span>
              <div className="w-8 h-0.5 mt-2 rounded-none" style={{ backgroundColor: accentColor1 }}></div>
            </div>

            {/* Content Layer 2: Main Subject */}
            <div className="z-10 text-left my-auto py-4">
              <motion.h4
                layout
                animate={{ 
                  color: textColor,
                }}
                style={{ 
                  fontSize: `${fontSize}px`, 
                  letterSpacing: `${letterSpacing}px`,
                  lineHeight: '1.15'
                }}
                className="font-extrabold tracking-tight drop-shadow-xs"
              >
                {text2 || 'Add your main header text line...'}
              </motion.h4>
            </div>

            {/* Content Layer 3: Call-To-Action / Footer */}
            <div className="z-10 pt-4 border-t border-dashed flex items-center justify-between" style={{ borderColor: `${secondaryColor}40` }}>
              <motion.span
                layout
                animate={{ color: secondaryColor }}
                className="text-[10px] sm:text-xs font-bold uppercase tracking-wider"
              >
                {text3 || 'GET TEMPLATE TODAY'}
              </motion.span>
              
              {/* Simulated brand circle decal */}
              <div 
                className="w-5 h-5 rounded-full flex items-center justify-center border-2"
                style={{ borderColor: accentColor1 }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor1 }}></div>
              </div>
            </div>
          </motion.div>

          {/* Action Row */}
          <div className="w-full max-w-[340px] mt-6 flex flex-col gap-3">
            <button
              onClick={handleDownloadDraft}
              className="w-full py-3 px-4 bg-white text-[#1A1A1A] font-bold border-2 border-white rounded-none text-sm transition-all hover:bg-neutral-100 flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_#7D42FB]"
              id="btn-download-draft"
            >
              <Download className="w-4 h-4 text-[#7D42FB]" />
              Download Draft Image (.JPG)
            </button>
            <p className="text-[10px] text-center text-neutral-400 leading-normal px-2">
              All styles edit dynamically. Download drafts instantly, or launch directly inside Canva to import premium ready-to-print vector files.
            </p>
          </div>

          {/* Success Dialog overlay */}
          <AnimatePresence>
            {exportSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 bg-[#FAF9F6] text-[#1A1A1A] flex flex-col items-center justify-center p-6 z-30"
              >
                <div className="w-16 h-16 rounded-full bg-[#7D42FB]/20 border border-[#1A1A1A] flex items-center justify-center text-[#7D42FB] mb-4 scale-up">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h4 className="font-display font-extrabold text-xl text-[#1A1A1A] mb-1">Custom Draft Ready!</h4>
                <p className="text-sm text-neutral-500 font-serif italic text-center max-w-sm mb-6">
                  Your customized style draft has been successfully exported. You can copy this mock configuration into your Canva workspace!
                </p>
                <button
                  onClick={() => onOpenInCanva(selectedTemplate)}
                  className="px-5 py-2.5 bg-[#7D42FB] hover:bg-[#6627eb] text-white text-xs font-bold border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] transition-all flex items-center gap-1.5"
                >
                  <FileEdit className="w-4 h-4" />
                  Open Design in Canva &rarr;
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
