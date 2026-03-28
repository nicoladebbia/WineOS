import { WineTemplate } from '@/types/wineDatabase';

/**
 * BORDEAUX LEFT BANK - Part 1 of 6 (Wines 1-25)
 * Focus: Pauillac & Margaux First Growths, Top Second Growths
 * Updated: January 2025
 */

export const bordeauxLeftBankPart1: WineTemplate[] = [
  // PAUILLAC - FIRST GROWTHS
  {
    id: 'bordeaux-chateau-lafite-rothschild',
    name: 'Château Lafite Rothschild',
    type: 'Red',
    country: 'France',
    region: 'Bordeaux',
    subRegion: 'Pauillac',
    grapeVariety: 'Cabernet Sauvignon, Merlot, Cabernet Franc, Petit Verdot',
    classification: '1er Cru Classé',
    minVintage: 1868,
    avgPrice: 850,
    producers: ['Château Lafite Rothschild'],
    aliases: ['Lafite', 'Lafite Rothschild']
  },
  {
    id: 'bordeaux-chateau-latour',
    name: 'Château Latour',
    type: 'Red',
    country: 'France',
    region: 'Bordeaux',
    subRegion: 'Pauillac',
    grapeVariety: 'Cabernet Sauvignon, Merlot, Cabernet Franc, Petit Verdot',
    classification: '1er Cru Classé',
    minVintage: 1855,
    avgPrice: 950,
    producers: ['Château Latour'],
    aliases: ['Latour']
  },
  {
    id: 'bordeaux-chateau-mouton-rothschild',
    name: 'Château Mouton Rothschild',
    type: 'Red',
    country: 'France',
    region: 'Bordeaux',
    subRegion: 'Pauillac',
    grapeVariety: 'Cabernet Sauvignon, Merlot, Cabernet Franc, Petit Verdot',
    classification: '1er Cru Classé',
    minVintage: 1853,
    avgPrice: 900,
    producers: ['Château Mouton Rothschild'],
    aliases: ['Mouton', 'Mouton Rothschild']
  },
  
  // MARGAUX - FIRST GROWTH
  {
    id: 'bordeaux-chateau-margaux',
    name: 'Château Margaux',
    type: 'Red',
    country: 'France',
    region: 'Bordeaux',
    subRegion: 'Margaux',
    grapeVariety: 'Cabernet Sauvignon, Merlot, Cabernet Franc, Petit Verdot',
    classification: '1er Cru Classé',
    minVintage: 1815,
    avgPrice: 850,
    producers: ['Château Margaux'],
    aliases: ['Margaux']
  },
  
  // PAUILLAC - SECOND GROWTHS
  {
    id: 'bordeaux-chateau-pichon-longueville-baron',
    name: 'Château Pichon-Longueville Baron',
    type: 'Red',
    country: 'France',
    region: 'Bordeaux',
    subRegion: 'Pauillac',
    grapeVariety: 'Cabernet Sauvignon, Merlot, Cabernet Franc, Petit Verdot',
    classification: '2ème Cru Classé',
    minVintage: 1850,
    avgPrice: 180,
    producers: ['Château Pichon Baron'],
    aliases: ['Pichon Baron']
  },
  {
    id: 'bordeaux-chateau-pichon-longueville-comtesse-de-lalande',
    name: 'Château Pichon-Longueville Comtesse de Lalande',
    type: 'Red',
    country: 'France',
    region: 'Bordeaux',
    subRegion: 'Pauillac',
    grapeVariety: 'Cabernet Sauvignon, Merlot, Cabernet Franc, Petit Verdot',
    classification: '2ème Cru Classé',
    minVintage: 1850,
    avgPrice: 200,
    producers: ['Château Pichon Lalande'],
    aliases: ['Pichon Lalande', 'Pichon Comtesse']
  },
  
  // SAINT-JULIEN - SECOND GROWTHS
  {
    id: 'bordeaux-chateau-leoville-las-cases',
    name: 'Château Léoville Las Cases',
    type: 'Red',
    country: 'France',
    region: 'Bordeaux',
    subRegion: 'Saint-Julien',
    grapeVariety: 'Cabernet Sauvignon, Merlot, Cabernet Franc',
    classification: '2ème Cru Classé',
    minVintage: 1855,
    avgPrice: 280,
    producers: ['Château Léoville Las Cases'],
    aliases: ['Léoville Las Cases', 'LLC']
  },
  {
    id: 'bordeaux-chateau-leoville-poyferre',
    name: 'Château Léoville Poyferré',
    type: 'Red',
    country: 'France',
    region: 'Bordeaux',
    subRegion: 'Saint-Julien',
    grapeVariety: 'Cabernet Sauvignon, Merlot, Cabernet Franc, Petit Verdot',
    classification: '2ème Cru Classé',
    minVintage: 1855,
    avgPrice: 140,
    producers: ['Château Léoville Poyferré'],
    aliases: ['Léoville Poyferré']
  },
  {
    id: 'bordeaux-chateau-leoville-barton',
    name: 'Château Léoville Barton',
    type: 'Red',
    country: 'France',
    region: 'Bordeaux',
    subRegion: 'Saint-Julien',
    grapeVariety: 'Cabernet Sauvignon, Merlot, Cabernet Franc',
    classification: '2ème Cru Classé',
    minVintage: 1826,
    avgPrice: 130,
    producers: ['Château Léoville Barton'],
    aliases: ['Léoville Barton']
  },
  {
    id: 'bordeaux-chateau-ducru-beaucaillou',
    name: 'Château Ducru-Beaucaillou',
    type: 'Red',
    country: 'France',
    region: 'Bordeaux',
    subRegion: 'Saint-Julien',
    grapeVariety: 'Cabernet Sauvignon, Merlot',
    classification: '2ème Cru Classé',
    minVintage: 1855,
    avgPrice: 180,
    producers: ['Château Ducru-Beaucaillou'],
    aliases: ['Ducru-Beaucaillou', 'Ducru']
  },
  {
    id: 'bordeaux-chateau-gruaud-larose',
    name: 'Château Gruaud Larose',
    type: 'Red',
    country: 'France',
    region: 'Bordeaux',
    subRegion: 'Saint-Julien',
    grapeVariety: 'Cabernet Sauvignon, Merlot, Cabernet Franc, Petit Verdot',
    classification: '2ème Cru Classé',
    minVintage: 1855,
    avgPrice: 110,
    producers: ['Château Gruaud Larose'],
    aliases: ['Gruaud Larose']
  },
  
  // SAINT-ESTÈPHE - SECOND GROWTHS
  {
    id: 'bordeaux-chateau-cos-d-estournel',
    name: 'Château Cos d\'Estournel',
    type: 'Red',
    country: 'France',
    region: 'Bordeaux',
    subRegion: 'Saint-Estèphe',
    grapeVariety: 'Cabernet Sauvignon, Merlot, Cabernet Franc, Petit Verdot',
    classification: '2ème Cru Classé',
    minVintage: 1811,
    avgPrice: 200,
    producers: ['Château Cos d\'Estournel'],
    aliases: ['Cos d\'Estournel', 'Cos']
  },
  {
    id: 'bordeaux-chateau-montrose',
    name: 'Château Montrose',
    type: 'Red',
    country: 'France',
    region: 'Bordeaux',
    subRegion: 'Saint-Estèphe',
    grapeVariety: 'Cabernet Sauvignon, Merlot, Cabernet Franc, Petit Verdot',
    classification: '2ème Cru Classé',
    minVintage: 1855,
    avgPrice: 180,
    producers: ['Château Montrose'],
    aliases: ['Montrose']
  },
  
  // MARGAUX - SECOND GROWTHS
  {
    id: 'bordeaux-chateau-rauzan-segla',
    name: 'Château Rauzan-Ségla',
    type: 'Red',
    country: 'France',
    region: 'Bordeaux',
    subRegion: 'Margaux',
    grapeVariety: 'Cabernet Sauvignon, Merlot, Cabernet Franc, Petit Verdot',
    classification: '2ème Cru Classé',
    minVintage: 1661,
    avgPrice: 120,
    producers: ['Château Rauzan-Ségla'],
    aliases: ['Rauzan-Ségla']
  },
  {
    id: 'bordeaux-chateau-rauzan-gassies',
    name: 'Château Rauzan-Gassies',
    type: 'Red',
    country: 'France',
    region: 'Bordeaux',
    subRegion: 'Margaux',
    grapeVariety: 'Cabernet Sauvignon, Merlot, Cabernet Franc, Petit Verdot',
    classification: '2ème Cru Classé',
    minVintage: 1855,
    avgPrice: 85,
    producers: ['Château Rauzan-Gassies'],
    aliases: ['Rauzan-Gassies']
  },
  {
    id: 'bordeaux-chateau-lascombes',
    name: 'Château Lascombes',
    type: 'Red',
    country: 'France',
    region: 'Bordeaux',
    subRegion: 'Margaux',
    grapeVariety: 'Merlot, Cabernet Sauvignon, Petit Verdot',
    classification: '2ème Cru Classé',
    minVintage: 1855,
    avgPrice: 90,
    producers: ['Château Lascombes'],
    aliases: ['Lascombes']
  },
  {
    id: 'bordeaux-chateau-brane-cantenac',
    name: 'Château Brane-Cantenac',
    type: 'Red',
    country: 'France',
    region: 'Bordeaux',
    subRegion: 'Margaux',
    grapeVariety: 'Cabernet Sauvignon, Merlot, Cabernet Franc',
    classification: '2ème Cru Classé',
    minVintage: 1833,
    avgPrice: 95,
    producers: ['Château Brane-Cantenac'],
    aliases: ['Brane-Cantenac']
  },
  {
    id: 'bordeaux-chateau-durfort-vivens',
    name: 'Château Durfort-Vivens',
    type: 'Red',
    country: 'France',
    region: 'Bordeaux',
    subRegion: 'Margaux',
    grapeVariety: 'Cabernet Sauvignon, Merlot',
    classification: '2ème Cru Classé',
    minVintage: 1855,
    avgPrice: 75,
    producers: ['Château Durfort-Vivens'],
    aliases: ['Durfort-Vivens']
  },
  
  // MARGAUX - THIRD GROWTH (PREMIUM)
  {
    id: 'bordeaux-chateau-palmer',
    name: 'Château Palmer',
    type: 'Red',
    country: 'France',
    region: 'Bordeaux',
    subRegion: 'Margaux',
    grapeVariety: 'Cabernet Sauvignon, Merlot, Petit Verdot',
    classification: '3ème Cru Classé',
    minVintage: 1814,
    avgPrice: 240,
    producers: ['Château Palmer'],
    aliases: ['Palmer']
  },
  
  // SAINT-JULIEN - THIRD GROWTHS
  {
    id: 'bordeaux-chateau-lagrange',
    name: 'Château Lagrange',
    type: 'Red',
    country: 'France',
    region: 'Bordeaux',
    subRegion: 'Saint-Julien',
    grapeVariety: 'Cabernet Sauvignon, Merlot, Petit Verdot',
    classification: '3ème Cru Classé',
    minVintage: 1855,
    avgPrice: 85,
    producers: ['Château Lagrange'],
    aliases: ['Lagrange']
  },
  {
    id: 'bordeaux-chateau-langoa-barton',
    name: 'Château Langoa Barton',
    type: 'Red',
    country: 'France',
    region: 'Bordeaux',
    subRegion: 'Saint-Julien',
    grapeVariety: 'Cabernet Sauvignon, Merlot, Cabernet Franc',
    classification: '3ème Cru Classé',
    minVintage: 1826,
    avgPrice: 70,
    producers: ['Château Langoa Barton'],
    aliases: ['Langoa Barton']
  },
  
  // MARGAUX - THIRD GROWTHS
  {
    id: 'bordeaux-chateau-boyd-cantenac',
    name: 'Château Boyd-Cantenac',
    type: 'Red',
    country: 'France',
    region: 'Bordeaux',
    subRegion: 'Margaux',
    grapeVariety: 'Cabernet Sauvignon, Merlot, Cabernet Franc, Petit Verdot',
    classification: '3ème Cru Classé',
    minVintage: 1855,
    avgPrice: 65,
    producers: ['Château Boyd-Cantenac'],
    aliases: ['Boyd-Cantenac']
  },
  {
    id: 'bordeaux-chateau-cantenac-brown',
    name: 'Château Cantenac Brown',
    type: 'Red',
    country: 'France',
    region: 'Bordeaux',
    subRegion: 'Margaux',
    grapeVariety: 'Cabernet Sauvignon, Merlot, Cabernet Franc',
    classification: '3ème Cru Classé',
    minVintage: 1855,
    avgPrice: 70,
    producers: ['Château Cantenac Brown'],
    aliases: ['Cantenac Brown']
  },
];
