import { describe, it, expect, vi } from 'vitest';
import { formatDate, generateId, scrollToTop } from './helpers';

describe('formatDate', () => {
    it('formats a date with default options', () => {
        const date = new Date('2026-01-15T12:00:00Z');
        const result = formatDate(date);
        // Default format: "Wednesday, January 15, 2026"
        expect(result).toContain('January');
        expect(result).toContain('15');
        expect(result).toContain('2026');
    });

    it('formats a date with custom options', () => {
        const date = new Date('2026-06-01T12:00:00Z');
        const result = formatDate(date, { month: 'short', day: 'numeric' });
        expect(result).toContain('Jun');
        expect(result).toContain('1');
    });

    it('uses current date when no date is provided', () => {
        const result = formatDate();
        // Should not throw and should return a non-empty string
        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
    });
});

describe('generateId', () => {
    it('returns a string', () => {
        const id = generateId();
        expect(typeof id).toBe('string');
    });

    it('returns a valid UUID format', () => {
        const id = generateId();
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        expect(id).toMatch(uuidRegex);
    });

    it('generates unique IDs', () => {
        const ids = new Set(Array.from({ length: 100 }, () => generateId()));
        expect(ids.size).toBe(100);
    });
});

describe('scrollToTop', () => {
    it('calls window.scrollTo with correct arguments', () => {
        const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => { });
        scrollToTop();
        expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'instant' });
        scrollToSpy.mockRestore();
    });

    it('accepts a custom behavior', () => {
        const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => { });
        scrollToTop('smooth');
        expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
        scrollToSpy.mockRestore();
    });
});
