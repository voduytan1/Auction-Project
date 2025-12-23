/**
 * Vietnamese search utilities
 * Supports full-text search with Vietnamese without diacritics
 */

/**
 * Convert Vietnamese text to non-diacritic version
 * Example: "Điện thoại" -> "dien thoai"
 */
export function removeVietnameseTones(str: string): string {
  if (!str) return "";

  // Normalize to NFD (decomposed form)
  str = str.normalize("NFD");

  // Remove combining diacritical marks
  str = str.replace(/[\u0300-\u036f]/g, "");

  // Replace specific Vietnamese characters
  str = str.replace(/đ/g, "d").replace(/Đ/g, "D");

  return str.toLowerCase().trim();
}

/**
 * Check if search query matches text (Vietnamese-aware)
 * @param text - Text to search in
 * @param query - Search query
 * @returns true if query matches text
 */
export function vietnameseSearch(text: string, query: string): boolean {
  if (!query) return true;
  if (!text) return false;

  const normalizedText = removeVietnameseTones(text);
  const normalizedQuery = removeVietnameseTones(query);

  return normalizedText.includes(normalizedQuery);
}

/**
 * Search in multiple fields
 * @param item - Object to search in
 * @param query - Search query
 * @param fields - Fields to search in
 * @returns true if query matches any field
 */
export function multiFieldSearch<T extends Record<string, any>>(
  item: T,
  query: string,
  fields: (keyof T)[]
): boolean {
  if (!query) return true;

  return fields.some((field) => {
    const value = item[field];
    if (typeof value === "string") {
      return vietnameseSearch(value, query);
    }
    if (typeof value === "number") {
      return value.toString().includes(query);
    }
    return false;
  });
}

/**
 * Highlight matching text in search results
 * @param text - Original text
 * @param query - Search query to highlight
 * @returns Text with <mark> tags around matches
 */
export function highlightMatch(text: string, query: string): string {
  if (!query || !text) return text;

  const normalizedText = removeVietnameseTones(text);
  const normalizedQuery = removeVietnameseTones(query);

  const index = normalizedText.indexOf(normalizedQuery);
  if (index === -1) return text;

  // Find the actual position in original text
  const before = text.substring(0, index);
  const match = text.substring(index, index + query.length);
  const after = text.substring(index + query.length);

  return `${before}<mark class="bg-yellow-200 px-0.5">${match}</mark>${after}`;
}
