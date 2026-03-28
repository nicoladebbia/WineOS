import { WineTemplate } from '@/types/wineDatabase';

export const italianWines: WineTemplate[] = [
  // TUSCANY - Brunello di Montalcino (DOCG)
  {
    id: 'brunello-di-montalcino',
    name: 'Brunello di Montalcino',
    type: 'Red',
    country: 'Italy',
    region: 'Tuscany',
    subRegion: 'Montalcino',
    grapeVariety: 'Sangiovese',
    classification: 'DOCG',
    minVintage: 1888,
    avgPrice: 60,
    agingRequirement: 'Minimum 4 years (2 in oak)',
    producers: [
      'Biondi Santi', 'Casanova di Neri', 'Il Poggione', 'Banfi', 'Altesino',
      'Caparzo', 'Ciacci Piccolomini d\'Aragona', 'Col d\'Orcia', 'Conti Costanti',
      'Fuligni', 'La Gerla', 'Lisini', 'Mastrojanni', 'Pian delle Vigne',
      'Poggio Antico', 'Poggio di Sotto', 'Salvioni', 'Siro Pacenti', 'Soldera',
      'Talenti', 'Valdicava', 'Argiano', 'Barbi', 'Campogiovanni', 'Canalicchio di Sopra',
      'Castiglion del Bosco', 'Donatella Cinelli Colombini', 'Fanti', 'Fattoria dei Barbi',
      'Gorelli', 'La Fortuna', 'La Poderina', 'Le Chiuse', 'Le Potazzine',
      'Mocali', 'Padelletti', 'Pieve Santa Restituta', 'San Filippo', 'San Polo',
      'Sesta di Sopra', 'Uccelliera', 'Villa Le Prata'
    ],
    aliases: ['Brunello', 'DOCG Brunello']
  },
  
  // Brunello di Montalcino Riserva
  {
    id: 'brunello-di-montalcino-riserva',
    name: 'Brunello di Montalcino Riserva',
    type: 'Red',
    country: 'Italy',
    region: 'Tuscany',
    subRegion: 'Montalcino',
    grapeVariety: 'Sangiovese',
    classification: 'DOCG',
    minVintage: 1888,
    avgPrice: 100,
    agingRequirement: 'Minimum 5 years (2 in oak)',
    producers: [
      'Biondi Santi', 'Casanova di Neri', 'Il Poggione', 'Soldera', 'Poggio di Sotto',
      'Salvioni', 'Valdicava', 'Conti Costanti', 'Siro Pacenti', 'Fuligni',
      'Ciacci Piccolomini d\'Aragona', 'Mastrojanni', 'Talenti', 'Altesino', 'Caparzo'
    ],
    aliases: ['Brunello Riserva']
  },
  
  // Rosso di Montalcino
  {
    id: 'rosso-di-montalcino',
    name: 'Rosso di Montalcino',
    type: 'Red',
    country: 'Italy',
    region: 'Tuscany',
    subRegion: 'Montalcino',
    grapeVariety: 'Sangiovese',
    classification: 'DOC',
    minVintage: 1984,
    avgPrice: 25,
    agingRequirement: 'Minimum 1 year',
    producers: [
      'Biondi Santi', 'Casanova di Neri', 'Il Poggione', 'Banfi', 'Altesino',
      'Caparzo', 'Ciacci Piccolomini d\'Aragona', 'Col d\'Orcia', 'Conti Costanti',
      'Fuligni', 'La Gerla', 'Lisini', 'Mastrojanni', 'Pian delle Vigne',
      'Poggio Antico', 'Poggio di Sotto', 'Salvioni', 'Siro Pacenti', 'Talenti',
      'Valdicava'
    ],
    aliases: ['Rosso Montalcino']
  },
  
  // PIEDMONT - Barolo
  {
    id: 'barolo',
    name: 'Barolo',
    type: 'Red',
    country: 'Italy',
    region: 'Piedmont',
    subRegion: 'Langhe',
    grapeVariety: 'Nebbiolo',
    classification: 'DOCG',
    minVintage: 1850,
    avgPrice: 70,
    agingRequirement: 'Minimum 38 months (18 in oak)',
    producers: [
      'Gaja', 'Giacomo Conterno', 'Bruno Giacosa', 'Bartolo Mascarello', 'Giuseppe Rinaldi',
      'Elio Altare', 'Aldo Conterno', 'Paolo Scavino', 'Luciano Sandrone', 'Roberto Voerzio',
      'Vietti', 'Ceretto', 'Pio Cesare', 'Marchesi di Barolo', 'Fontanafredda',
      'Michele Chiarlo', 'Brovia', 'Cavallotto', 'Comm. G.B. Burlotto', 'Cordero di Montezemolo',
      'Domenico Clerico', 'E. Pira & Figli', 'Elvio Cogno', 'Fratelli Alessandria', 'G.D. Vajra',
      'Giacomo Fenocchio', 'Giovanni Rosso', 'Guido Porro', 'Manzone', 'Marengo',
      'Marcarini', 'Massolino', 'Oddero', 'Parusso', 'Pecchenino',
      'Poderi Aldo Conterno', 'Renato Ratti', 'Revello', 'Rocche Costamagna', 'Seghesio',
      'Silvio Grasso', 'Vajra', 'Veglio', 'Viberti'
    ],
    aliases: ['King of Wines', 'Wine of Kings']
  },
  
  // Barolo Riserva
  {
    id: 'barolo-riserva',
    name: 'Barolo Riserva',
    type: 'Red',
    country: 'Italy',
    region: 'Piedmont',
    subRegion: 'Langhe',
    grapeVariety: 'Nebbiolo',
    classification: 'DOCG',
    minVintage: 1850,
    avgPrice: 120,
    agingRequirement: 'Minimum 62 months',
    producers: [
      'Giacomo Conterno', 'Bruno Giacosa', 'Bartolo Mascarello', 'Giuseppe Rinaldi',
      'Gaja', 'Aldo Conterno', 'Paolo Scavino', 'Luciano Sandrone', 'Vietti',
      'Ceretto', 'Pio Cesare', 'Fontanafredda', 'Brovia', 'Cavallotto'
    ],
    aliases: ['Barolo Ris.']
  },
  
  // Barbaresco
  {
    id: 'barbaresco',
    name: 'Barbaresco',
    type: 'Red',
    country: 'Italy',
    region: 'Piedmont',
    subRegion: 'Langhe',
    grapeVariety: 'Nebbiolo',
    classification: 'DOCG',
    minVintage: 1894,
    avgPrice: 60,
    agingRequirement: 'Minimum 26 months (9 in oak)',
    producers: [
      'Gaja', 'Bruno Giacosa', 'Produttori del Barbaresco', 'Angelo Gaja', 'Ceretto',
      'Pio Cesare', 'Marchesi di Grésy', 'Roagna', 'Ca\' del Baio', 'Cascina delle Rose',
      'Castello di Neive', 'Cigliuti', 'Cortese', 'Fiorenzo Nada', 'Fratelli Giacosa',
      'La Spinetta', 'Moccagatta', 'Nada', 'Orlando Abrigo', 'Paitin',
      'Pelissero', 'Prunotto', 'Sottimano', 'Vietti'
    ],
    aliases: ['Queen of Wines']
  },
  
  // Chianti Classico
  {
    id: 'chianti-classico',
    name: 'Chianti Classico',
    type: 'Red',
    country: 'Italy',
    region: 'Tuscany',
    subRegion: 'Chianti',
    grapeVariety: 'Sangiovese',
    classification: 'DOCG',
    minVintage: 1716,
    avgPrice: 25,
    agingRequirement: 'Minimum 12 months',
    producers: [
      'Antinori', 'Fèlsina', 'Fontodi', 'Castello di Ama', 'Isole e Olena',
      'Castello di Volpaia', 'Ruffino', 'Badia a Coltibuono', 'Castello di Brolio', 'Frescobaldi',
      'Querciabella', 'San Felice', 'Castello di Monsanto', 'Castello di Verrazzano', 'Cecchi',
      'Lamole di Lamole', 'Nittardi', 'Rocca delle Macìe', 'San Giusto a Rentennano', 'Villa Cafaggio'
    ],
    aliases: ['Chianti', 'CC']
  },
  
  // Chianti Classico Riserva
  {
    id: 'chianti-classico-riserva',
    name: 'Chianti Classico Riserva',
    type: 'Red',
    country: 'Italy',
    region: 'Tuscany',
    subRegion: 'Chianti',
    grapeVariety: 'Sangiovese',
    classification: 'DOCG',
    minVintage: 1716,
    avgPrice: 40,
    agingRequirement: 'Minimum 24 months',
    producers: [
      'Antinori', 'Fèlsina', 'Fontodi', 'Castello di Ama', 'Isole e Olena',
      'Castello di Volpaia', 'Ruffino', 'Badia a Coltibuono', 'Castello di Brolio', 'Frescobaldi',
      'Querciabella', 'San Felice', 'Castello di Monsanto'
    ],
    aliases: ['Chianti Riserva', 'CCR']
  },
  
  // Chianti Classico Gran Selezione
  {
    id: 'chianti-classico-gran-selezione',
    name: 'Chianti Classico Gran Selezione',
    type: 'Red',
    country: 'Italy',
    region: 'Tuscany',
    subRegion: 'Chianti',
    grapeVariety: 'Sangiovese',
    classification: 'DOCG',
    minVintage: 2010,
    avgPrice: 60,
    agingRequirement: 'Minimum 30 months',
    producers: [
      'Antinori', 'Fèlsina', 'Fontodi', 'Castello di Ama', 'Isole e Olena',
      'Castello di Volpaia', 'Ruffino', 'Badia a Coltibuono', 'Castello di Brolio', 'Frescobaldi'
    ],
    aliases: ['Gran Selezione', 'CCGS']
  },
  
  // Amarone della Valpolicella
  {
    id: 'amarone-della-valpolicella',
    name: 'Amarone della Valpolicella',
    type: 'Red',
    country: 'Italy',
    region: 'Veneto',
    subRegion: 'Valpolicella',
    grapeVariety: 'Corvina, Rondinella, Molinara',
    classification: 'DOCG',
    minVintage: 1936,
    avgPrice: 70,
    agingRequirement: 'Minimum 2 years',
    producers: [
      'Dal Forno Romano', 'Giuseppe Quintarelli', 'Allegrini', 'Masi', 'Tommasi',
      'Bertani', 'Tedeschi', 'Zenato', 'Speri', 'Brigaldara',
      'Ca\' La Bionda', 'Corte Sant\'Alda', 'Le Ragose', 'Le Salette', 'Marion',
      'Monte dall\'Ora', 'Musella', 'Roccolo Grassi', 'Romano Dal Forno', 'Serego Alighieri',
      'Stefano Accordini', 'Venturini', 'Villa Bellini', 'Zymè'
    ],
    aliases: ['Amarone']
  },
  
  
  // Valpolicella Ripasso
  {
    id: 'valpolicella-ripasso',
    name: 'Valpolicella Ripasso',
    type: 'Red',
    country: 'Italy',
    region: 'Veneto',
    subRegion: 'Valpolicella',
    grapeVariety: 'Corvina, Rondinella, Molinara',
    classification: 'DOC',
    minVintage: 1980,
    avgPrice: 25,
    producers: [
      'Allegrini', 'Masi', 'Tommasi', 'Bertani', 'Tedeschi',
      'Zenato', 'Speri', 'Brigaldara', 'Le Salette', 'Corte Sant\'Alda'
    ],
    aliases: ['Ripasso']
  },
  
  // Prosecco
  {
    id: 'prosecco',
    name: 'Prosecco',
    type: 'Sparkling',
    country: 'Italy',
    region: 'Veneto',
    subRegion: 'Valdobbiadene',
    grapeVariety: 'Glera',
    classification: 'DOC',
    minVintage: 1960,
    avgPrice: 15,
    producers: [
      'Bisol', 'Nino Franco', 'Adami', 'Ruggeri', 'Col Vetoraz',
      'Sorelle Bronca', 'Bortolomiol', 'Carpene Malvolti', 'Mionetto', 'La Marca'
    ],
    aliases: ['Prosecco DOC']
  },
  
  // Franciacorta
  {
    id: 'franciacorta',
    name: 'Franciacorta',
    type: 'Sparkling',
    country: 'Italy',
    region: 'Lombardy',
    subRegion: 'Franciacorta',
    grapeVariety: 'Chardonnay, Pinot Noir, Pinot Blanc',
    classification: 'DOCG',
    minVintage: 1967,
    avgPrice: 35,
    producers: [
      'Ca\' del Bosco', 'Bellavista', 'Berlucchi', 'Ferghettina', 'Contadi Castaldi',
      'Barone Pizzini', 'Monte Rossa', 'Ricci Curbastro', 'Cavalleri', 'Guido Berlucchi'
    ],
    aliases: ['Franciacorta DOCG']
  },
  
  // Barbera d'Alba
  {
    id: 'barbera-dalba',
    name: 'Barbera d\'Alba',
    type: 'Red',
    country: 'Italy',
    region: 'Piedmont',
    subRegion: 'Alba',
    grapeVariety: 'Barbera',
    classification: 'DOC',
    minVintage: 1970,
    avgPrice: 20,
    producers: [
      'Aldo Conterno', 'Elio Altare', 'Vietti', 'Prunotto', 'Pio Cesare',
      'Michele Chiarlo', 'Ceretto', 'Sandrone', 'Scavino', 'Vajra'
    ],
    aliases: ['Barbera']
  },
  
  // Gavi
  {
    id: 'gavi',
    name: 'Gavi',
    type: 'White',
    country: 'Italy',
    region: 'Piedmont',
    subRegion: 'Gavi',
    grapeVariety: 'Cortese',
    classification: 'DOCG',
    minVintage: 1974,
    avgPrice: 18,
    producers: [
      'La Scolca', 'Pio Cesare', 'Broglia', 'Villa Sparina', 'Castellari Bergaglio',
      'Banfi', 'Fontanafredda', 'Michele Chiarlo'
    ],
    aliases: ['Gavi di Gavi', 'Cortese di Gavi']
  },
  
  // Soave Classico
  {
    id: 'soave-classico',
    name: 'Soave Classico',
    type: 'White',
    country: 'Italy',
    region: 'Veneto',
    subRegion: 'Soave',
    grapeVariety: 'Garganega',
    classification: 'DOC',
    minVintage: 1968,
    avgPrice: 15,
    producers: [
      'Pieropan', 'Gini', 'Inama', 'Coffele', 'Suavia',
      'Pra', 'Tamellini', 'Ca\' Rugate'
    ],
    aliases: ['Soave']
  },
  
  // Vino Nobile di Montepulciano
  {
    id: 'vino-nobile-di-montepulciano',
    name: 'Vino Nobile di Montepulciano',
    type: 'Red',
    country: 'Italy',
    region: 'Tuscany',
    subRegion: 'Montepulciano',
    grapeVariety: 'Sangiovese',
    classification: 'DOCG',
    minVintage: 1980,
    avgPrice: 30,
    producers: [
      'Avignonesi', 'Boscarelli', 'Poliziano', 'Salcheto', 'Contucci',
      'Dei', 'La Braccesca', 'Le Casalte', 'Bindella'
    ],
    aliases: ['Vino Nobile', 'Nobile di Montepulciano']
  },
  
  // Sagrantino di Montefalco
  {
    id: 'sagrantino-di-montefalco',
    name: 'Sagrantino di Montefalco',
    type: 'Red',
    country: 'Italy',
    region: 'Umbria',
    subRegion: 'Montefalco',
    grapeVariety: 'Sagrantino',
    classification: 'DOCG',
    minVintage: 1992,
    avgPrice: 40,
    producers: [
      'Arnaldo Caprai', 'Paolo Bea', 'Adanti', 'Antonelli', 'Perticaia',
      'Scacciadiavoli', 'Tabarrini'
    ],
    aliases: ['Sagrantino']
  },
  
  // Taurasi
  {
    id: 'taurasi',
    name: 'Taurasi',
    type: 'Red',
    country: 'Italy',
    region: 'Campania',
    subRegion: 'Taurasi',
    grapeVariety: 'Aglianico',
    classification: 'DOCG',
    minVintage: 1993,
    avgPrice: 35,
    producers: [
      'Mastroberardino', 'Feudi di San Gregorio', 'Terredora', 'Salvatore Molettieri',
      'Antonio Caggiano', 'Quintodecimo', 'Villa Raiano'
    ],
    aliases: ['Taurasi DOCG']
  },
  
  // Primitivo di Manduria
  {
    id: 'primitivo-di-manduria',
    name: 'Primitivo di Manduria',
    type: 'Red',
    country: 'Italy',
    region: 'Puglia',
    subRegion: 'Manduria',
    grapeVariety: 'Primitivo',
    classification: 'DOC',
    minVintage: 1974,
    avgPrice: 20,
    producers: [
      'Gianfranco Fino', 'Masseria Li Veli', 'Produttori di Manduria', 'Felline',
      'Sessantanni', 'Pervini', 'Morella'
    ],
    aliases: ['Primitivo']
  },
  
  
  // SUPER TUSCANS
  { id: 'sassicaia', name: 'Sassicaia', type: 'Red', country: 'Italy', region: 'Tuscany', subRegion: 'Bolgheri', grapeVariety: 'Cabernet Sauvignon, Cabernet Franc', classification: 'DOC', minVintage: 1968, avgPrice: 200, producers: ['Tenuta San Guido'], aliases: ['Bolgheri Sassicaia'] },
  { id: 'ornellaia', name: 'Ornellaia', type: 'Red', country: 'Italy', region: 'Tuscany', subRegion: 'Bolgheri', grapeVariety: 'Cabernet Sauvignon, Merlot, Cabernet Franc', classification: 'DOC', minVintage: 1985, avgPrice: 180, producers: ['Tenuta dell\'Ornellaia'], aliases: ['Bolgheri Superiore Ornellaia'] },
  { id: 'tignanello', name: 'Tignanello', type: 'Red', country: 'Italy', region: 'Tuscany', grapeVariety: 'Sangiovese, Cabernet Sauvignon, Cabernet Franc', minVintage: 1971, avgPrice: 120, producers: ['Antinori'], aliases: ['Toscana IGT Tignanello'] },
  { id: 'solaia', name: 'Solaia', type: 'Red', country: 'Italy', region: 'Tuscany', grapeVariety: 'Cabernet Sauvignon, Sangiovese, Cabernet Franc', minVintage: 1978, avgPrice: 250, producers: ['Antinori'], aliases: ['Toscana IGT Solaia'] },
  { id: 'masseto', name: 'Masseto', type: 'Red', country: 'Italy', region: 'Tuscany', subRegion: 'Bolgheri', grapeVariety: 'Merlot', minVintage: 1986, avgPrice: 600, producers: ['Tenuta dell\'Ornellaia'], aliases: ['Toscana IGT Masseto'] },
  { id: 'guado-al-tasso', name: 'Guado al Tasso', type: 'Red', country: 'Italy', region: 'Tuscany', subRegion: 'Bolgheri', grapeVariety: 'Cabernet Sauvignon, Merlot, Cabernet Franc', classification: 'DOC', minVintage: 1990, avgPrice: 80, producers: ['Antinori'], aliases: ['Bolgheri Superiore'] },
  { id: 'le-serre-nuove', name: 'Le Serre Nuove dell\'Ornellaia', type: 'Red', country: 'Italy', region: 'Tuscany', subRegion: 'Bolgheri', grapeVariety: 'Cabernet Sauvignon, Merlot, Cabernet Franc', classification: 'DOC', minVintage: 1997, avgPrice: 60, producers: ['Tenuta dell\'Ornellaia'] },
  { id: 'grattamacco', name: 'Grattamacco', type: 'Red', country: 'Italy', region: 'Tuscany', subRegion: 'Bolgheri', grapeVariety: 'Cabernet Sauvignon, Merlot, Sangiovese', classification: 'DOC', minVintage: 1982, avgPrice: 70, producers: ['Podere Grattamacco'] },
  { id: 'ca-marcanda', name: 'Ca\' Marcanda', type: 'Red', country: 'Italy', region: 'Tuscany', subRegion: 'Bolgheri', grapeVariety: 'Merlot, Cabernet Sauvignon, Cabernet Franc', classification: 'DOC', minVintage: 2000, avgPrice: 90, producers: ['Gaja'] },
  { id: 'lupicaia', name: 'Lupicaia', type: 'Red', country: 'Italy', region: 'Tuscany', grapeVariety: 'Cabernet Sauvignon, Merlot', minVintage: 1985, avgPrice: 100, producers: ['Castello del Terriccio'] },
  
  // MORE PIEDMONT
  { id: 'dolcetto-dalba', name: 'Dolcetto d\'Alba', type: 'Red', country: 'Italy', region: 'Piedmont', subRegion: 'Alba', grapeVariety: 'Dolcetto', classification: 'DOC', minVintage: 1974, avgPrice: 18, producers: ['Aldo Conterno', 'Elio Altare', 'Vietti', 'Prunotto', 'Pio Cesare', 'Ceretto', 'Vajra', 'Scavino'] },
  { id: 'nebbiolo-dalba', name: 'Nebbiolo d\'Alba', type: 'Red', country: 'Italy', region: 'Piedmont', subRegion: 'Alba', grapeVariety: 'Nebbiolo', classification: 'DOC', minVintage: 1970, avgPrice: 25, producers: ['Bruno Giacosa', 'Vietti', 'Pio Cesare', 'Ceretto', 'Prunotto', 'Vajra'] },
  { id: 'roero', name: 'Roero', type: 'Red', country: 'Italy', region: 'Piedmont', subRegion: 'Roero', grapeVariety: 'Nebbiolo', classification: 'DOCG', minVintage: 1985, avgPrice: 22, producers: ['Matteo Correggia', 'Malvirà', 'Angelo Negro', 'Cascina Ca\' Rossa'] },
  { id: 'roero-arneis', name: 'Roero Arneis', type: 'White', country: 'Italy', region: 'Piedmont', subRegion: 'Roero', grapeVariety: 'Arneis', classification: 'DOCG', minVintage: 1989, avgPrice: 18, producers: ['Bruno Giacosa', 'Vietti', 'Ceretto', 'Malvirà', 'Matteo Correggia'] },
  { id: 'barbera-dasti', name: 'Barbera d\'Asti', type: 'Red', country: 'Italy', region: 'Piedmont', subRegion: 'Asti', grapeVariety: 'Barbera', classification: 'DOCG', minVintage: 1970, avgPrice: 20, producers: ['Michele Chiarlo', 'Vietti', 'Prunotto', 'Coppo', 'Braida'] },
  { id: 'moscato-dasti', name: 'Moscato d\'Asti', type: 'Sparkling', country: 'Italy', region: 'Piedmont', subRegion: 'Asti', grapeVariety: 'Moscato', classification: 'DOCG', minVintage: 1993, avgPrice: 15, producers: ['Michele Chiarlo', 'Vietti', 'Ceretto', 'Paolo Saracco', 'La Spinetta'] },
  { id: 'gattinara', name: 'Gattinara', type: 'Red', country: 'Italy', region: 'Piedmont', subRegion: 'Gattinara', grapeVariety: 'Nebbiolo', classification: 'DOCG', minVintage: 1990, avgPrice: 35, producers: ['Travaglini', 'Antoniolo', 'Nervi'] },
  { id: 'ghemme', name: 'Ghemme', type: 'Red', country: 'Italy', region: 'Piedmont', subRegion: 'Ghemme', grapeVariety: 'Nebbiolo', classification: 'DOCG', minVintage: 1997, avgPrice: 30, producers: ['Antichi Vigneti di Cantalupo', 'Rovellotti'] },
  
  // MORE VENETO
  { id: 'valpolicella-classico', name: 'Valpolicella Classico', type: 'Red', country: 'Italy', region: 'Veneto', subRegion: 'Valpolicella', grapeVariety: 'Corvina, Rondinella, Molinara', classification: 'DOC', minVintage: 1968, avgPrice: 15, producers: ['Allegrini', 'Masi', 'Tommasi', 'Bertani', 'Tedeschi', 'Zenato', 'Speri'] },
  { id: 'bardolino', name: 'Bardolino', type: 'Red', country: 'Italy', region: 'Veneto', subRegion: 'Bardolino', grapeVariety: 'Corvina, Rondinella', classification: 'DOC', minVintage: 1968, avgPrice: 12, producers: ['Zenato', 'Guerrieri Rizzardi', 'Le Fraghe'] },
  { id: 'recioto-della-valpolicella', name: 'Recioto della Valpolicella', type: 'Dessert', country: 'Italy', region: 'Veneto', subRegion: 'Valpolicella', grapeVariety: 'Corvina, Rondinella, Molinara', classification: 'DOCG', minVintage: 1990, avgPrice: 40, producers: ['Dal Forno Romano', 'Giuseppe Quintarelli', 'Masi', 'Tommasi', 'Tedeschi'] },
  { id: 'lugana', name: 'Lugana', type: 'White', country: 'Italy', region: 'Veneto', subRegion: 'Lugana', grapeVariety: 'Turbiana', classification: 'DOC', minVintage: 1967, avgPrice: 18, producers: ['Ca\' dei Frati', 'Zenato', 'Ottella', 'Cà Maiol'] },
  { id: 'custoza', name: 'Custoza', type: 'White', country: 'Italy', region: 'Veneto', subRegion: 'Custoza', grapeVariety: 'Garganega, Trebbiano', classification: 'DOC', minVintage: 1971, avgPrice: 12, producers: ['Cavalchina', 'Gorgo', 'Monte del Frà'] },
  
  // SOUTHERN ITALY
  { id: 'nero-davola', name: 'Nero d\'Avola', type: 'Red', country: 'Italy', region: 'Sicily', grapeVariety: 'Nero d\'Avola', minVintage: 1980, avgPrice: 15, producers: ['Planeta', 'Donnafugata', 'Cusumano', 'Feudo Arancio', 'Tasca d\'Almerita'] },
  { id: 'etna-rosso', name: 'Etna Rosso', type: 'Red', country: 'Italy', region: 'Sicily', subRegion: 'Etna', grapeVariety: 'Nerello Mascalese', classification: 'DOC', minVintage: 1968, avgPrice: 30, producers: ['Passopisciaro', 'Benanti', 'Tenuta delle Terre Nere', 'Planeta', 'Graci'] },
  { id: 'etna-bianco', name: 'Etna Bianco', type: 'White', country: 'Italy', region: 'Sicily', subRegion: 'Etna', grapeVariety: 'Carricante', classification: 'DOC', minVintage: 1968, avgPrice: 25, producers: ['Benanti', 'Tenuta delle Terre Nere', 'Planeta', 'Graci'] },
  { id: 'cerasuolo-di-vittoria', name: 'Cerasuolo di Vittoria', type: 'Red', country: 'Italy', region: 'Sicily', subRegion: 'Vittoria', grapeVariety: 'Nero d\'Avola, Frappato', classification: 'DOCG', minVintage: 2005, avgPrice: 20, producers: ['COS', 'Planeta', 'Gulfi', 'Valle dell\'Acate'] },
  { id: 'fiano-di-avellino', name: 'Fiano di Avellino', type: 'White', country: 'Italy', region: 'Campania', subRegion: 'Avellino', grapeVariety: 'Fiano', classification: 'DOCG', minVintage: 2003, avgPrice: 20, producers: ['Feudi di San Gregorio', 'Mastroberardino', 'Terredora', 'Pietracupa'] },
  { id: 'greco-di-tufo', name: 'Greco di Tufo', type: 'White', country: 'Italy', region: 'Campania', subRegion: 'Tufo', grapeVariety: 'Greco', classification: 'DOCG', minVintage: 2003, avgPrice: 18, producers: ['Feudi di San Gregorio', 'Mastroberardino', 'Terredora', 'Benito Ferrara'] },
  { id: 'aglianico-del-vulture', name: 'Aglianico del Vulture', type: 'Red', country: 'Italy', region: 'Basilicata', subRegion: 'Vulture', grapeVariety: 'Aglianico', classification: 'DOC', minVintage: 1971, avgPrice: 25, producers: ['Paternoster', 'D\'Angelo', 'Elena Fucci', 'Cantine del Notaio'] },
  { id: 'salice-salentino', name: 'Salice Salentino', type: 'Red', country: 'Italy', region: 'Puglia', subRegion: 'Salento', grapeVariety: 'Negroamaro', classification: 'DOC', minVintage: 1990, avgPrice: 12, producers: ['Leone de Castris', 'Taurino', 'Candido'] },
  
  // MORE TUSCANY
  { id: 'carmignano', name: 'Carmignano', type: 'Red', country: 'Italy', region: 'Tuscany', subRegion: 'Carmignano', grapeVariety: 'Sangiovese, Cabernet Sauvignon', classification: 'DOCG', minVintage: 1990, avgPrice: 25, producers: ['Capezzana', 'Piaggia', 'Ambra'] },
  { id: 'morellino-di-scansano', name: 'Morellino di Scansano', type: 'Red', country: 'Italy', region: 'Tuscany', subRegion: 'Scansano', grapeVariety: 'Sangiovese', classification: 'DOCG', minVintage: 2007, avgPrice: 18, producers: ['Moris Farms', 'Le Pupille', 'Roccapesta', 'Mantellassi'] },
  { id: 'bolgheri', name: 'Bolgheri Rosso', type: 'Red', country: 'Italy', region: 'Tuscany', subRegion: 'Bolgheri', grapeVariety: 'Cabernet Sauvignon, Merlot, Sangiovese', classification: 'DOC', minVintage: 1994, avgPrice: 30, producers: ['Michele Satta', 'Le Macchiole', 'Caccia al Piano'] },
  { id: 'montecucco-sangiovese', name: 'Montecucco Sangiovese', type: 'Red', country: 'Italy', region: 'Tuscany', subRegion: 'Montecucco', grapeVariety: 'Sangiovese', classification: 'DOCG', minVintage: 2011, avgPrice: 20, producers: ['ColleMassari', 'Salustri', 'Basile'] },
  { id: 'vernaccia-di-san-gimignano', name: 'Vernaccia di San Gimignano', type: 'White', country: 'Italy', region: 'Tuscany', subRegion: 'San Gimignano', grapeVariety: 'Vernaccia', classification: 'DOCG', minVintage: 1993, avgPrice: 15, producers: ['Teruzzi & Puthod', 'Panizzi', 'Montenidoli', 'Cesani'] },
  
  // LOMBARDY
  { id: 'valtellina-superiore', name: 'Valtellina Superiore', type: 'Red', country: 'Italy', region: 'Lombardy', subRegion: 'Valtellina', grapeVariety: 'Nebbiolo', classification: 'DOCG', minVintage: 1998, avgPrice: 25, producers: ['Ar.Pe.Pe', 'Nino Negri', 'Rainoldi', 'Mamete Prevostini'] },
  { id: 'sforzato-di-valtellina', name: 'Sforzato di Valtellina', type: 'Red', country: 'Italy', region: 'Lombardy', subRegion: 'Valtellina', grapeVariety: 'Nebbiolo', classification: 'DOCG', minVintage: 2003, avgPrice: 40, producers: ['Nino Negri', 'Ar.Pe.Pe', 'Rainoldi'] },
  { id: 'oltrepo-pavese', name: 'Oltrepò Pavese', type: 'Red', country: 'Italy', region: 'Lombardy', subRegion: 'Oltrepò Pavese', grapeVariety: 'Pinot Noir, Barbera', classification: 'DOC', minVintage: 1970, avgPrice: 15, producers: ['Monsupello', 'Vanzini', 'Tenuta Mazzolino'] },
  
  // UMBRIA & MARCHE
  { id: 'rosso-di-montefalco', name: 'Rosso di Montefalco', type: 'Red', country: 'Italy', region: 'Umbria', subRegion: 'Montefalco', grapeVariety: 'Sangiovese, Sagrantino', classification: 'DOC', minVintage: 1980, avgPrice: 18, producers: ['Arnaldo Caprai', 'Paolo Bea', 'Antonelli', 'Adanti'] },
  { id: 'orvieto-classico', name: 'Orvieto Classico', type: 'White', country: 'Italy', region: 'Umbria', subRegion: 'Orvieto', grapeVariety: 'Grechetto, Trebbiano', classification: 'DOC', minVintage: 1971, avgPrice: 12, producers: ['Barberani', 'Palazzone', 'Decugnano dei Barbi'] },
  { id: 'verdicchio-dei-castelli-di-jesi', name: 'Verdicchio dei Castelli di Jesi', type: 'White', country: 'Italy', region: 'Marche', subRegion: 'Castelli di Jesi', grapeVariety: 'Verdicchio', classification: 'DOC', minVintage: 1968, avgPrice: 15, producers: ['Umani Ronchi', 'Garofoli', 'Sartarelli', 'Bucci'] },
  { id: 'verdicchio-di-matelica', name: 'Verdicchio di Matelica', type: 'White', country: 'Italy', region: 'Marche', subRegion: 'Matelica', grapeVariety: 'Verdicchio', classification: 'DOCG', minVintage: 2010, avgPrice: 18, producers: ['Belisario', 'La Monacesca', 'Bisci'] },
  { id: 'rosso-conero', name: 'Rosso Conero', type: 'Red', country: 'Italy', region: 'Marche', subRegion: 'Conero', grapeVariety: 'Montepulciano', classification: 'DOC', minVintage: 1967, avgPrice: 18, producers: ['Umani Ronchi', 'Moroder', 'Le Terrazze'] },
  
  // FRIULI & TRENTINO-ALTO ADIGE
  { id: 'friulano', name: 'Friulano', type: 'White', country: 'Italy', region: 'Friuli-Venezia Giulia', grapeVariety: 'Friulano', classification: 'DOC', minVintage: 1975, avgPrice: 18, producers: ['Livio Felluga', 'Jermann', 'Venica & Venica', 'Vie di Romans'] },
  { id: 'pinot-grigio-friuli', name: 'Pinot Grigio Friuli', type: 'White', country: 'Italy', region: 'Friuli-Venezia Giulia', grapeVariety: 'Pinot Grigio', classification: 'DOC', minVintage: 1970, avgPrice: 20, producers: ['Livio Felluga', 'Jermann', 'Venica & Venica', 'Vie di Romans', 'Marco Felluga'] },
  { id: 'alto-adige-pinot-noir', name: 'Alto Adige Pinot Noir', type: 'Red', country: 'Italy', region: 'Trentino-Alto Adige', subRegion: 'Alto Adige', grapeVariety: 'Pinot Noir', classification: 'DOC', minVintage: 1975, avgPrice: 25, producers: ['Alois Lageder', 'Elena Walch', 'Hofstätter', 'Cantina Terlano'] },
  { id: 'alto-adige-gewurztraminer', name: 'Alto Adige Gewürztraminer', type: 'White', country: 'Italy', region: 'Trentino-Alto Adige', subRegion: 'Alto Adige', grapeVariety: 'Gewürztraminer', classification: 'DOC', minVintage: 1975, avgPrice: 22, producers: ['Elena Walch', 'Cantina Terlano', 'Alois Lageder', 'Hofstätter'] },
  { id: 'teroldego-rotaliano', name: 'Teroldego Rotaliano', type: 'Red', country: 'Italy', region: 'Trentino-Alto Adige', subRegion: 'Rotaliano', grapeVariety: 'Teroldego', classification: 'DOC', minVintage: 1971, avgPrice: 18, producers: ['Foradori', 'Zeni', 'Mezzacorona'] },
  
  // ABRUZZO & MOLISE
  { id: 'montepulciano-dabruzzo', name: 'Montepulciano d\'Abruzzo', type: 'Red', country: 'Italy', region: 'Abruzzo', grapeVariety: 'Montepulciano', classification: 'DOC', minVintage: 1968, avgPrice: 12, producers: ['Masciarelli', 'Valentini', 'Emidio Pepe', 'Torre dei Beati', 'Cataldi Madonna'] },
  { id: 'trebbiano-dabruzzo', name: 'Trebbiano d\'Abruzzo', type: 'White', country: 'Italy', region: 'Abruzzo', grapeVariety: 'Trebbiano', classification: 'DOC', minVintage: 1972, avgPrice: 15, producers: ['Valentini', 'Emidio Pepe', 'Masciarelli'] },
  
  // SARDINIA
  { id: 'cannonau-di-sardegna', name: 'Cannonau di Sardegna', type: 'Red', country: 'Italy', region: 'Sardinia', grapeVariety: 'Cannonau', classification: 'DOC', minVintage: 1972, avgPrice: 15, producers: ['Argiolas', 'Sella & Mosca', 'Cantina di Santadi', 'Pala'] },
  { id: 'vermentino-di-sardegna', name: 'Vermentino di Sardegna', type: 'White', country: 'Italy', region: 'Sardinia', grapeVariety: 'Vermentino', classification: 'DOC', minVintage: 1988, avgPrice: 14, producers: ['Argiolas', 'Sella & Mosca', 'Pala', 'Cantina di Santadi'] },
  { id: 'vermentino-di-gallura', name: 'Vermentino di Gallura', type: 'White', country: 'Italy', region: 'Sardinia', subRegion: 'Gallura', grapeVariety: 'Vermentino', classification: 'DOCG', minVintage: 1996, avgPrice: 18, producers: ['Capichera', 'Piero Mancini', 'Surrau'] },
  
  // LAZIO
  { id: 'frascati', name: 'Frascati', type: 'White', country: 'Italy', region: 'Lazio', subRegion: 'Frascati', grapeVariety: 'Malvasia, Trebbiano', classification: 'DOC', minVintage: 1966, avgPrice: 12, producers: ['Fontana Candida', 'Villa Simone', 'Castel de Paolis'] },
  { id: 'est-est-est', name: 'Est! Est!! Est!!! di Montefiascone', type: 'White', country: 'Italy', region: 'Lazio', subRegion: 'Montefiascone', grapeVariety: 'Trebbiano, Malvasia', classification: 'DOC', minVintage: 1966, avgPrice: 10, producers: ['Falesco', 'Mazziotti'] },
  
  // EMILIA-ROMAGNA
  { id: 'lambrusco-di-sorbara', name: 'Lambrusco di Sorbara', type: 'Sparkling', country: 'Italy', region: 'Emilia-Romagna', subRegion: 'Sorbara', grapeVariety: 'Lambrusco di Sorbara', classification: 'DOC', minVintage: 1970, avgPrice: 12, producers: ['Cleto Chiarli', 'Paltrinieri', 'Cavicchioli'] },
  { id: 'sangiovese-di-romagna', name: 'Sangiovese di Romagna', type: 'Red', country: 'Italy', region: 'Emilia-Romagna', subRegion: 'Romagna', grapeVariety: 'Sangiovese', classification: 'DOC', minVintage: 1967, avgPrice: 15, producers: ['Tre Monti', 'Zerbina', 'Fattoria Paradiso'] },
  { id: 'albana-di-romagna', name: 'Albana di Romagna', type: 'White', country: 'Italy', region: 'Emilia-Romagna', subRegion: 'Romagna', grapeVariety: 'Albana', classification: 'DOCG', minVintage: 1987, avgPrice: 14, producers: ['Tre Monti', 'Zerbina', 'Fattoria Monticino Rosso'] },
  
  // LIGURIA
  { id: 'cinque-terre', name: 'Cinque Terre', type: 'White', country: 'Italy', region: 'Liguria', subRegion: 'Cinque Terre', grapeVariety: 'Bosco, Albarola, Vermentino', classification: 'DOC', minVintage: 1973, avgPrice: 20, producers: ['Walter de Battè', 'Buranco', 'Forlini Cappellini'] },
  { id: 'rossese-di-dolceacqua', name: 'Rossese di Dolceacqua', type: 'Red', country: 'Italy', region: 'Liguria', subRegion: 'Dolceacqua', grapeVariety: 'Rossese', classification: 'DOC', minVintage: 1972, avgPrice: 18, producers: ['Terre Bianche', 'Lupi', 'Maccario Dringenberg'] },
  
  // VALLE D'AOSTA
  { id: 'valle-daosta-nebbiolo', name: 'Valle d\'Aosta Nebbiolo', type: 'Red', country: 'Italy', region: 'Valle d\'Aosta', grapeVariety: 'Nebbiolo', classification: 'DOC', minVintage: 1985, avgPrice: 25, producers: ['Les Crêtes', 'Grosjean', 'Anselmet'] },
  { id: 'valle-daosta-petite-arvine', name: 'Valle d\'Aosta Petite Arvine', type: 'White', country: 'Italy', region: 'Valle d\'Aosta', grapeVariety: 'Petite Arvine', classification: 'DOC', minVintage: 1985, avgPrice: 22, producers: ['Les Crêtes', 'Grosjean', 'Cave du Vin Blanc de Morgex'] },
  
  // MORE CHIANTI VARIATIONS
  { id: 'chianti-rufina', name: 'Chianti Rufina', type: 'Red', country: 'Italy', region: 'Tuscany', subRegion: 'Rufina', grapeVariety: 'Sangiovese', classification: 'DOCG', minVintage: 1984, avgPrice: 20, producers: ['Selvapiana', 'Frescobaldi', 'Fattoria di Basciano'] },
  { id: 'chianti-colli-senesi', name: 'Chianti Colli Senesi', type: 'Red', country: 'Italy', region: 'Tuscany', subRegion: 'Colli Senesi', grapeVariety: 'Sangiovese', classification: 'DOCG', minVintage: 1984, avgPrice: 15, producers: ['Geografico', 'Fattoria di Fèlsina', 'Castello di Farnetella'] },
  { id: 'chianti-colli-fiorentini', name: 'Chianti Colli Fiorentini', type: 'Red', country: 'Italy', region: 'Tuscany', subRegion: 'Colli Fiorentini', grapeVariety: 'Sangiovese', classification: 'DOCG', minVintage: 1984, avgPrice: 15, producers: ['Castello di Poppiano', 'Fattoria di Bacchereto'] },
  
  // ADDITIONAL PREMIUM WINES
  { id: 'flaccianello', name: 'Flaccianello della Pieve', type: 'Red', country: 'Italy', region: 'Tuscany', grapeVariety: 'Sangiovese', minVintage: 1981, avgPrice: 150, producers: ['Fontodi'] },
  { id: 'cepparello', name: 'Cepparello', type: 'Red', country: 'Italy', region: 'Tuscany', grapeVariety: 'Sangiovese', minVintage: 1980, avgPrice: 90, producers: ['Isole e Olena'] },
  { id: 'fontalloro', name: 'Fontalloro', type: 'Red', country: 'Italy', region: 'Tuscany', grapeVariety: 'Sangiovese', minVintage: 1981, avgPrice: 80, producers: ['Fèlsina'] },
  { id: 'rancia', name: 'Rancia', type: 'Red', country: 'Italy', region: 'Tuscany', grapeVariety: 'Sangiovese', minVintage: 1983, avgPrice: 70, producers: ['Fèlsina'] },
  { id: 'montevertine', name: 'Le Pergole Torte', type: 'Red', country: 'Italy', region: 'Tuscany', grapeVariety: 'Sangiovese', minVintage: 1977, avgPrice: 120, producers: ['Montevertine'] },
  { id: 'percarlo', name: 'Percarlo', type: 'Red', country: 'Italy', region: 'Tuscany', grapeVariety: 'Sangiovese', minVintage: 1981, avgPrice: 100, producers: ['San Giusto a Rentennano'] },
  { id: 'sammarco', name: 'Sammarco', type: 'Red', country: 'Italy', region: 'Tuscany', grapeVariety: 'Cabernet Sauvignon', minVintage: 1980, avgPrice: 90, producers: ['Castello dei Rampolla'] },
  { id: 'paleo-rosso', name: 'Paleo Rosso', type: 'Red', country: 'Italy', region: 'Tuscany', subRegion: 'Bolgheri', grapeVariety: 'Cabernet Franc', minVintage: 1989, avgPrice: 120, producers: ['Le Macchiole'] },
  { id: 'messorio', name: 'Messorio', type: 'Red', country: 'Italy', region: 'Tuscany', subRegion: 'Bolgheri', grapeVariety: 'Merlot', minVintage: 1994, avgPrice: 180, producers: ['Le Macchiole'] },
  { id: 'camarcanda', name: 'Camarcanda', type: 'Red', country: 'Italy', region: 'Tuscany', subRegion: 'Bolgheri', grapeVariety: 'Merlot, Cabernet Sauvignon, Cabernet Franc', minVintage: 2000, avgPrice: 100, producers: ['Gaja'] },
  { id: 'promis', name: 'Promis', type: 'Red', country: 'Italy', region: 'Tuscany', subRegion: 'Bolgheri', grapeVariety: 'Merlot, Syrah, Sangiovese', minVintage: 2001, avgPrice: 40, producers: ['Gaja'] },
  
  // ADDITIONAL BAROLO CRUS
  { id: 'barolo-cannubi', name: 'Barolo Cannubi', type: 'Red', country: 'Italy', region: 'Piedmont', subRegion: 'Barolo', grapeVariety: 'Nebbiolo', classification: 'DOCG', minVintage: 1850, avgPrice: 120, producers: ['Luciano Sandrone', 'Paolo Scavino', 'Marchesi di Barolo', 'Burlotto'] },
  { id: 'barolo-brunate', name: 'Barolo Brunate', type: 'Red', country: 'Italy', region: 'Piedmont', subRegion: 'Barolo', grapeVariety: 'Nebbiolo', classification: 'DOCG', minVintage: 1850, avgPrice: 110, producers: ['Vietti', 'Ceretto', 'Marcarini'] },
  { id: 'barolo-bussia', name: 'Barolo Bussia', type: 'Red', country: 'Italy', region: 'Piedmont', subRegion: 'Barolo', grapeVariety: 'Nebbiolo', classification: 'DOCG', minVintage: 1850, avgPrice: 100, producers: ['Prunotto', 'Aldo Conterno', 'Parusso'] },
  { id: 'barolo-monprivato', name: 'Barolo Monprivato', type: 'Red', country: 'Italy', region: 'Piedmont', subRegion: 'Barolo', grapeVariety: 'Nebbiolo', classification: 'DOCG', minVintage: 1850, avgPrice: 150, producers: ['Giuseppe Mascarello'] },
  { id: 'barolo-rocche-di-castiglione', name: 'Barolo Rocche di Castiglione', type: 'Red', country: 'Italy', region: 'Piedmont', subRegion: 'Barolo', grapeVariety: 'Nebbiolo', classification: 'DOCG', minVintage: 1850, avgPrice: 130, producers: ['Vietti', 'Brovia'] },
];

// Export count for verification
export const italianWinesCount = italianWines.length;
