import { useState, useEffect } from 'react';

/**
 * Custom hook for formatting and managing current date
 * @returns {string} Formatted date string
 */
export const useFormattedDate = () => {
    const [currentDate, setCurrentDate] = useState<string>('');

    useEffect(() => {
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        setCurrentDate(new Date().toLocaleDateString('en-US', options));
    }, []);

    return currentDate;
};
