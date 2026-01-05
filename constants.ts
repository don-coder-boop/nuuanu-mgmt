
import { Collection } from './types';

export const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: '25fw-id',
    name: '25FW Collection',
    logoUrl: 'https://picsum.photos/seed/brand/400/100',
    accessCodes: [
      { code: 'VIP25', limit: 3 },
      { code: 'FRIENDS', limit: 1 }
    ],
    descriptionTitle: '25FW: THE NEW ERA',
    descriptionBody: 'Exploring the boundaries of minimal architecture through wearable art. Our Fall/Winter 2025 collection focuses on structured silhouettes and sustainable materials.',
    lookbook: [
      { id: 'lb1', url: 'https://picsum.photos/seed/look1/800/1200', order: 0 },
      { id: 'lb2', url: 'https://picsum.photos/seed/look2/800/1200', order: 1 },
      { id: 'lb3', url: 'https://picsum.photos/seed/look3/800/1200', order: 2 },
      { id: 'lb4', url: 'https://picsum.photos/seed/look4/800/1200', order: 3 },
    ],
    products: [
      {
        id: 'p1',
        name: 'Structured Wool Coat',
        price: 450000,
        options: ['1', '2'],
        summary: 'A signature piece with architectural shoulders.',
        images: ['https://picsum.photos/seed/p1/600/900']
      },
      {
        id: 'p2',
        name: 'Silk Blend Trousers',
        price: 280000,
        options: ['S', 'M', 'L'],
        summary: 'Flowy and elegant for every occasion.',
        images: ['https://picsum.photos/seed/p2/600/900']
      }
    ],
    orders: []
  }
];
