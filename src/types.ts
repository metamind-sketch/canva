export interface CanvaTemplate {
  id: string;
  title: string;
  category: 'social' | 'ebook' | 'presentation' | 'brand';
  categoryLabel: string;
  image: string;
  pagesCount: number;
  price: number;
  rating: number;
  reviewsCount: number;
  isBestSeller?: boolean;
  isNew?: boolean;
  features: string[];
  colors: string[]; // default color palette hexes
  tags: string[];
  mockText1: string; // editable text field 1
  mockText2: string; // editable text field 2
  mockText3: string; // editable text field 3
  canvaLink: string;
}

export interface CartItem {
  template: CanvaTemplate;
  quantity: number;
}
