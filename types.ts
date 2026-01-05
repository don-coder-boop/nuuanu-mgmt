
export interface Product {
  id: string;
  name: string;
  price: number;
  options: string[]; // e.g. ["1", "2"]
  summary: string;
  images: string[];
}

export interface LookbookItem {
  id: string;
  url: string;
  order: number;
}

export interface AccessCodeConfig {
  code: string;
  limit: number;
}

export interface Order {
  id: string;
  status: 'Preparing' | 'Shipped';
  date: string;
  instagramId: string;
  name: string;
  phone: string;
  address: string;
  message?: string;
  additionalRequest?: string;
  productName: string;
  size: string;
  adminMemo?: string;
  shippedDate?: string;
}

export interface Collection {
  id: string;
  name: string;
  logoUrl?: string;
  accessCodes: AccessCodeConfig[];
  descriptionTitle: string;
  descriptionBody: string;
  lookbook: LookbookItem[];
  products: Product[];
  orders: Order[];
}

export type AdminTab = 'Settings' | 'Products' | 'Shipping' | 'Report';
