/**
 * Simple date utility
 */

/**
 * Gets the current date in YYYY-MM-DD format
 */
export function getCurrentDate(): string {
    return formatDate(new Date());
}

/**
 * Adds or subtracts days from a date
 * @param days Positive to add days, negative to subtract days
 * @param startDate Optional starting date (defaults to today)
 */
export function getDateWithOffset(days: number, startDate?: Date | string): string {
    // Use provided date or default to today
    const baseDate = startDate
        ? (typeof startDate === 'string' ? parseDate(startDate) : startDate)
        : new Date();

    // Calculate new date
    const newDate = new Date(baseDate);
    newDate.setDate(newDate.getDate() + days);

    return formatDate(newDate);
}

/**
 * Formats a date as YYYY-MM-DD
 */
function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

/**
 * Parses a YYYY-MM-DD string into a Date
 */
function parseDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}


/**
 * Calculates the difference in days between two dates.
 *
 * @param {string} date1 - The first date in string format.
 * @param {string} date2 - The second date in string format.
 * @return {number} The difference in days between the two dates. A positive value indicates that date1 is earlier than date2, and a negative value indicates that date1 is later.
 */
export function getDateDifference(date1: string, date2: string): number {
    const firstDate = parseDate(date1);
    const secondDate = parseDate(date2);
    const diffInMs = secondDate.getTime() - firstDate.getTime();
    return Math.round(diffInMs / (1000 * 60 * 60 * 24));
}