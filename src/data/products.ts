export interface Product {
  id: number;
  name: string;
  price: number;
  priceFormatted: string;
  category: string;
  image: string;
  description: string;
  sizes: string[];
}

export const products: Product[] = [
  { 
    id: 1, 
    name: 'Legging Core Flow', 
    price: 149.90, 
    priceFormatted: 'R$ 149,90', 
    category: 'Leggings', 
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80',
    description: 'A Legging Core Flow foi desenhada para acompanhar todos os seus movimentos. Com tecido de alta compressão e cós alto, oferece suporte e segurança para treinos de alto impacto. Zero transparência.',
    sizes: ['P', 'M', 'G', 'GG']
  },
  { 
    id: 2, 
    name: 'Top Sustentação Elite', 
    price: 89.90, 
    priceFormatted: 'R$ 89,90', 
    category: 'Tops', 
    image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&q=80',
    description: 'Top com bojo removível e alças cruzadas nas costas para máxima sustentação. Ideal para corrida e crossfit. O tecido respirável mantém você seca durante todo o treino.',
    sizes: ['P', 'M', 'G']
  },
  { 
    id: 3, 
    name: 'Jaqueta Corta-Vento', 
    price: 229.90, 
    priceFormatted: 'R$ 229,90', 
    category: 'Casacos', 
    image: 'https://images.unsplash.com/photo-1556817411-31ae72fa3ea8?w=800&q=80',
    description: 'Leve, estilosa e funcional. A Jaqueta Corta-Vento é perfeita para treinos ao ar livre e dias mais frios. Possui capuz ajustável e bolsos laterais com zíper.',
    sizes: ['P', 'M', 'G', 'GG']
  },
  { 
    id: 4, 
    name: 'Shorts Runner Pro', 
    price: 119.90, 
    priceFormatted: 'R$ 119,90', 
    category: 'Shorts', 
    image: 'https://images.unsplash.com/photo-1533681431008-959e980f673b?w=800&q=80',
    description: 'Shorts duplo com bermuda interna de compressão para evitar atrito. Tecido externo super leve com aberturas laterais para maior amplitude de movimento.',
    sizes: ['M', 'G', 'GG']
  },
  { 
    id: 5, 
    name: 'Conjunto Seamless Infinity', 
    price: 259.90, 
    priceFormatted: 'R$ 259,90', 
    category: 'Conjuntos', 
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    description: 'Conjunto sem costura que se adapta perfeitamente ao corpo como uma segunda pele. Valoriza as curvas e oferece liberdade total.',
    sizes: ['P', 'M']
  },
  { 
    id: 6, 
    name: 'Regata DryFit Essential', 
    price: 69.90, 
    priceFormatted: 'R$ 69,90', 
    category: 'Regatas', 
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&q=80',
    description: 'A clássica regata cavada para os dias mais quentes. Tecido com tecnologia de rápida absorção de suor.',
    sizes: ['P', 'M', 'G', 'GG']
  }
];
