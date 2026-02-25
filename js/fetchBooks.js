/**
 * fetchBooks.js - API Integration Module
 * Lab 3: Fetch real book data from Open Library API
 * 
 * This module demonstrates:
 * - Fetch API with async/await
 * - Error handling for API calls
 * - JSON response parsing
 * - Loading states
 */

// Base URL for Open Library API
const API_BASE_URL = 'https://openlibrary.org';

/**
 * Fetch books from Open Library API based on search query
 * @param {string} query - The search term (default: 'programming')
 * @returns {Promise<Array>} - Promise resolving to array of books
 */
export async function fetchBooks(query = 'programming') {
    try {
        // Show loading state (spinner will be shown by main.js)
        console.log(`Fetching books for: ${query}`);
        
        // Construct the API URL with search query
        // limit=20 restricts to 20 results for performance
        const url = `${API_BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=20`;
        
        // Fetch data from API
        // fetch() returns a Promise that resolves to a Response object
        const response = await fetch(url);
        
        // Check if the response is OK (status 200-299)
        if (!response.ok) {
            // This handles HTTP errors like 404, 500
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Parse JSON response
        // response.json() returns a Promise that resolves to the parsed JSON data
        const data = await response.json();
        
        // Open Library returns books in the 'docs' array
        // If no docs, return empty array
        return data.docs || [];
        
    } catch (error) {
        // Handle network errors or other exceptions
        console.error('Error fetching books:', error);
        
        // Re-throw a user-friendly error message
        throw new Error('Failed to load books. Please check your internet connection and try again.');
    }
}

/**
 * Search for books by title
 * @param {string} query - Search term
 * @returns {Promise<Array>} - Promise resolving to array of books
 */
export async function searchBooks(query) {
    // Don't search for empty queries
    if (!query || query.trim() === '') {
        return [];
    }
    
    try {
        // Reuse fetchBooks with the search query
        return await fetchBooks(query);
    } catch (error) {
        console.error('Search failed:', error);
        throw error;
    }
}

/**
 * Fetch a specific book by ID (bonus feature)
 * @param {string} bookId - Open Library ID (e.g., 'OL12345M')
 * @returns {Promise<object>} - Book details
 */
export async function fetchBookById(bookId) {
    try {
        const url = `${API_BASE_URL}/books/${bookId}.json`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Book not found: ${bookId}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching book details:', error);
        throw error;
    }
}