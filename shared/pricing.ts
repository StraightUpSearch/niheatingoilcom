/**
 * Centralized pricing utility for NI Heating Oil
 * Handles all price calculations with consistent margins and formulas
 */

// Constants for pricing calculations
export const PRICING_CONFIG = {
  // Safety margin applied to all supplier prices for profitability
  SAFETY_MARGIN: 0.20, // 20% margin
  
  // Standard volume options
  STANDARD_VOLUMES: [300, 500, 900] as const,
  
  // Default volume for calculations
  DEFAULT_VOLUME: 500,
  
  // Minimum and maximum allowed volumes
  MIN_VOLUME: 100,
  MAX_VOLUME: 2000,
  
  // Price display precision
  PRICE_DECIMAL_PLACES: 2,
  PPL_DECIMAL_PLACES: 1,
} as const;

export type StandardVolume = typeof PRICING_CONFIG.STANDARD_VOLUMES[number];

/**
 * Calculate price for a specific volume based on base price and volume
 * @param basePrice - Original price for base volume
 * @param baseVolume - Original volume for base price
 * @param targetVolume - Desired volume to calculate price for
 * @returns Calculated price with safety margin applied
 */
export function calculateVolumePrice(
  basePrice: number, 
  baseVolume: number, 
  targetVolume: number
): number {
  // Validate inputs
  if (basePrice <= 0 || baseVolume <= 0 || targetVolume <= 0) {
    throw new Error('Invalid price calculation inputs: all values must be positive');
  }
  
  // Calculate price per litre
  const pricePerLitre = basePrice / baseVolume;
  
  // Calculate base price for target volume
  const baseCalculatedPrice = pricePerLitre * targetVolume;
  
  // Apply safety margin
  return baseCalculatedPrice * (1 + PRICING_CONFIG.SAFETY_MARGIN);
}

/**
 * Format price for display with currency symbol
 * @param price - Numeric price value
 * @returns Formatted price string (e.g., "£123.45")
 */
export function formatPrice(price: number): string {
  return `£${price.toFixed(PRICING_CONFIG.PRICE_DECIMAL_PLACES)}`;
}

/**
 * Calculate and format price per litre
 * @param totalPrice - Total price for the volume
 * @param volume - Volume in litres
 * @returns Formatted price per litre (e.g., "65.5 ppl")
 */
export function formatPricePerLitre(totalPrice: number, volume: number): string {
  if (volume <= 0) {
    throw new Error('Volume must be positive for price per litre calculation');
  }
  
  const ppl = (totalPrice / volume) * 100; // Convert to pence
  return `${ppl.toFixed(PRICING_CONFIG.PPL_DECIMAL_PLACES)} ppl`;
}

/**
 * Parse price string to number, handling currency symbols
 * @param priceString - Price string (e.g., "£123.45" or "123.45")
 * @returns Numeric price value
 */
export function parsePrice(priceString: string): number {
  const cleanedPrice = priceString.replace(/[£,]/g, '').trim();
  const price = parseFloat(cleanedPrice);
  
  if (isNaN(price)) {
    throw new Error(`Invalid price format: ${priceString}`);
  }
  
  return price;
}

/**
 * Validate if a volume is within acceptable range
 * @param volume - Volume to validate
 * @returns Boolean indicating if volume is valid
 */
export function isValidVolume(volume: number): boolean {
  return volume >= PRICING_CONFIG.MIN_VOLUME && 
         volume <= PRICING_CONFIG.MAX_VOLUME;
}

/**
 * Get the closest standard volume for a given volume
 * @param volume - Input volume
 * @returns Closest standard volume option
 */
export function getClosestStandardVolume(volume: number): StandardVolume {
  return PRICING_CONFIG.STANDARD_VOLUMES.reduce((closest, standard) => {
    return Math.abs(standard - volume) < Math.abs(closest - volume) 
      ? standard 
      : closest;
  });
}

/**
 * Calculate estimated savings compared to average price
 * @param actualPrice - The actual price being offered
 * @param averagePrice - The market average price
 * @returns Savings amount (positive if cheaper than average)
 */
export function calculateSavings(actualPrice: number, averagePrice: number): number {
  return Math.max(0, averagePrice - actualPrice);
}

/**
 * Calculate percentage discount from original price
 * @param originalPrice - Original price
 * @param discountedPrice - Discounted price
 * @returns Percentage discount (0-100)
 */
export function calculateDiscountPercentage(
  originalPrice: number, 
  discountedPrice: number
): number {
  if (originalPrice <= 0) return 0;
  const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
  return Math.max(0, Math.min(100, discount));
}