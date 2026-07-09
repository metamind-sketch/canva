import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Search, 
  Sparkles, 
  Layers, 
  HelpCircle, 
  Check, 
  ArrowRight, 
  ChevronDown, 
  ShieldCheck, 
  Clock, 
  SlidersHorizontal,
  Mail,
  CreditCard,
  User,
  Heart,
  Github,
  Star,
  RefreshCw,
  ShoppingBagIcon,
  Trash2,
  Lock,
  MousePointerClick,
  Facebook,
  Instagram
} from 'lucide-react';

import { CanvaTemplate, CartItem } from './types';
import { TEMPLATES_DATA } from './data/templates';
import TemplateCard from './components/TemplateCard';
import LiveCustomizer from './components/LiveCustomizer';
import PreviewDrawer from './components/PreviewDrawer';
import BundleBuilder from './components/BundleBuilder';
import FaqSection from './components/FaqSection';
import LivePurchaseNotification from './components/LivePurchaseNotification';

export default function App() {
  // Countdown timer for Offer
  const [timeLeft, setTimeLeft] = useState(415); // 6 minutes 55 seconds (415 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 415));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Storefront Browse state
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('default');
  
  // Interactive Customizer Sync
  const [customizerTemplate, setCustomizerTemplate] = useState<CanvaTemplate>(TEMPLATES_DATA[0]);
  
  // Detail preview drawer sync
  const [previewTemplate, setPreviewTemplate] = useState<CanvaTemplate | null>(null);

  // Cart & Checkout state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'idle' | 'form' | 'processing' | 'success'>('idle');
  
  // Checkout Form state
  const [email, setEmail] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Stats / Hearts
  const [savedCount, setSavedCount] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Monitor Scroll Progress for Floating Navbar
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(window.scrollY / totalScroll);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter and Sort Logic
  const filteredTemplates = TEMPLATES_DATA.filter((template) => {
    const matchesFilter = activeFilter === 'all' || template.category === activeFilter;
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          template.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // default order
  });

  // Cart Operations
  const handleAddToCart = (template: CanvaTemplate) => {
    const existingIndex = cart.findIndex(item => item.template.id === template.id);
    if (existingIndex > -1) {
      // already in cart, don't duplicate
      setIsCartOpen(true);
      return;
    }
    setCart([...cart, { template, quantity: 1 }]);
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(cart.filter(item => item.template.id !== id));
  };

  const handleBundleCheckout = (selectedIds: string[], totalPrice: number) => {
    const bundleItems = TEMPLATES_DATA.filter(t => selectedIds.includes(t.id));
    const newCartItems = bundleItems.map(t => ({ template: t, quantity: 1 }));
    
    // Add only items not already in cart
    const filteredNewItems = newCartItems.filter(
      newItem => !cart.some(cartItem => cartItem.template.id === newItem.template.id)
    );

    setCart([...cart, ...filteredNewItems]);
    setIsCartOpen(true);
  };

  // Checkout Validation & Payment Simulation
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};
    
    if (!email) errors.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Please enter a valid email address';
    
    if (!cardName) errors.cardName = 'Name on card is required';
    if (!cardNumber || cardNumber.length < 16) errors.cardNumber = 'Valid 16-digit card number is required';
    if (!cardExpiry) errors.cardExpiry = 'Expiry date (MM/YY) is required';
    if (!cardCvv || cardCvv.length < 3) errors.cardCvv = 'CVV is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setCheckoutStep('processing');
    
    // Simulate payment loading
    setTimeout(() => {
      setCheckoutStep('success');
    }, 2500);
  };

  const handleCloseSuccessModal = () => {
    setCheckoutStep('idle');
    setCart([]);
    setIsCartOpen(false);
    setEmail('');
    setCardName('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.template.price, 0);
  // Apply a progressive bundle discount in cart if they buy multiple
  let cartDiscountPercentage = 0;
  if (cart.length === 2) cartDiscountPercentage = 15;
  else if (cart.length === 3) cartDiscountPercentage = 30;
  else if (cart.length >= 4) cartDiscountPercentage = 40;

  const cartDiscountAmount = Math.round(cartSubtotal * (cartDiscountPercentage / 100));
  const cartTotal = cartSubtotal - cartDiscountAmount;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] selection:bg-[#7D42FB]/25 selection:text-black font-sans" id="marketplace-landing-root">
      {/* Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 right-0 h-1.5 bg-[#7D42FB] origin-left z-50 transition-transform duration-75"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />

      {/* Modern Floating Header Navbar */}
      <header className="sticky top-0 left-0 right-0 z-40 bg-[#FAF9F6] border-b-2 border-[#1A1A1A] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 h-10 sm:h-12 flex items-center justify-center gap-2 flex-row flex-nowrap overflow-hidden">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider whitespace-nowrap">
            <span className="text-[#6B7280]">🔥 Limited Time Offer: </span>
            <span className="text-[#7C3AED]">75% OFF </span>
            <span className="text-[#EF4444]">Ends Soon</span>
          </span>
          <span className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 bg-[#7D42FB] text-white border border-[#1A1A1A] font-mono font-black text-[10px] sm:text-xs shadow-[1.5px_1.5px_0px_0px_#1A1A1A] shrink-0 whitespace-nowrap">
            {formatTime(timeLeft)}
          </span>
        </div>
      </header>

      {/* Hero Block (Visual storytelling) */}
      <section className="relative overflow-hidden pt-12 pb-24 sm:pt-20 lg:pt-28" id="hero">
        {/* Canva-inspired grid paper pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#1A1A1A_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.05] pointer-events-none z-0" />

        {/* Canva pink auto-alignment guidelines */}
        <div className="absolute top-[32%] left-0 right-0 h-[1.5px] border-t border-dashed border-pink-400/30 pointer-events-none z-0 hidden md:block" />
        <div className="absolute left-[38%] top-0 bottom-0 w-[1.5px] border-l border-dashed border-pink-400/30 pointer-events-none z-0 hidden md:block" />
        <div className="absolute right-[32%] top-0 bottom-0 w-[1.5px] border-l border-dashed border-pink-400/30 pointer-events-none z-0 hidden md:block" />

        {/* Abstract solid aesthetic background gradient shapes */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#7D42FB]/5 blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-[10%] left-[8%] w-[250px] h-[250px] rounded-full bg-[#00c4cc]/5 blur-2xl pointer-events-none z-0" />

        {/* Canva Style Selection Box over a decorative shape */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute right-[4%] top-[14%] hidden xl:block z-0 pointer-events-none"
        >
          <div className="relative p-3.5 bg-white border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#7D42FB] rounded-none">
            {/* Canva Turquoise Outline */}
            <div className="absolute -inset-1 border border-2 border-[#00c4cc] pointer-events-none">
              {/* Corner Resize Handles */}
              <div className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-white border-2 border-[#00c4cc]" />
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-white border-2 border-[#00c4cc]" />
              <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-white border-2 border-[#00c4cc]" />
              <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-full bg-white border-2 border-[#00c4cc]" />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#00c4cc]/15 flex items-center justify-center text-[#00c4cc]">
                <Sparkles className="w-3 h-3 fill-current" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#1A1A1A]">Canva Drag & Drop</span>
            </div>

            {/* Canva style rotation handle */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
              <div className="w-[1.5px] h-3 bg-[#00c4cc]" />
              <div className="w-5 h-5 rounded-full bg-white border-2 border-[#00c4cc] flex items-center justify-center shadow-xs">
                <svg className="w-2.5 h-2.5 text-[#00c4cc]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Canva Style Font Editor Floating Panel */}
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="absolute left-[3%] bottom-[14%] hidden xl:block z-0 pointer-events-none"
        >
          <div className="relative p-3 bg-white border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] w-52 rounded-none">
            {/* Canva Turquoise Outline */}
            <div className="absolute -inset-1 border border-2 border-[#00c4cc] pointer-events-none">
              <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-[#00c4cc]" />
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-[#00c4cc]" />
              <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-[#00c4cc]" />
              <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-[#00c4cc]" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between border-b-2 border-neutral-100 pb-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#1A1A1A]">Montserrat Black</span>
                <span className="text-[10px] font-mono font-bold text-neutral-400 bg-neutral-100 px-1 py-0.5">36px</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  <span className="w-5 h-5 border border-neutral-300 bg-neutral-50 text-[10px] font-extrabold flex items-center justify-center">B</span>
                  <span className="w-5 h-5 border border-neutral-300 bg-neutral-50 text-[10px] italic flex items-center justify-center">I</span>
                  <span className="w-5 h-5 border border-neutral-300 bg-[#7D42FB]/10 text-[#7D42FB] text-[10px] underline flex items-center justify-center">U</span>
                </div>
                <div className="flex gap-1">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#7D42FB] border border-[#1A1A1A] shadow-[1px_1px_0px_0px_rgba(0,0,0,0.15)]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#00c4cc] border border-[#1A1A1A]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#FFD166] border border-[#1A1A1A]" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Canva mouse cursor click indicator */}
        <motion.div
          animate={{ 
            x: [0, 8, 0],
            y: [0, -8, 0]
          }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute right-[12%] top-[34%] hidden xl:block z-10 pointer-events-none"
        >
          <div className="flex items-center gap-1">
            <MousePointerClick className="w-5 h-5 text-[#00c4cc] fill-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.15)] stroke-[2.5]" />
            <span className="bg-[#00c4cc] text-white font-mono font-bold text-[9px] px-1 py-0.5 rounded shadow-[1px_1px_2px_rgba(0,0,0,0.15)]">
              Editor_01
            </span>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline copy */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left" style={{ marginTop: '1px' }}>
              <motion.span 
                animate={{ 
                  y: [0, -3, 0],
                  boxShadow: ["2px 2px 0px 0px #1A1A1A", "4px 4px 0px 0px #7D42FB", "2px 2px 0px 0px #1A1A1A"]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 4, 
                  ease: "easeInOut" 
                }}
                whileHover={{ scale: 1.05, rotate: -1 }}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] text-[10px] font-black uppercase tracking-wider select-none cursor-default"
              >
                ⭐ PREMIUM CANVA TEMPLATE KITS ⭐
              </motion.span>

              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#1A1A1A] tracking-tight leading-[1.1]">
                <span className="bg-[#00c4cc] text-white px-3 py-1 border-2 border-[#1A1A1A] inline-block shadow-[3px_3px_0px_0px_#1A1A1A] mr-2 mb-2 rotate-[-1.5deg]">
                  Canva Pro
                </span>{' '}
                <span className="text-[#7D42FB] inline-block">Tamil Course</span>{' '}
                <span className="inline-block text-xl sm:text-2xl lg:text-3xl text-neutral-800 font-bold uppercase tracking-wider ml-2">
                  Premium Subscription
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-neutral-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans font-medium">
                Master Canva from Beginner to Advanced with Easy Tamil Lessons. Get Lifetime Access, HD Recorded Classes, Exclusive Bonuses, Premium Resources & Real-World Projects – All in One Course.
              </p>

              {/* Action Buttons with retro neo-brutalist style */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#storefront"
                  className="w-full sm:w-auto py-3.5 px-6 bg-[#7D42FB] hover:bg-[#00c4cc] text-white hover:text-[#1A1A1A] font-black uppercase tracking-widest text-xs transition-all duration-200 rounded-xl flex items-center justify-center gap-2 cursor-pointer border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] hover:shadow-[2px_2px_0px_0px_#1A1A1A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#1A1A1A]"
                >
                  🚀 Enroll now ₹699
                </a>
                <div 
                  className="w-full sm:w-72 md:w-80 aspect-video bg-white border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] overflow-hidden shrink-0"
                  style={{ paddingBottom: '0px', paddingRight: '0px', paddingLeft: '0px', marginLeft: '1px', marginTop: '32px' }}
                >
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/bWeDQcQ-tew?autoplay=1&mute=1&playsinline=1&controls=1"
                    title="Course Preview Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* What Makes This Course Special? with animation */}
              <div className="pt-6 border-t-2 border-dashed border-[#1A1A1A] space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center lg:text-left"
                  style={{ marginTop: '15px' }}
                >
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#7D42FB]/10 text-[#7D42FB] border border-[#7D42FB] text-[11px] font-black uppercase tracking-widest rounded-sm mb-1">
                    ✨ What Makes This Course Special?
                  </span>
                </motion.div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { text: "Beginner Friendly" },
                    { text: "100% Tamil language" },
                    { text: "Step-by-Step explain" },
                    { text: "Professional Designs" },
                    { text: "Real Project Practice" },
                    { text: "Mobile&Desktop Access" }
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                      whileHover={{ 
                        scale: 1.03, 
                      }}
                      className="p-2.5 bg-[#7D42FB]/5 hover:bg-[#7D42FB]/10 text-[#1A1A1A] text-left transition-all duration-200 cursor-default flex items-center gap-1.5 group rounded-lg"
                    >
                      <span className="text-emerald-500 font-bold shrink-0 text-xs sm:text-sm group-hover:scale-125 transition-transform duration-200">
                        ✅
                      </span>
                      <span className="text-[9px] sm:text-[10px] md:text-[11px] font-extrabold uppercase tracking-wide text-neutral-800 leading-tight">
                        {item.text}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Master Canva Curriculum */}
                <div className="mt-8 pt-6 border-t-2 border-dashed border-[#1A1A1A] space-y-4" style={{ marginLeft: '2px', marginTop: '64px' }}>
                  <div className="space-y-1">
                    <h3 className="font-display font-black text-xl sm:text-2xl text-neutral-900 tracking-tight uppercase leading-none">
                      Master Canva Curriculum
                    </h3>
                    <p className="text-neutral-500 text-[11px] sm:text-xs leading-relaxed font-sans font-medium">
                      Everything You Need to Become a Canva Pro – Top Attractions Included!
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
                    {[
                      {
                        badge: "GRAPHIC DESIGN",
                        title: "Canva Foundation",
                        price: "₹699",
                        desc: "Master Canva Basics, Pro features, and AI tools to create professional designs with ease.",
                        topics: ["Canva Basics", "Canva Pro", "Canva AI"],
                        rating: "4.9/5.0",
                        accentColor: "#00c4cc",
                        hoverShadow: "hover:shadow-[6px_6px_0px_0px_#00c4cc]",
                        hoverBorder: "hover:border-[#00c4cc]"
                      },
                      {
                        badge: "DESIGN MASTERY",
                        title: "Design Mastery",
                        price: "₹699",
                        desc: "Create stunning social media, marketing, and business designs for every platform and brand.",
                        topics: ["Social Media Design", "Marketing Design", "Business Design"],
                        rating: "4.9/5.0",
                        accentColor: "#7D42FB",
                        hoverShadow: "hover:shadow-[6px_6px_0px_0px_#7D42FB]",
                        hoverBorder: "hover:border-[#7D42FB]"
                      },
                      {
                        badge: "ADVANCED SKILLS",
                        title: "Advanced Skills",
                        price: "₹699",
                        desc: "Build advanced design skills with presentations, video editing, and freelancing strategies.",
                        topics: ["Presentation Design", "Video Editing", "Freelancing"],
                        rating: "5.0/5.0",
                        accentColor: "#00c4cc",
                        hoverShadow: "hover:shadow-[6px_6px_0px_0px_#00c4cc]",
                        hoverBorder: "hover:border-[#00c4cc]"
                      },
                      {
                        badge: "CREATION ROADMAP",
                        title: "What You Can Create After This Course",
                        price: "₹699",
                        desc: "Gain the ultimate toolkit to bring any design idea to life across various platforms.",
                        topics: [
                          "Social Media Posts",
                          "Posters",
                          "Business Cards",
                          "Logos",
                          "Presentations",
                          "Certificates",
                          "Product Catalogues",
                          "YouTube Thumbnails",
                          "Instagram Reels Covers",
                          "Marketing Creatives",
                          "Business Branding Materials",
                          "Flyers"
                        ],
                        rating: "4.9/5.0",
                        accentColor: "#7D42FB",
                        hoverShadow: "hover:shadow-[6px_6px_0px_0px_#7D42FB]",
                        hoverBorder: "hover:border-[#7D42FB]"
                      }
                    ].map((course, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ y: -5, scale: 1.015 }}
                        animate={{
                          background: [
                            "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)",
                            "linear-gradient(135deg, #EDE9FE 0%, #E9D5FF 100%)",
                            "linear-gradient(135deg, #E9D5FF 0%, #F5F3FF 100%)",
                            "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)"
                          ]
                        }}
                        transition={{
                          y: { duration: 0.2 },
                          scale: { duration: 0.2 },
                          background: { duration: 8, repeat: Infinity, ease: "linear" }
                        }}
                        className="p-6 rounded-2xl text-left flex flex-col justify-between border-2 border-violet-200 shadow-[0_10px_30px_rgba(125,66,251,0.08)] hover:border-violet-300 transition-all duration-300"
                      >
                        <div className="flex flex-col justify-between h-full">
                          <div>
                            {/* Top row with Canva Pro Badge (Left) and Active Now (Right) */}
                            <div className="flex items-center justify-between mb-2.5">
                              <span className="bg-[#00c4cc] text-white px-2 py-0.5 border border-[#1A1A1A] inline-block shadow-[1.5px_1.5px_0px_0px_#1A1A1A] rotate-[-1deg] text-[8px] font-black uppercase tracking-wider rounded-sm select-none">
                                Canva Pro
                              </span>
                              {idx !== 3 && (
                                <div className="flex items-center gap-1.5">
                                  <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                  </span>
                                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                    Active Now
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Title Row */}
                            <div className="flex justify-between items-baseline mt-1 gap-2">
                              <h4 className={idx === 3 
                                ? "font-sans font-extrabold text-[#7D42FB] leading-tight normal-case tracking-tight text-base sm:text-lg"
                                : "font-display font-black text-[#7D42FB] leading-tight uppercase tracking-tight text-base sm:text-lg line-clamp-1"
                              }>
                                {course.title}
                              </h4>
                            </div>

                            {/* Description */}
                            <p className="text-neutral-700 text-[11px] sm:text-xs leading-relaxed mt-3 line-clamp-3 font-medium">
                              {course.desc}
                            </p>

                            {/* Topics List with Attractive Colored Checkmarks */}
                            <div className={idx === 3 ? "grid grid-cols-2 gap-x-3 gap-y-1.5 mt-4" : "space-y-1.5 mt-4"}>
                              {course.topics.map((topic, tIdx) => (
                                <motion.div 
                                  key={tIdx} 
                                  whileHover={{ scale: 1.03, x: 2 }}
                                  transition={{ duration: 0.15 }}
                                  className={`flex items-center gap-1.5 text-neutral-800 text-[11px] sm:text-xs ${
                                    idx === 3 ? "font-bold normal-case" : "font-extrabold uppercase"
                                  }`}
                                >
                                  <span 
                                    className="text-xs font-black shrink-0 text-[#FF477E]"
                                  >
                                    ✓
                                  </span>
                                  <span className={`truncate ${idx === 3 ? "text-neutral-800 font-medium" : "text-neutral-900 font-extrabold"}`} title={topic}>{topic}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          <div className="mt-auto">
                            {/* Divider */}
                            <div className="border-t-2 border-dashed border-violet-300 my-3" />

                            {/* Footer with Lifetime Access centered */}
                            <div className="flex flex-col items-center gap-2 text-xs sm:text-sm font-sans">
                              <span className="w-full max-w-[200px] text-center bg-[#00c4cc] text-white font-black uppercase text-[10px] sm:text-xs tracking-widest py-2 px-4 border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] rounded">
                                ⭐ LIFETIME ACCESS ⭐
                              </span>
                            </div>

                            {/* Bottom CTA Button */}
                            <button
                              onClick={() => {
                                const target = document.getElementById('storefront');
                                if (target) target.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="w-full py-3.5 bg-[#7D42FB] hover:bg-[#00c4cc] text-white hover:text-[#1A1A1A] font-black uppercase tracking-widest text-[10px] sm:text-xs border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] hover:shadow-[2px_2px_0px_0px_#1A1A1A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#1A1A1A] transition-all duration-200 rounded-xl mt-5 cursor-pointer"
                            >
                              {idx === 3 ? "🚀 ENROLL NOW" : `🚀 ENROLL NOW - ${course.price}`}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Special Offer Conversion Card */}
            <motion.div
              animate={{
                background: [
                  "linear-gradient(135deg, #FFFFFF 0%, #F5F3FF 100%)",
                  "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)",
                  "linear-gradient(135deg, #EDE9FE 0%, #FFFFFF 100%)",
                  "linear-gradient(135deg, #FFFFFF 0%, #F5F3FF 100%)"
                ]
              }}
              transition={{
                background: { duration: 10, repeat: Infinity, ease: "linear" }
              }}
              className="lg:col-span-6 relative flex flex-col justify-center min-h-[380px] sm:min-h-[460px] border-4 border-[#1A1A1A] shadow-[12px_12px_0px_0px_#7D42FB] p-6 sm:p-8 z-10 rounded-2xl"
            >
              {/* Badges / Corner Graphics */}
              <div className="absolute -top-4 -right-4 bg-[#00c4cc] text-[#1A1A1A] border-2 border-[#1A1A1A] font-black text-xs px-3 py-1 uppercase tracking-wider shadow-[3px_3px_0px_0px_#1A1A1A] -rotate-3 hover:rotate-0 transition-transform duration-200">
                ⭐ BEST SELLER
              </div>

              <div className="space-y-6">
                <div className="text-center sm:text-left space-y-2">
                  <div className="inline-block bg-[#FF477E]/10 text-[#FF477E] border border-[#FF477E] px-2 py-0.5 rounded-sm text-[10px] font-black uppercase tracking-widest">
                    ⚡ Exclusive Offer
                  </div>
                  <h3 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-neutral-900 tracking-tight uppercase leading-none">
                    Master Canva Pro Today
                  </h3>
                  <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed font-serif italic">
                    Start designing premium assets immediately with no prior design skills.
                  </p>
                </div>


                {/* Below the marquee: "🚀 Enroll now ₹699" CTA */}
                <div className="space-y-4 pt-2">
                  <motion.a
                    href="#storefront"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 px-8 bg-[#7D42FB] hover:bg-[#00c4cc] text-white hover:text-[#1A1A1A] font-black uppercase tracking-widest text-sm sm:text-base transition-all duration-200 rounded-xl flex items-center justify-center gap-3.5 cursor-pointer border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] hover:shadow-[2px_2px_0px_0px_#1A1A1A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#1A1A1A] text-center"
                  >
                    🚀 Enroll now ₹699
                  </motion.a>
                  
                  {/* Subtle details under the button */}
                  <div className="flex flex-wrap justify-center sm:justify-between items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    <span className="flex items-center gap-1">
                      🔒 SECURE CHECKOUT
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-1 text-[#FF477E]">
                      ⏳ {timeLeft}s LEFT
                    </span>
                  </div>
                </div>

                {/* Quick trust bullet points */}
                <div className="border-t-2 border-[#1A1A1A] pt-4 grid grid-cols-2 gap-2 text-[10px] sm:text-xs font-bold uppercase text-neutral-700">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-1.5"
                  >
                    <span className="text-sm">🎁</span>
                    <span>Bonus Included</span>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-1.5"
                  >
                    <span className="text-sm">🔓</span>
                    <span>Lifetime Access</span>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-1.5"
                  >
                    <span className="text-sm">📹</span>
                    <span>100% Recorded Course</span>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-1.5"
                  >
                    <span className="text-sm">💎</span>
                    <span>Premium Resources</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-24 bg-white border-t border-neutral-100 relative z-10" id="faqs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-mono font-bold text-[#7D42FB] uppercase tracking-widest block">
              Knowledge Hub
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-neutral-900 tracking-tight">
              Frequently Answered Questions
            </h2>
            <p className="text-neutral-500 text-sm max-w-md mx-auto font-serif italic">
              Everything you need to know about setting up, customization, and commercial licensing rights.
            </p>
          </div>

          <FaqSection />
        </div>
      </section>

      {/* Sticky Bottom Bar CTA */}
      <footer className="bg-[#FAF9F6] text-neutral-800 py-16 border-t-2 border-[#1A1A1A] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b-2 border-dashed border-[#1A1A1A]">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-lg text-[#1A1A1A] tracking-tight">
                  Canva<span className="text-[#7D42FB] font-extrabold">Craft</span>
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold text-neutral-700 bg-white border border-neutral-300 px-3 py-1.5 shadow-[2px_2px_0px_0px_#1A1A1A] rounded-xl">
                <a href="https://facebook.com/metaminds098" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-[#7D42FB] transition-colors">
                  <Facebook className="w-4 h-4 text-[#1877F2]" /> metaminds098
                </a>
                <span className="text-neutral-300">|</span>
                <a href="https://instagram.com/metaminds_2026" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-[#7D42FB] transition-colors">
                  <Instagram className="w-4 h-4 text-[#E1306C]" /> metaminds_2026
                </a>
              </div>
            </div>
            
            <nav className="flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-wider text-neutral-700">
            </nav>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
            <p className="font-bold">&copy; 2026 CanvaCraft Marketplace. All Rights Reserved.</p>
            <div className="font-serif italic text-neutral-800 text-center md:text-right font-medium">
              Designed to help creators, freelancers, students, and businesses grow faster.
            </div>
          </div>
        </div>
      </footer>

      {/* Slide-over Right Details Drawer (using state) */}
      <AnimatePresence>
        {previewTemplate && (
          <PreviewDrawer
            template={previewTemplate}
            onClose={() => setPreviewTemplate(null)}
            onCustomize={(temp) => {
              setCustomizerTemplate(temp);
              const target = document.getElementById('simulator');
              if (target) target.scrollIntoView({ behavior: 'smooth' });
            }}
            onBuy={handleAddToCart}
          />
        )}
      </AnimatePresence>

      {/* Slide-over Right Shopping Cart / Stripe Payment Panel */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden" id="shopping-cart-sidebar">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
            />

            {/* Sidebar panel */}
            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-screen max-w-md bg-[#FAF9F6] border-l-2 border-[#1A1A1A] flex flex-col h-full shadow-[0px_0px_40px_rgba(0,0,0,0.15)]"
              >
                {/* Header */}
                <div className="px-6 py-5 border-b-2 border-[#1A1A1A] flex items-center justify-between bg-[#FAF9F6]">
                  <div className="flex items-center gap-2">
                    <ShoppingBagIcon className="w-5 h-5 text-[#7D42FB] stroke-[2.5]" />
                    <h3 className="font-display font-black text-lg text-[#1A1A1A] uppercase tracking-tight">Your Design Bag</h3>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-3 py-1 border-2 border-[#1A1A1A] bg-white hover:bg-neutral-100 text-xs font-bold uppercase transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                {/* Body (Conditional views) */}
                {checkoutStep === 'idle' || checkoutStep === 'form' ? (
                  <div className="flex-1 overflow-y-auto flex flex-col justify-between">
                    {/* Cart Items list */}
                    <div className="p-6 space-y-4">
                      {cart.length > 0 ? (
                        <>
                          <div className="flex justify-between items-center text-xs text-neutral-600 font-bold uppercase tracking-wider border-b-2 border-[#1A1A1A] pb-2">
                            <span>Selected Templates</span>
                            <span>Price</span>
                          </div>

                          <div className="space-y-3 max-h-[220px] overflow-y-auto custom-scrollbar">
                            {cart.map((item) => (
                              <div key={item.template.id} className="flex items-center justify-between gap-3 bg-white p-3 border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]">
                                <div className="flex items-center gap-3 min-w-0">
                                  <img src={item.template.image} alt={item.template.title} className="w-10 h-10 border border-[#1A1A1A] object-cover" referrerPolicy="no-referrer" />
                                  <div className="min-w-0">
                                    <h5 className="font-display font-bold text-xs text-neutral-900 truncate">{item.template.title}</h5>
                                    <span className="text-[10px] text-[#7D42FB] font-mono font-bold uppercase">100% Free Fonts</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-xs font-black font-display text-neutral-900">${item.template.price}</span>
                                  <button
                                    onClick={() => handleRemoveFromCart(item.template.id)}
                                    className="p-1 hover:text-rose-600 rounded text-neutral-500 transition-all cursor-pointer"
                                    title="Remove template"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Multi-item Bundle Savings Notification */}
                          {cart.length > 1 && (
                            <div className="p-3.5 bg-emerald-50 border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] text-xs text-emerald-900 space-y-1">
                              <p className="font-bold flex items-center gap-1 uppercase tracking-wide">
                                <Sparkles className="w-3.5 h-3.5 text-[#7D42FB] fill-current" />
                                Multi-Item discount applied!
                              </p>
                              <p className="text-neutral-700 font-serif italic leading-normal">
                                You qualified for {cartDiscountPercentage}% savings by purchasing {cart.length} template packs together!
                              </p>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-16 space-y-4">
                          <div className="w-16 h-16 border-2 border-[#1A1A1A] bg-white shadow-[3px_3px_0px_0px_#1A1A1A] flex items-center justify-center text-neutral-500 mx-auto">
                            <ShoppingBagIcon className="w-6 h-6 stroke-[2]" />
                          </div>
                          <div>
                            <h4 className="font-display font-black text-[#1A1A1A] text-sm uppercase">Your bag is empty!</h4>
                            <p className="text-xs text-neutral-500 font-serif italic mt-1">Explore template categories and find layouts.</p>
                          </div>
                          <button
                            onClick={() => { setIsCartOpen(false); }}
                            className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#7D42FB] border-2 border-[#1A1A1A] text-white text-xs font-bold uppercase shadow-[2px_2px_0px_0px_#7D42FB] transition-all cursor-pointer"
                          >
                            Explore Catalogue
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Cost summary & CTA / Form toggle */}
                    {cart.length > 0 && (
                      <div className="p-6 border-t-2 border-[#1A1A1A] bg-[#FAF9F6]">
                        {checkoutStep === 'idle' ? (
                          <div className="space-y-4">
                            <div className="space-y-2 text-xs font-bold">
                              <div className="flex justify-between text-neutral-600 uppercase">
                                <span>Cart Subtotal</span>
                                <span>${cartSubtotal}</span>
                              </div>
                              {cartDiscountAmount > 0 && (
                                <div className="flex justify-between text-emerald-700 uppercase">
                                  <span>Bundle Discount (-{cartDiscountPercentage}%)</span>
                                  <span>- ${cartDiscountAmount}</span>
                                </div>
                              )}
                              <div className="flex justify-between text-neutral-900 font-black text-sm pt-2 border-t-2 border-[#1A1A1A]">
                                <span>Order Total</span>
                                <span className="font-display text-base text-[#7D42FB]">${cartTotal}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => setCheckoutStep('form')}
                              className="w-full py-3.5 bg-[#1A1A1A] hover:bg-[#7D42FB] text-white border-2 border-[#1A1A1A] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_#7D42FB] transition-all cursor-pointer"
                              id="cart-checkout-btn"
                            >
                              <Lock className="w-4 h-4 text-white stroke-[2.5]" />
                              Proceed to Secure Payment
                            </button>
                          </div>
                        ) : (
                          /* Secure Stripe-like form */
                          <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                            <div className="flex items-center justify-between text-xs font-bold text-[#1A1A1A] border-b-2 border-dashed border-[#1A1A1A] pb-2 mb-3">
                              <span className="flex items-center gap-1 uppercase"><Lock className="w-3.5 h-3.5 text-[#7D42FB] stroke-[2.5]" /> Secure Stripe Checkout</span>
                              <span className="font-mono font-black">${cartTotal}</span>
                            </div>

                            <div className="space-y-3 text-xs">
                              <div>
                                <label className="block text-[#1A1A1A] font-bold uppercase tracking-wide text-[10px] mb-1">Email Delivery Address</label>
                                <div className="relative">
                                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                  <input
                                    type="email"
                                    placeholder="you@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 pr-3 py-2 bg-white border-2 border-[#1A1A1A] focus:outline-none focus:border-[#7D42FB] w-full font-bold"
                                  />
                                </div>
                                {formErrors.email && <p className="text-[10px] text-rose-500 font-bold mt-0.5">{formErrors.email}</p>}
                              </div>

                              <div>
                                <label className="block text-[#1A1A1A] font-bold uppercase tracking-wide text-[10px] mb-1">Cardholder Name</label>
                                <div className="relative">
                                  <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                  <input
                                    type="text"
                                    placeholder="Jane Doe"
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value)}
                                    className="pl-10 pr-3 py-2 bg-white border-2 border-[#1A1A1A] focus:outline-none focus:border-[#7D42FB] w-full font-bold"
                                  />
                                </div>
                                {formErrors.cardName && <p className="text-[10px] text-rose-500 font-bold mt-0.5">{formErrors.cardName}</p>}
                              </div>

                              <div>
                                <label className="block text-[#1A1A1A] font-bold uppercase tracking-wide text-[10px] mb-1">16-Digit Card Number</label>
                                <div className="relative">
                                  <CreditCard className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                  <input
                                    type="text"
                                    placeholder="4000 1234 5678 9010"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value.replace(/\s+/g, ''))}
                                    maxLength={16}
                                    className="pl-10 pr-3 py-2 bg-white border-2 border-[#1A1A1A] focus:outline-none focus:border-[#7D42FB] w-full font-bold"
                                  />
                                </div>
                                {formErrors.cardNumber && <p className="text-[10px] text-rose-500 font-bold mt-0.5">{formErrors.cardNumber}</p>}
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[#1A1A1A] font-bold uppercase tracking-wide text-[10px] mb-1">Expiry Date</label>
                                  <input
                                    type="text"
                                    placeholder="MM/YY"
                                    value={cardExpiry}
                                    onChange={(e) => setCardExpiry(e.target.value)}
                                    maxLength={5}
                                    className="px-3 py-2 bg-white border-2 border-[#1A1A1A] focus:outline-none focus:border-[#7D42FB] w-full font-bold"
                                  />
                                  {formErrors.cardExpiry && <p className="text-[10px] text-rose-500 font-bold mt-0.5">{formErrors.cardExpiry}</p>}
                                </div>
                                <div>
                                  <label className="block text-[#1A1A1A] font-bold uppercase tracking-wide text-[10px] mb-1">CVV / CVC</label>
                                  <input
                                    type="password"
                                    placeholder="***"
                                    value={cardCvv}
                                    onChange={(e) => setCardCvv(e.target.value)}
                                    maxLength={4}
                                    className="px-3 py-2 bg-white border-2 border-[#1A1A1A] focus:outline-none focus:border-[#7D42FB] w-full font-bold"
                                  />
                                  {formErrors.cardCvv && <p className="text-[10px] text-rose-500 font-bold mt-0.5">{formErrors.cardCvv}</p>}
                                </div>
                              </div>
                            </div>

                            <div className="pt-2 flex gap-2">
                              <button
                                type="button"
                                onClick={() => setCheckoutStep('idle')}
                                className="w-1/3 py-3 bg-white hover:bg-neutral-50 text-neutral-800 border-2 border-[#1A1A1A] text-xs font-bold uppercase transition-all cursor-pointer"
                              >
                                Back
                              </button>
                              <button
                                type="submit"
                                className="flex-1 py-3 bg-[#1A1A1A] hover:bg-[#7D42FB] text-white border-2 border-[#1A1A1A] text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#7D42FB] flex items-center justify-center gap-1.5 cursor-pointer"
                                id="payment-submit-btn"
                              >
                                <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                                Authorize ${cartTotal}
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    )}
                  </div>
                ) : checkoutStep === 'processing' ? (
                  /* Processing Payment spinner state */
                  <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4 text-center">
                    <div className="w-12 h-12 border-4 border-t-[#7D42FB] border-[#1A1A1A] animate-spin" />
                    <div>
                      <h4 className="font-display font-black text-[#1A1A1A] text-sm uppercase">Authorizing Transactions</h4>
                      <p className="text-xs text-neutral-500 mt-1 max-w-xs font-serif italic">Contacting credit card payment network. Please do not close or reload this drawer panel.</p>
                    </div>
                  </div>
                ) : (
                  /* Success checkout screen */
                  <div className="flex-1 flex flex-col justify-between p-6 overflow-y-auto custom-scrollbar">
                    <div className="text-center space-y-5 py-6">
                      <div className="w-16 h-16 border-2 border-[#1A1A1A] bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-[3px_3px_0px_0px_#1A1A1A] scale-up">
                        <Check className="w-8 h-8 stroke-[3]" />
                      </div>

                      <div>
                        <h4 className="font-display font-black text-xl text-[#1A1A1A] uppercase">Purchase Completed!</h4>
                        <p className="text-xs text-neutral-500 mt-1.5 font-serif italic">
                          A digital package with direct edit links has been delivered to <span className="font-bold text-neutral-800">{email}</span>.
                        </p>
                      </div>

                      {/* Direct copy template credentials cards */}
                      <div className="space-y-3 pt-4 text-left">
                        <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-wider block">Your active Canva links:</span>
                        {cart.map((item) => (
                          <div key={item.template.id} className="p-3 bg-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 min-w-0">
                              <img src={item.template.image} alt={item.template.title} className="w-8 h-8 border border-[#1A1A1A] object-cover" referrerPolicy="no-referrer" />
                              <h6 className="font-display font-bold text-xs text-neutral-800 truncate">{item.template.title}</h6>
                            </div>
                            <button
                              onClick={() => window.open(item.template.canvaLink, '_blank')}
                              className="px-3 py-1.5 bg-[#7D42FB] hover:bg-[#7D42FB]/90 border border-[#1A1A1A] text-white text-[10px] font-black uppercase tracking-wider shadow-[1px_1px_0px_0px_#1A1A1A] shrink-0 cursor-pointer"
                            >
                              Edit Link &rarr;
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 pt-6 border-t-2 border-[#1A1A1A] bg-[#FAF9F6]">
                      <div className="bg-amber-50 border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] p-3 text-xs text-amber-900 space-y-1">
                        <p className="font-bold uppercase tracking-wider flex items-center gap-1 text-[10px]">
                          <Clock className="w-3.5 h-3.5 stroke-[2]" /> Direct Access Note
                        </p>
                        <p className="text-neutral-700 leading-normal font-serif italic">
                          Bookmark these links or sign in to your Canva dashboard prior to importing to avoid layout syncing problems.
                        </p>
                      </div>

                      <button
                        onClick={handleCloseSuccessModal}
                        className="w-full py-3 bg-[#1A1A1A] hover:bg-[#7D42FB] border-2 border-[#1A1A1A] text-white text-xs font-bold uppercase shadow-[3px_3px_0px_0px_#7D42FB] cursor-pointer"
                        id="success-dismiss-btn"
                      >
                        Return to Market
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Live purchase notifications floating toast */}
      <LivePurchaseNotification />
    </div>
  );
}
