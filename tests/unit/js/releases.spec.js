import { generateReleaseData } from '../../../git/src/data/releases.js';

describe('generateReleaseData', () => {
  // Existing basic tests
  test('should generate release data with version and date', () => {
    const result = generateReleaseData('1.0.0');
    
    expect(result).toHaveProperty('version', '1.0.0');
    expect(result).toHaveProperty('date');
    expect(result.date).toBeInstanceOf(Date);
  });

  test('should include release notes when provided', () => {
    const notes = 'Bug fixes and improvements';
    const result = generateReleaseData('1.1.0', notes);
    
    expect(result).toHaveProperty('notes', notes);
  });

  test('should generate unique release ID', () => {
    const result1 = generateReleaseData('1.0.0');
    const result2 = generateReleaseData('1.0.0');
    
    expect(result1.id).not.toBe(result2.id);
  });

  // Enhanced comprehensive test coverage
  describe('Version Validation', () => {
    test('should handle semantic versioning correctly', () => {
      const validVersions = [
        '1.0.0',
        '2.1.3', 
        '10.15.7',
        '0.0.1',
        '1.0.0-alpha',
        '1.0.0-beta.1',
        '1.0.0-rc.1'
      ];

      validVersions.forEach(version => {
        const result = generateReleaseData(version);
        expect(result.version).toBe(version);
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('date');
      });
    });

    test('should handle invalid version formats gracefully', () => {
      const invalidVersions = [
        '',
        null,
        undefined,
        'v1.0.0',
        '1',
        '1.0',
        '1.0.0.0',
        'latest',
        'invalid-version'
      ];

      invalidVersions.forEach(version => {
        expect(() => generateReleaseData(version)).toThrow();
      });
    });

    test('should validate version format strictly', () => {
      expect(() => generateReleaseData('1.0')).toThrow('Invalid version format');
      expect(() => generateReleaseData('1.0.0.0')).toThrow('Invalid version format');
      expect(() => generateReleaseData('v1.0.0')).toThrow('Invalid version format');
    });
  });

  describe('Release Notes Handling', () => {
    test('should handle empty release notes', () => {
      const result = generateReleaseData('1.0.0', '');
      expect(result.notes).toBe('');
    });

    test('should handle null release notes', () => {
      const result = generateReleaseData('1.0.0', null);
      expect(result.notes).toBeNull();
    });

    test('should handle undefined release notes', () => {
      const result = generateReleaseData('1.0.0', undefined);
      expect(result.notes).toBeUndefined();
    });

    test('should handle very long release notes', () => {
      const longNotes = 'A'.repeat(10000);
      const result = generateReleaseData('1.0.0', longNotes);
      expect(result.notes).toBe(longNotes);
      expect(result.notes.length).toBe(10000);
    });

    test('should handle release notes with special characters', () => {
      const specialNotes = 'Release notes with special chars: @#$%^&*()[]{}|\\:";\'<>?,./ and unicode: 你好 🚀';
      const result = generateReleaseData('1.0.0', specialNotes);
      expect(result.notes).toBe(specialNotes);
    });

    test('should handle multiline release notes', () => {
      const multilineNotes = `First line
      Second line with spaces
      
      Fourth line after empty line`;
      const result = generateReleaseData('1.0.0', multilineNotes);
      expect(result.notes).toBe(multilineNotes);
    });

    test('should preserve markdown formatting in notes', () => {
      const markdownNotes = `# Release Notes
      ## Features
      - Feature 1
      - Feature 2
      
      ## Bug Fixes
      * Fix 1
      * Fix 2`;
      const result = generateReleaseData('1.0.0', markdownNotes);
      expect(result.notes).toBe(markdownNotes);
    });
  });

  describe('Generated Properties', () => {
    test('should generate valid date objects', () => {
      const result = generateReleaseData('1.0.0');
      expect(result.date).toBeInstanceOf(Date);
      expect(result.date.getTime()).not.toBeNaN();
      expect(result.date.getTime()).toBeLessThanOrEqual(Date.now());
    });

    test('should generate unique IDs for concurrent calls', () => {
      const results = Array(100).fill(null).map(() => generateReleaseData('1.0.0'));
      const ids = results.map(r => r.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(ids.length);
    });

    test('should generate IDs with consistent format', () => {
      const result = generateReleaseData('1.0.0');
      expect(typeof result.id).toBe('string');
      expect(result.id.length).toBeGreaterThan(0);
      // Assuming UUID-like format or similar consistent pattern
      expect(result.id).toMatch(/^[a-zA-Z0-9-_]+$/);
    });

    test('should include all required properties', () => {
      const result = generateReleaseData('1.0.0', 'Test notes');
      const requiredProperties = ['version', 'date', 'id', 'notes'];
      
      requiredProperties.forEach(prop => {
        expect(result).toHaveProperty(prop);
      });
    });

    test('should not include undefined properties', () => {
      const result = generateReleaseData('1.0.0');
      const keys = Object.keys(result);
      
      keys.forEach(key => {
        expect(result[key]).toBeDefined();
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle extremely long version strings', () => {
      const longVersion = '1'.repeat(1000) + '.0.0';
      expect(() => generateReleaseData(longVersion)).toThrow();
    });

    test('should handle version with leading/trailing whitespace', () => {
      expect(() => generateReleaseData('  1.0.0  ')).toThrow('Invalid version format');
    });

    test('should handle version with internal whitespace', () => {
      expect(() => generateReleaseData('1. 0.0')).toThrow('Invalid version format');
    });

    test('should handle negative version numbers', () => {
      expect(() => generateReleaseData('-1.0.0')).toThrow('Invalid version format');
      expect(() => generateReleaseData('1.-1.0')).toThrow('Invalid version format');
      expect(() => generateReleaseData('1.0.-1')).toThrow('Invalid version format');
    });

    test('should handle floating point version numbers', () => {
      expect(() => generateReleaseData('1.0.0.5')).toThrow('Invalid version format');
      expect(() => generateReleaseData('1.5.5.5')).toThrow('Invalid version format');
    });

    test('should handle version with non-numeric characters', () => {
      expect(() => generateReleaseData('1.a.0')).toThrow('Invalid version format');
      expect(() => generateReleaseData('a.0.0')).toThrow('Invalid version format');
    });
  });

  describe('Performance Tests', () => {
    test('should handle rapid successive calls efficiently', () => {
      const startTime = Date.now();
      const results = Array(1000).fill(null).map((_, i) => 
        generateReleaseData(`1.0.${i}`, `Release notes ${i}`)
      );
      const endTime = Date.now();
      
      expect(results).toHaveLength(1000);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });

    test('should maintain performance with large release notes', () => {
      const largeNotes = 'A'.repeat(100000);
      const startTime = Date.now();
      const result = generateReleaseData('1.0.0', largeNotes);
      const endTime = Date.now();
      
      expect(result.notes).toBe(largeNotes);
      expect(endTime - startTime).toBeLessThan(100); // Should complete quickly
    });
  });

  describe('Type Safety and Validation', () => {
    test('should handle numeric version input', () => {
      expect(() => generateReleaseData(1.0)).toThrow('Version must be a string');
    });

    test('should handle boolean version input', () => {
      expect(() => generateReleaseData(true)).toThrow('Version must be a string');
      expect(() => generateReleaseData(false)).toThrow('Version must be a string');
    });

    test('should handle array version input', () => {
      expect(() => generateReleaseData([1, 0, 0])).toThrow('Version must be a string');
    });

    test('should handle object version input', () => {
      expect(() => generateReleaseData({ version: '1.0.0' })).toThrow('Version must be a string');
    });

    test('should validate notes parameter type flexibility', () => {
      // String notes should work
      expect(() => generateReleaseData('1.0.0', 'string notes')).not.toThrow();
      
      // Number notes should be converted or handled appropriately
      const result = generateReleaseData('1.0.0', 123);
      expect(typeof result.notes).toBe('number');
    });
  });

  describe('Integration and Compatibility', () => {
    test('should work with different JavaScript environments', () => {
      // Test in strict mode context
      'use strict';
      const result = generateReleaseData('1.0.0');
      expect(result).toBeDefined();
    });

    test('should handle concurrent execution safely', async () => {
      const promises = Array(50).fill(null).map(async (_, i) => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(generateReleaseData(`1.0.${i}`, `Notes ${i}`));
          }, Math.random() * 10);
        });
      });

      const results = await Promise.all(promises);
      expect(results).toHaveLength(50);
      
      // Verify all results are valid and unique
      const ids = results.map(r => r.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(50);
    });

    test('should maintain referential integrity', () => {
      const result1 = generateReleaseData('1.0.0', 'notes');
      const result2 = generateReleaseData('1.0.0', 'notes');
      
      // Same input should produce different objects
      expect(result1).not.toBe(result2);
      expect(result1.id).not.toBe(result2.id);
      
      // But same values for same inputs (except unique fields)
      expect(result1.version).toBe(result2.version);
      expect(result1.notes).toBe(result2.notes);
    });
  });

  describe('Memory and Resource Management', () => {
    test('should not cause memory leaks with repeated calls', () => {
      const initialMemory = process.memoryUsage?.()?.heapUsed || 0;
      
      // Generate many releases
      for (let i = 0; i < 10000; i++) {
        generateReleaseData(`1.0.${i}`, `Notes for release ${i}`);
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage?.()?.heapUsed || 0;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 50MB for 10k releases)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    });

    test('should handle cleanup properly', () => {
      let result = generateReleaseData('1.0.0', 'notes');
      const id = result.id;
      
      // Clear reference
      result = null;
      
      // Generate new release
      const newResult = generateReleaseData('1.0.1', 'new notes');
      
      // Should not reuse the old ID
      expect(newResult.id).not.toBe(id);
    });
  });

  describe('Internationalization and Localization', () => {
    test('should handle Unicode version strings', () => {
      // While not standard, test robustness
      expect(() => generateReleaseData('1.0.0-β')).toThrow('Invalid version format');
    });

    test('should handle international characters in notes', () => {
      const internationalNotes = 'Release notes: 中文 العربية русский 日本語 한국어 ñáéíóú';
      const result = generateReleaseData('1.0.0', internationalNotes);
      expect(result.notes).toBe(internationalNotes);
    });

    test('should handle right-to-left text in notes', () => {
      const rtlNotes = 'مرحبا بك في الإصدار الجديد من البرنامج';
      const result = generateReleaseData('1.0.0', rtlNotes);
      expect(result.notes).toBe(rtlNotes);
    });

    test('should handle mixed direction text', () => {
      const mixedNotes = 'Version 1.0.0 البرنامج الجديد with English and العربية';
      const result = generateReleaseData('1.0.0', mixedNotes);
      expect(result.notes).toBe(mixedNotes);
    });
  });

  describe('Security Considerations', () => {
    test('should not execute code injection in version string', () => {
      const maliciousVersion = '1.0.0; console.log("injected")';
      expect(() => generateReleaseData(maliciousVersion)).toThrow('Invalid version format');
    });

    test('should handle script tags in release notes safely', () => {
      const maliciousNotes = '<script>alert("xss")</script>';
      const result = generateReleaseData('1.0.0', maliciousNotes);
      expect(result.notes).toBe(maliciousNotes); // Should store as-is, sanitization happens at display time
    });

    test('should handle SQL injection patterns in inputs', () => {
      const sqlInjection = "1.0.0'; DROP TABLE releases; --";
      expect(() => generateReleaseData(sqlInjection)).toThrow('Invalid version format');
    });

    test('should limit input size to prevent DoS attacks', () => {
      const hugeBuf = 'A'.repeat(10 * 1024 * 1024); // 10MB string
      expect(() => generateReleaseData('1.0.0', hugeBuf)).toThrow('Input too large');
    });
  });
});