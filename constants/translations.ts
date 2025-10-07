export const translations = {
  appName: 'Patrizia WineOS',
  inventory: 'Inventario',
  add: 'Aggiungi',
  settings: 'Impostazioni',
  dailySales: 'Vendite del Giorno',
  wine: {
    name: 'Nome',
    year: 'Anno',
    country: 'Paese',
    region: 'Regione',
    supplier: 'Fornitore',
    purchasePrice: 'Prezzo Acquisto',
    sellingPrice: 'Prezzo Vendita',
    quantity: 'Quantità',
    minQuantity: 'Quantità Minima',
    quantityTarget: 'Bottiglie da tenere in inventario',
    averageWeeklySales: 'Media Vendite Settimanali',
    lastUpdated: 'Ultimo Aggiornamento',
    notes: 'Note',
    sales: 'Vendite',
    soldBottles: 'Bottiglie Vendute',
    saleDate: 'Data Vendita',
    saleQuantity: 'Quantità Venduta',
    suggestedReorderQuantity: 'Quantità Consigliata da Riordinare'
  },
  actions: {
    save: 'Salva',
    cancel: 'Annulla',
    edit: 'Modifica',
    delete: 'Elimina',
    confirm: 'Conferma',
    back: 'Indietro',
    add: 'Aggiungi',
    addAnother: 'Aggiungi un altro vino',
    sell: 'Vendi',
    restock: 'Riempi',
    export: 'Esporta Dati',
    import: 'Importa Dati',
    backup: 'Backup',
    restore: 'Ripristina',
    search: 'Cerca',
    filter: 'Filtra',
    clear: 'Cancella',
    sync: 'Sincronizza'
  },
  filters: {
    all: 'Tutti',
    country: 'Paese',
    region: 'Regione',
    reorderStatus: 'Stato Riordino'
  },
  reorderStatus: {
    ok: 'OK',
    warning: 'Attenzione',
    urgent: 'Urgente'
  },
  emptyState: {
    title: 'Nessun vino trovato',
    description: 'Aggiungi il tuo primo vino premendo il pulsante in basso',
    noSales: 'Nessuna vendita oggi',
    noSalesDescription: 'Registra la tua prima vendita del giorno'
  },
  formValidation: {
    required: 'Campo obbligatorio',
    positiveNumber: 'Deve essere un numero positivo',
    validYear: 'Anno non valido',
    noStock: 'Non ci sono bottiglie disponibili',
    insufficientStock: 'Quantità insufficiente in magazzino',
    duplicateEntry: 'Questo vino è già stato registrato'
  },
  sales: {
    title: 'Registra Vendita',
    quantity: 'Quantità',
    date: 'Data',
    submit: 'Registra',
    history: 'Storico Vendite',
    noSales: 'Nessuna vendita registrata',
    success: 'Vendita registrata con successo',
    dailySales: 'Vendite del Giorno',
    selectWine: 'Seleziona Vino',
    todaySales: 'Vendite di Oggi',
    weeklySales: 'Vendite Settimanali',
    monthlySales: 'Vendite Mensili'
  },
  export: {
    success: 'Dati esportati con successo',
    error: 'Errore durante l\'esportazione dei dati'
  },
  dashboard: {
    title: 'Dashboard',
    totalWines: 'Vini Totali',
    lowStock: 'Da Riordinare',
    outOfStock: 'Esauriti',
    topSelling: 'Più Venduti',
    weeklySales: 'Vendite Settimana',
    totalBottles: 'Bottiglie Totali'
  },
  notifications: {
    wineAdded: 'Vino aggiunto con successo all\'inventario',
    wineUpdated: 'Vino aggiornato con successo',
    restockSuccess: 'Inventario aggiornato con successo',
    similarWineFound: 'Hai già inserito un vino simile',
    addAnyway: 'Aggiungi Comunque',
    editExisting: 'Modifica Vino Esistente',
    cancel: 'Annulla',
    reorderNeeded: 'Attenzione: Hai solo {quantity} bottiglie di {wine} ma il tuo stock ideale è {target}. È tempo di riordinare.',
    backupCreated: 'Backup creato con successo',
    backupRestored: 'Backup ripristinato con successo',
    syncComplete: 'Sincronizzazione completata',
    syncError: 'Errore durante la sincronizzazione'
  },
  sync: {
    status: 'Stato sincronizzazione',
    lastSync: 'Ultima sincronizzazione',
    synced: 'Sincronizzato',
    syncing: 'Sincronizzazione in corso',
    offline: 'Offline',
    enable: 'Attiva sincronizzazione',
    disable: 'Disattiva sincronizzazione'
  }
};