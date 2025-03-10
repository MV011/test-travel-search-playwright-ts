/**
 * Represents the conditions for searching accommodations or properties.
 *
 * This interface defines the various search parameters that can be used
 * to filter and sort properties based on user preferences such as location,
 * dates, number of guests, and specific amenities.
 */
export interface SearchConditions {
    searchTerm?: string;
    checkInDate?: string;
    checkOutDate?: string;
    guests?: {
        adults: number;
        children: number;
    }
    sortOrder?: 'Relevance' | 'Lowest price' | 'Highest rating' | 'Most reviewed';
    amenities?: string[];
    propertyTypes?: string[];
    prices?: {
        min: number;
        max: number;
    };
    freeCancellation?: boolean;
    minRating?: number;
    hotelClass?: string;
}
