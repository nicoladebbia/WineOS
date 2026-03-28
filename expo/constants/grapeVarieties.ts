export const grapeVarieties: Record<string, string[]> = {
  Red: [
    'Cabernet Sauvignon',
    'Merlot',
    'Pinot Noir',
    'Syrah/Shiraz',
    'Sangiovese',
    'Nebbiolo',
    'Tempranillo',
    'Malbec',
    'Grenache/Garnacha',
    'Zinfandel',
    'Barbera',
    'Carmenère',
    'Mourvèdre',
    'Cabernet Franc',
    'Petite Sirah',
    'Primitivo',
    'Nero d\'Avola',
    'Aglianico',
    'Montepulciano',
    'Corvina',
    'Pinotage'
  ],
  White: [
    'Chardonnay',
    'Sauvignon Blanc',
    'Pinot Grigio/Pinot Gris',
    'Riesling',
    'Chenin Blanc',
    'Viognier',
    'Gewürztraminer',
    'Albariño',
    'Vermentino',
    'Grüner Veltliner',
    'Moscato/Muscat',
    'Torrontés',
    'Verdejo',
    'Fiano',
    'Verdicchio',
    'Trebbiano',
    'Sémillon',
    'Marsanne',
    'Roussanne',
    'Pinot Blanc'
  ],
  Sparkling: [
    'Chardonnay',
    'Pinot Noir',
    'Pinot Meunier',
    'Prosecco/Glera',
    'Lambrusco',
    'Cava Blend'
  ],
  Dessert: [
    'Moscato',
    'Sauternes Blend',
    'Ice Wine Varieties',
    'Port Varieties',
    'Vin Santo Blend'
  ],
  Rosé: [
    'Grenache',
    'Syrah',
    'Mourvèdre',
    'Sangiovese',
    'Pinot Noir',
    'Tempranillo'
  ],
  Fortified: [
    'Port Varieties',
    'Sherry Varieties',
    'Madeira Varieties',
    'Marsala Varieties'
  ]
};

export const allGrapeVarieties = [
  ...grapeVarieties.Red,
  ...grapeVarieties.White,
  ...grapeVarieties.Sparkling,
  ...grapeVarieties.Dessert
].sort();
