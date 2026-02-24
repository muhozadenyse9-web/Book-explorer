/**
 * favorites.js - Favorites Management Module
 * Lab 2: Complete favorites functionality
 */

// Storage key for localStorage
const FAVORITES_STORAGE_KEY = 'bookExplorerFavorites';

//  Get all favorite books from localStorage
export function getFavorites() {
    try {
        const data = localStorage.getItem(FAVORITES_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading favorites:', error);
        return [];
    }
}

/**
 * Save favorites to localStorage
 */
function saveFavorites(favorites) {
    try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
        console.error('Error saving favorites:', error);
    }
}

/**
 * Add a book to favorites
 */
export function addToFavorites(book) {
    const favorites = getFavorites();
    
    // Check if book already exists (compare by ID)
    const exists = favorites.some(fav => fav.id === book.id || fav.key === book.key);
    
    if (!exists) {
        favorites.push(book);
        saveFavorites(favorites);
        return true; // Added successfully
    }
    return false; // Already exists
}

/**
 * Remove a book from favorites
 */
export function removeFromFavorites(bookId) {
    const favorites = getFavorites();
    const newFavorites = favorites.filter(book => (book.id || book.key) !== bookId);
    saveFavorites(newFavorites);
    return newFavorites.length !== favorites.length; // Return true if removed
}

/**
 * Toggle a book's favorite status
 */
export function toggleFavorite(book) {
    const favorites = getFavorites();
    const bookId = book.id || book.key;
    const exists = favorites.some(fav => (fav.id || fav.key) === bookId);
    
    if (exists) {
        removeFromFavorites(bookId);
        return false; // Now not favorite
    } else {
        addToFavorites(book);
        return true; // Now favorite
    }
}

/**
 * Create a book card HTML element
 */
function createBookCard(book, isFavoritePage = false) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300';
    
    const title = book.title || 'Unknown Title';
    const author = book.author_name ? book.author_name.join(', ') : (book.author || 'Unknown Author');
    const coverUrl = book.cover_i 
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` 
        : 'https://via.placeholder.com/200x300?text=No+Cover';
    
    card.innerHTML = `
        <img src="${coverUrl}" alt="${title}" class="w-full h-48 object-cover">
        <div class="p-4">
            <h3 class="font-bold text-lg mb-1 truncate">${title}</h3>
            <p class="text-gray-600 text-sm mb-3">by ${author}</p>
            <button class="favorite-btn w-full py-2 px-4 rounded-lg text-white font-semibold transition ${
                isFavoritePage 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-yellow-500 hover:bg-yellow-600'
            }">
                ${isFavoritePage ? 'Remove' : 'Add to Favorites'}
            </button>
        </div>
    `;
    
    return card;
}

/**
 * Render favorites on the favorites page
 */
export function renderFavorites() {
    const favoritesGrid = document.getElementById('favoritesGrid');
    const emptyMessage = document.getElementById('emptyFavoritesMessage');
    
    if (!favoritesGrid) return;
    
    const favorites = getFavorites();
    favoritesGrid.innerHTML = '';
    
    // Show/hide empty message based on whether there are favorites
    if (favorites.length === 0) {
        if (emptyMessage) emptyMessage.classList.remove('hidden');
        favoritesGrid.classList.add('hidden');
        return;
    }
    
    if (emptyMessage) emptyMessage.classList.add('hidden');
    favoritesGrid.classList.remove('hidden');
    
    // Create a card for each favorite book
    favorites.forEach(book => {
        const card = createBookCard(book, true);
        
        // Add click event to the remove button
        const removeBtn = card.querySelector('.favorite-btn');
        removeBtn.addEventListener('click', () => {
            removeFromFavorites(book.key || book.id);
            renderFavorites(); // Re-render after removal
        });
        
        favoritesGrid.appendChild(card);
    });
}

// Auto-run when on favorites page
if (window.location.pathname.includes('favorites.html')) {
    document.addEventListener('DOMContentLoaded', renderFavorites);
}