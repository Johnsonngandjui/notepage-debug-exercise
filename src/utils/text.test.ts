import {
  countCharacters,
  countCharactersExcludingSpaces,
  countWords,
  isBlank,
  normalizeForSearch,
  truncate,
} from './text';

describe('countWords', () => {
  it('returns 0 for an empty or whitespace-only string', () => {
    expect(countWords('')).toBe(0);
    expect(countWords('   \n  ')).toBe(0);
  });

  it('counts whitespace separated tokens', () => {
    expect(countWords('hello world')).toBe(2);
    expect(countWords('one two three four')).toBe(4);
  });

  it('ignores leading, trailing and repeated whitespace', () => {
    expect(countWords('  spaced   out  ')).toBe(2);
    expect(countWords('line one\nline two')).toBe(4);
  });

  it('treats hyphenated and apostrophised words as single words', () => {
    expect(countWords("don't stop")).toBe(2);
    expect(countWords('well-known example')).toBe(2);
  });
});

describe('character counts', () => {
  it('counts every character including whitespace', () => {
    expect(countCharacters('a b')).toBe(3);
    expect(countCharacters('')).toBe(0);
  });

  it('excludes whitespace when asked to', () => {
    expect(countCharactersExcludingSpaces('a b')).toBe(2);
    expect(countCharactersExcludingSpaces(' a \n b ')).toBe(2);
  });
});

describe('normalizeForSearch', () => {
  it('lower-cases and trims', () => {
    expect(normalizeForSearch('  Roadmap ')).toBe('roadmap');
  });
});

describe('truncate', () => {
  it('leaves short strings alone', () => {
    expect(truncate('short', 10)).toBe('short');
  });

  it('adds an ellipsis to long strings', () => {
    expect(truncate('abcdefghij', 5)).toBe('abcd…');
  });
});

describe('isBlank', () => {
  it('detects whitespace-only text', () => {
    expect(isBlank('   ')).toBe(true);
    expect(isBlank('  x ')).toBe(false);
  });
});
