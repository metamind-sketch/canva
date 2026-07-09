import instagramImg from '../assets/images/instagram_template_1783569387924.jpg';
import ebookImg from '../assets/images/ebook_template_1783569402489.jpg';
import presentationImg from '../assets/images/presentation_template_1783569416376.jpg';
import brandImg from '../assets/images/brand_template_1783569432613.jpg';

import { CanvaTemplate } from '../types';

export const TEMPLATES_DATA: CanvaTemplate[] = [
  {
    id: 'temp-1',
    title: 'Aura Minimalist Instagram Pack',
    category: 'social',
    categoryLabel: 'Social Media',
    image: instagramImg,
    pagesCount: 15,
    price: 14,
    rating: 4.9,
    reviewsCount: 124,
    isBestSeller: true,
    features: [
      '15 Unique Instagram Post Templates (1080x1080px)',
      'Aesthetic beige & cream tones with elegant photography frames',
      'Perfect for fashion, interior design, lifestyle, and beauty brands',
      'Fully customizable text, typography, layout, and colors',
      'Free Canva fonts used exclusively — no premium subscription required'
    ],
    colors: ['#F5EBE6', '#D6C5B3', '#8C7B6E', '#1A1A1A'],
    tags: ['Instagram', 'Minimalist', 'Aesthetic', 'Social Media'],
    mockText1: 'ELEGANT FASHION',
    mockText2: 'Discover the Autumn Collection 2026',
    mockText3: 'SHOP THE COUTURE',
    canvaLink: 'https://www.canva.com'
  },
  {
    id: 'temp-2',
    title: 'Mindful Living Wellness E-Book',
    category: 'ebook',
    categoryLabel: 'E-Books & Lead Magnets',
    image: ebookImg,
    pagesCount: 30,
    price: 19,
    rating: 5.0,
    reviewsCount: 88,
    isNew: true,
    features: [
      '30 Curated Pages of layouts (Cover, Intro, Chapter, Recipe, Worksheet, Call-To-Action)',
      'Nurturing sage green and earthy linen color palette',
      'Tailored for life coaches, therapists, health advocates, and wellness creators',
      'Clean editorial grid systems and high-legibility typographic hierarchy',
      'Drag-and-drop placeholder grids for images and vector decals'
    ],
    colors: ['#E6ECE6', '#C1D3C1', '#5B6E5B', '#222222'],
    tags: ['E-Book', 'Wellness', 'Lead Magnet', 'Editorial'],
    mockText1: 'MINDFUL LIVING',
    mockText2: 'A Comprehensive 30-Day Guide to Inner Silence',
    mockText3: 'BY HELENA VANCE',
    canvaLink: 'https://www.canva.com'
  },
  {
    id: 'temp-3',
    title: 'Elevate Startup Pitch Deck',
    category: 'presentation',
    categoryLabel: 'Presentations',
    image: presentationImg,
    pagesCount: 20,
    price: 24,
    rating: 4.8,
    reviewsCount: 62,
    isBestSeller: true,
    features: [
      '20 High-impact presentation slides (16:9 Full HD widescreen)',
      'Electric tech theme combining deep obsidian slate with vivid cyber blue',
      'Structured slide flows: Problem, Solution, Market Size, Traction, financials, and Ask',
      'Pre-rendered custom infographic charts, mockups, and timelines',
      'Interactive master slides for fast brand personalization'
    ],
    colors: ['#0A0B10', '#1F3B68', '#407BFF', '#EBF1FF'],
    tags: ['Pitch Deck', 'Business', 'Startup', 'Keynote'],
    mockText1: 'ELEVATE TECH',
    mockText2: 'Redefining Scalable Data Architecture for Web3',
    mockText3: 'SERIES A FUNDING PITCH',
    canvaLink: 'https://www.canva.com'
  },
  {
    id: 'temp-4',
    title: 'Swiss-Modern Brand & Flyer Kit',
    category: 'brand',
    categoryLabel: 'Brand Identity',
    image: brandImg,
    pagesCount: 12,
    price: 18,
    rating: 4.9,
    reviewsCount: 45,
    features: [
      '12 Professional swiss-modern brand board templates and digital flyer cards',
      'High contrast design using sleek primary tones with royal cobalt accent',
      'Perfect for architect bureaus, digital design studios, and corporate agencies',
      'Strict geometric grid hierarchy that focuses on typographic strength',
      'Includes corporate letterheads, brand color sheets, and typographic pairing charts'
    ],
    colors: ['#0F172A', '#2563EB', '#F8FAFC', '#94A3B8'],
    tags: ['Swiss Design', 'Brand Identity', 'Corporate', 'Flyer'],
    mockText1: 'MODERN STUDIO',
    mockText2: 'Structural Rigor and Aesthetic Simplicity',
    mockText3: 'ESTABLISHED 2026',
    canvaLink: 'https://www.canva.com'
  },
  {
    id: 'temp-5',
    title: 'Bold Editorial Instagram Stories',
    category: 'social',
    categoryLabel: 'Social Media',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80',
    pagesCount: 12,
    price: 12,
    rating: 4.7,
    reviewsCount: 31,
    features: [
      '12 High-Energy Instagram Story templates (1080x1920px)',
      'Vibrant tangerine orange and high-impact onyx typography',
      'Ideal for retail, podcasters, music promoters, and youth culture hubs',
      'Bold typographic overlays and call-to-actions that drive link clicks',
      'Optimized for fast mobile reading and engagement rates'
    ],
    colors: ['#FF5A36', '#121212', '#F4F4F6', '#FFFFFF'],
    tags: ['Stories', 'Bold', 'Instagram', 'Typography'],
    mockText1: 'LOUD & CLEAR',
    mockText2: 'New Podcast Episode with Design Visionaries',
    mockText3: 'LISTEN NOW',
    canvaLink: 'https://www.canva.com'
  },
  {
    id: 'temp-6',
    title: 'The Solopreneur Ultimate Media Kit',
    category: 'brand',
    categoryLabel: 'Brand Identity',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
    pagesCount: 8,
    price: 16,
    rating: 4.9,
    reviewsCount: 57,
    isNew: true,
    features: [
      '8 Professional Media Kit & Sponsorship deck pages',
      'Chic charcoal black and champagne gold branding accents',
      'Includes About Me, Audience Demographics, Packages & Pricing, and Case Studies',
      'Saves dozens of hours in pitching to brand agencies and sponsors',
      'Sleek tables, visual stats layouts, and customizable brand statement modules'
    ],
    colors: ['#1E1E1E', '#DFBA73', '#FAF7F0', '#888888'],
    tags: ['Media Kit', 'Sponsorship', 'Solopreneur', 'Sleek'],
    mockText1: 'CREATIVE LABS',
    mockText2: 'Digital Creator and Lifestyle Enthusiast Kit',
    mockText3: 'COLLABORATE WITH ME',
    canvaLink: 'https://www.canva.com'
  }
];
