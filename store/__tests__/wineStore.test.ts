import { renderHook, act } from '@testing-library/react-native';
import { useWineStore } from '../wineStore';
import { Wine } from '@/types/wine';

// Helper to create mock wine
const createMockWine = (overrides: Partial<Wine> = {}): Omit<Wine, 'id' | 'lastUpdated' | 'sales'> => ({
  name: 'Test Wine',
  year: 2020,
  type: 'Red',
  country: 'Italy',
  region: 'Tuscany',
  grapeVariety: 'Sangiovese',
  supplier: 'Test Supplier',
  purchasePrice: 10,
  sellingPrice: 20,
  quantity: 100,
  minQuantity: 10,
  quantityTarget: 50,
  averageWeeklySales: 5,
  notes: 'Test notes',
  ...overrides,
});

describe('WineStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useWineStore());
    act(() => {
      result.current.clearAllData();
    });
  });

  describe('addWine', () => {
    it('should add a wine to the store', () => {
      const { result } = renderHook(() => useWineStore());
      const mockWine = createMockWine();

      act(() => {
        result.current.addWine(mockWine);
      });

      expect(result.current.wines).toHaveLength(1);
      expect(result.current.wines[0].name).toBe('Test Wine');
      expect(result.current.wines[0].id).toBeDefined();
      expect(result.current.wines[0].lastUpdated).toBeDefined();
      expect(result.current.wines[0].sales).toEqual([]);
    });

    it('should initialize sales as empty array', () => {
      const { result } = renderHook(() => useWineStore());
      const mockWine = createMockWine();

      act(() => {
        result.current.addWine(mockWine);
      });

      expect(result.current.wines[0].sales).toEqual([]);
    });
  });

  describe('updateWine', () => {
    it('should update an existing wine', () => {
      const { result } = renderHook(() => useWineStore());
      const mockWine = createMockWine();

      act(() => {
        result.current.addWine(mockWine);
      });

      const wineId = result.current.wines[0]?.id;
      expect(wineId).toBeDefined();

      act(() => {
        result.current.updateWine(wineId, { quantity: 50 });
      });

      expect(result.current.wines[0].quantity).toBe(50);
      expect(result.current.wines[0].name).toBe('Test Wine'); // Other fields unchanged
    });

    it('should update lastUpdated timestamp', (done) => {
      const { result } = renderHook(() => useWineStore());
      const mockWine = createMockWine();

      act(() => {
        result.current.addWine(mockWine);
      });

      const wineId = result.current.wines[0]?.id;
      const originalTimestamp = result.current.wines[0]?.lastUpdated;
      expect(wineId).toBeDefined();
      expect(originalTimestamp).toBeDefined();

      // Wait a bit to ensure timestamp changes
      setTimeout(() => {
        act(() => {
          result.current.updateWine(wineId, { quantity: 50 });
        });

        expect(result.current.wines[0].lastUpdated).not.toBe(originalTimestamp);
        done();
      }, 10);
    });
  });

  describe('deleteWine', () => {
    it('should delete a wine from the store', () => {
      const { result } = renderHook(() => useWineStore());
      const mockWine = createMockWine();

      act(() => {
        result.current.addWine(mockWine);
      });

      const wineId = result.current.wines[0]?.id;
      expect(wineId).toBeDefined();

      act(() => {
        result.current.deleteWine(wineId);
      });

      expect(result.current.wines).toHaveLength(0);
    });
  });

  describe('getReorderStatus', () => {
    it('should return "urgent" when quantity is 0', () => {
      const { result } = renderHook(() => useWineStore());
      const mockWine = createMockWine({ quantity: 0, minQuantity: 10 });

      act(() => {
        result.current.addWine(mockWine);
      });

      const wine = result.current.wines[0];
      const status = result.current.getReorderStatus(wine);
      expect(status).toBe('urgent');
    });

    it('should return "urgent" when quantity is below minQuantity', () => {
      const { result } = renderHook(() => useWineStore());
      const mockWine = createMockWine({ quantity: 5, minQuantity: 10 });

      act(() => {
        result.current.addWine(mockWine);
      });

      const wine = result.current.wines[0];
      const status = result.current.getReorderStatus(wine);
      expect(status).toBe('urgent');
    });

    it('should return "warning" when quantity is below target but above min', () => {
      const { result } = renderHook(() => useWineStore());
      const mockWine = createMockWine({ quantity: 30, minQuantity: 10, quantityTarget: 50 });

      act(() => {
        result.current.addWine(mockWine);
      });

      const wine = result.current.wines[0];
      const status = result.current.getReorderStatus(wine);
      expect(status).toBe('warning');
    });

    it('should return "ok" when quantity is at or above target', () => {
      const { result } = renderHook(() => useWineStore());
      const mockWine = createMockWine({ quantity: 60, minQuantity: 10, quantityTarget: 50 });

      act(() => {
        result.current.addWine(mockWine);
      });

      const wine = result.current.wines[0];
      const status = result.current.getReorderStatus(wine);
      expect(status).toBe('ok');
    });
  });

  describe('getSuggestedReorderQuantity', () => {
    it('should suggest quantity to reach target', () => {
      const { result } = renderHook(() => useWineStore());
      const mockWine = createMockWine({ quantity: 10, quantityTarget: 30 });

      act(() => {
        result.current.addWine(mockWine);
      });

      const wine = result.current.wines[0];
      const suggested = result.current.getSuggestedReorderQuantity(wine);
      // Should round up to nearest multiple of 6 (wine case)
      // 30 - 10 = 20, rounded up to 24 (4 cases)
      expect(suggested).toBe(24);
    });

    it('should return 0 when quantity is at target', () => {
      const { result } = renderHook(() => useWineStore());
      const mockWine = createMockWine({ quantity: 50, quantityTarget: 50 });

      act(() => {
        result.current.addWine(mockWine);
      });

      const wine = result.current.wines[0];
      const suggested = result.current.getSuggestedReorderQuantity(wine);
      expect(suggested).toBe(0);
    });

    it('should round up to nearest case of 6', () => {
      const { result } = renderHook(() => useWineStore());
      const mockWine = createMockWine({ quantity: 10, quantityTarget: 20 });

      act(() => {
        result.current.addWine(mockWine);
      });

      const wine = result.current.wines[0];
      const suggested = result.current.getSuggestedReorderQuantity(wine);
      // 20 - 10 = 10, rounded up to 12 (2 cases)
      expect(suggested).toBe(12);
    });
  });

  describe('recordSale', () => {
    it('should record a sale and reduce quantity', () => {
      const { result } = renderHook(() => useWineStore());
      const mockWine = createMockWine({ quantity: 100 });

      act(() => {
        result.current.addWine(mockWine);
      });

      const wineId = result.current.wines[0]?.id;
      expect(wineId).toBeDefined();

      act(() => {
        result.current.recordSale(wineId, 10, '2024-01-01');
      });

      expect(result.current.wines[0].quantity).toBe(90);
      expect(result.current.wines[0].sales).toHaveLength(1);
      expect(result.current.wines[0].sales[0].quantity).toBe(10);
      expect(result.current.wines[0].sales[0].date).toBe('2024-01-01');
    });

    it('should not allow negative quantity', () => {
      const { result } = renderHook(() => useWineStore());
      const mockWine = createMockWine({ quantity: 5 });

      act(() => {
        result.current.addWine(mockWine);
      });

      const wineId = result.current.wines[0]?.id;
      expect(wineId).toBeDefined();

      act(() => {
        result.current.recordSale(wineId, 10, '2024-01-01');
      });

      // Should set to 0, not negative
      expect(result.current.wines[0].quantity).toBe(0);
    });
  });

  describe('searchWines', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useWineStore());
      act(() => {
        result.current.addWine(createMockWine({ name: 'Chianti Classico', region: 'Tuscany', year: 2020 }));
        result.current.addWine(createMockWine({ name: 'Barolo', region: 'Piedmont', year: 2018 }));
        result.current.addWine(createMockWine({ name: 'Brunello di Montalcino', region: 'Tuscany', year: 2019 }));
      });
    });

    it('should search by name', () => {
      const { result } = renderHook(() => useWineStore());
      const results = result.current.searchWines('Chianti');
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Chianti Classico');
    });

    it('should search by region', () => {
      const { result } = renderHook(() => useWineStore());
      const results = result.current.searchWines('Tuscany');
      expect(results).toHaveLength(2);
    });

    it('should search by year', () => {
      const { result } = renderHook(() => useWineStore());
      const results = result.current.searchWines('2020');
      expect(results).toHaveLength(1);
    });

    it('should be case insensitive', () => {
      const { result } = renderHook(() => useWineStore());
      const results = result.current.searchWines('chianti');
      expect(results).toHaveLength(1);
    });

    it('should return all wines for empty query', () => {
      const { result } = renderHook(() => useWineStore());
      const results = result.current.searchWines('');
      expect(results).toHaveLength(3);
    });
  });

  describe('getWinesNeedingReorder', () => {
    it('should return wines with warning or urgent status', () => {
      const { result } = renderHook(() => useWineStore());
      
      act(() => {
        result.current.addWine(createMockWine({ name: 'Wine 1', quantity: 5, minQuantity: 10, quantityTarget: 50 })); // urgent
        result.current.addWine(createMockWine({ name: 'Wine 2', quantity: 30, minQuantity: 10, quantityTarget: 50 })); // warning
        result.current.addWine(createMockWine({ name: 'Wine 3', quantity: 60, minQuantity: 10, quantityTarget: 50 })); // ok
      });

      const needingReorder = result.current.getWinesNeedingReorder();
      expect(needingReorder).toHaveLength(2);
    });
  });

  describe('exportDataAsJson', () => {
    it('should export wines as JSON string', () => {
      const { result } = renderHook(() => useWineStore());
      
      act(() => {
        result.current.addWine(createMockWine({ name: 'Export Test' }));
      });

      const jsonData = result.current.exportDataAsJson();
      const parsed = JSON.parse(jsonData);
      
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].name).toBe('Export Test');
    });
  });

  describe('importDataFromJson', () => {
    it('should import valid JSON data', () => {
      const { result } = renderHook(() => useWineStore());
      
      const mockData = [{
        id: '1',
        name: 'Imported Wine',
        year: 2021,
        country: 'Italy' as const,
        region: 'Tuscany',
        supplier: 'Test',
        purchasePrice: 10,
        sellingPrice: 20,
        quantity: 50,
        minQuantity: 10,
        quantityTarget: 40,
        averageWeeklySales: 5,
        lastUpdated: new Date().toISOString(),
        sales: [],
      }];

      act(() => {
        const success = result.current.importDataFromJson(JSON.stringify(mockData));
        expect(success).toBe(true);
      });

      expect(result.current.wines).toHaveLength(1);
      expect(result.current.wines[0].name).toBe('Imported Wine');
    });

    it('should reject invalid JSON', () => {
      const { result } = renderHook(() => useWineStore());
      
      act(() => {
        const success = result.current.importDataFromJson('invalid json');
        expect(success).toBe(false);
      });

      expect(result.current.wines).toHaveLength(0);
    });

    it('should reject non-array data', () => {
      const { result } = renderHook(() => useWineStore());
      
      act(() => {
        const success = result.current.importDataFromJson(JSON.stringify({ not: 'an array' }));
        expect(success).toBe(false);
      });

      expect(result.current.wines).toHaveLength(0);
    });
  });
});
