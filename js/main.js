/**
 * main.js - Main Application Entry Point
 * Lab 2: Handles homepage and favorites integration
 */

import { addToFavorites, getFavorites } from './favorites.js';

// Sample book data for Lab 2 testing
const sampleBooks = [
    {
        id: 'book1',
        title: 'The Great Gatsby',
        author_name: ['F. Scott Fitzgerald'],
        cover_i: 8423681,
        first_publish_year: 1925
    },
    {
        id: 'book2',
        title: 'To Kill a Mockingbird',
        author_name: ['Harper Lee'],
        cover_i: 8228691,
        first_publish_year: 1960
    },
    {
        id: 'book3',
        title: '1984',
        author_name: ['George Orwell'],
        cover_i: 8490785,
        first_publish_year: 1949
    },
    {
        id: 'book4',
        title: 'Pride and Prejudice',
        author_name: ['Jane Austen'],
        cover_i: 8411439,
        first_publish_year: 1813
    }
];

/**
 * Create a book card for homepage
 */
function createHomepageBookCard(book) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300';
    
    const title = book.title || 'Unknown Title';
    const author = book.author_name ? book.author_name.join(', ') : 'Unknown Author';
    const coverUrl = book.cover_i 
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` 
        : 'https://via.placeholder.com/200x300?text=No+Cover';
    
    // Check if this book is already in favorites
    const favorites = getFavorites();
    const isFavorite = favorites.some(fav => (fav.id || fav.key) === (book.id || book.key));
    
    // Button text and style based on favorite status
    const buttonText = isFavorite ? '✓ In Favorites' : 'Add to Favorites';
    const buttonClass = isFavorite 
        ? 'bg-green-500 hover:bg-green-600 cursor-default' 
        : 'bg-yellow-500 hover:bg-yellow-600';
    
    card.innerHTML = `
        <img src="${coverUrl}" alt="${title}" class="w-full h-48 object-cover">
        <div class="p-4">
            <h3 class="font-bold text-lg mb-1 truncate">${title}</h3>
            <p class="text-gray-600 text-sm mb-3">by ${author}</p>
            <p class="text-gray-500 text-xs mb-3">Published: ${book.first_publish_year || 'N/A'}</p>
            <button class="add-favorite-btn w-full py-2 px-4 rounded-lg text-white font-semibold transition ${buttonClass}" 
                    data-book-id="${book.id || book.key}"
                    ${isFavorite ? 'disabled' : ''}>
                ${buttonText}
            </button>
        </div>
    `;
    
    return card;
}

/**
 * Load sample books into the grid
 */
function loadSampleBooks() {
    const booksGrid = document.getElementById('booksGrid');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const noResultsMessage = document.getElementById('noResultsMessage');
    
    if (!booksGrid) return;
    
    // Hide spinner, show grid
    if (loadingSpinner) loadingSpinner.classList.add('hidden');
    if (noResultsMessage) noResultsMessage.classList.add('hidden');
    booksGrid.classList.remove('hidden');
    
    booksGrid.innerHTML = '';
    
    // Add each sample book to the grid
    sampleBooks.forEach(book => {
        const card = createHomepageBookCard(book);
        
        // Add event listener to the favorite button
        const favBtn = card.querySelector('.add-favorite-btn');
        if (favBtn && !favBtn.disabled) {
            favBtn.addEventListener('click', () => {
                const added = addToFavorites(book);
                if (added) {
                    favBtn.textContent = '✓ In Favorites';
                    favBtn.classList.remove('bg-yellow-500', 'hover:bg-yellow-600');
                    favBtn.classList.add('bg-green-500', 'hover:bg-green-600');
                    favBtn.disabled = true;
                    alert(`"${book.title}" added to favorites!`);
                } else {
                    alert('Book already in favorites!');
                }
            });
        }
        
        booksGrid.appendChild(card);
    });
}

// Initialize homepage when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('booksGrid')) {
        loadSampleBooks();
    }
});