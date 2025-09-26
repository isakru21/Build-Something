// Media & Book Watchlist Application JavaScript

// DOM Elements
const createUserBtn = document.getElementById('create-user-btn');
const createMediaBtn = document.getElementById('create-media-btn');
const userSelect = document.getElementById('user-select');
const mediaFormContainer = document.getElementById('media-form-container');
const mediaList = document.getElementById('media-list');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const ratingStarsContainer = document.getElementById('rating-stars');
const ratingInput = document.getElementById('media-rating');

// Application State
let users = [];
let allMediaItems = [];

// Utility Functions
function showToast(message, isError = false) {
    toastMessage.textContent = message;
    toast.classList.remove('bg-green-500', 'bg-red-500', 'translate-x-[200%]');
    toast.classList.add(isError ? 'bg-red-500' : 'bg-green-500', 'translate-x-0');
    setTimeout(() => {
        toast.classList.add('translate-x-[200%]');
    }, 3000);
}

function resetRating() {
    ratingInput.value = 0;
    ratingStarsContainer.querySelectorAll('.star').forEach(s => s.classList.remove('selected'));
}

// Rating Stars Logic
ratingStarsContainer.addEventListener('click', e => {
    if (e.target.classList.contains('star')) {
        const value = e.target.dataset.value;
        ratingInput.value = value;
        const stars = ratingStarsContainer.querySelectorAll('.star');
        stars.forEach(star => {
            star.classList.toggle('selected', star.dataset.value <= value);
        });
    }
});

// User Management
createUserBtn.addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    if (!username || !email) {
        showToast('Användarnamn och e-post krävs.', true);
        return;
    }
    try {
        const response = await fetch('http://localhost/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Kunde inte skapa användare.');
        }
        const newUser = await response.json();
        users.push(newUser);
        updateUserSelect();
        showToast(`Användare '${newUser.username}' skapad!`);
        document.getElementById('username').value = '';
        document.getElementById('email').value = '';
    } catch (error) {
        showToast(error.message, true);
    }
});

// Media Management
createMediaBtn.addEventListener('click', async () => {
    const title = document.getElementById('media-title').value;
    const type = document.getElementById('media-type').value;
    const status = document.getElementById('media-status').value;
    const rating = ratingInput.value;
    const review = document.getElementById('media-review').value;
    const author_id = userSelect.value;

    if (!title || !author_id) {
        showToast('Titel och en vald användare krävs.', true);
        return;
    }

    try {
        const payload = { title, type, status, author_id, rating, review };
        const response = await fetch('http://localhost/media', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Kunde inte lägga till i listan.');

        const newItem = await response.json();
        allMediaItems.unshift(newItem);
        renderMediaItems();
        showToast(`'${newItem.title}' tillagd!`);
        
        // Reset form
        document.getElementById('media-title').value = '';
        document.getElementById('media-review').value = '';
        resetRating();

    } catch (error) {
        showToast(error.message, true);
    }
});

// User Selection Logic
userSelect.addEventListener('change', () => {
    if (userSelect.value) {
        mediaFormContainer.classList.remove('opacity-50', 'pointer-events-none');
        fetchMediaForCurrentUser();
    } else {
        mediaFormContainer.classList.add('opacity-50', 'pointer-events-none');
        renderMediaItems();
    }
});

function updateUserSelect() {
    const lastSelected = userSelect.value;
    userSelect.innerHTML = '<option value="">-- Välj en Användare --</option>';
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id || user._id;
        option.textContent = `${user.username}`;
        userSelect.appendChild(option);
    });
    const userToSelect = users.length > 0 ? (users[users.length -1].id || users[users.length -1]._id) : lastSelected;
    if (userToSelect) {
         userSelect.value = userToSelect;
    }
    userSelect.dispatchEvent(new Event('change'));
}

// Media Rendering
function renderMediaItems() {
    const currentUserId = userSelect.value;
    const itemsForCurrentUser = currentUserId ? allMediaItems.filter(item => item.author_id === currentUserId) : [];
    
    if (itemsForCurrentUser.length === 0) {
        mediaList.innerHTML = '<p class="text-gray-500">Din lista är tom. Lägg till en film eller bok ovan!</p>';
        return;
    }

    mediaList.innerHTML = '';
    itemsForCurrentUser.forEach(item => {
        const author = users.find(u => (u.id || u._id) === item.author_id) || { username: item.author_username || 'Okänd' };
        const ratingHTML = Array(5).fill(0).map((_, i) => 
            `<span class="${i < item.rating ? 'text-yellow-400' : 'text-gray-300'}">★</span>`
        ).join('');

        const mediaCard = `
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                <div class="flex justify-between items-start">
                     <div>
                        <h3 class="font-bold text-lg text-indigo-700">${item.title}</h3>
                        <p class="text-sm text-gray-500 mb-2">av ${author.username}</p>
                     </div>
                     <span class="text-xs font-semibold ${item.type === 'Film' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'} px-2 py-1 rounded-full">${item.type}</span>
                </div>
                <div class="flex items-center space-x-2 my-2">
                     ${item.rating > 0 ? ratingHTML : ''}
                     <span class="text-xs font-medium text-gray-600">${item.status === 'sett' ? 'Sett / Läst' : 'Vill se / Läsa'}</span>
                </div>
                ${item.review ? `<p class="text-gray-700 mt-2 p-3 bg-gray-100 rounded">${item.review}</p>` : ''}
            </div>
        `;
        mediaList.innerHTML += mediaCard;
    });
}

// API Functions
async function fetchMediaForCurrentUser() {
    const currentUserId = userSelect.value;
    if (!currentUserId) {
        allMediaItems = [];
        renderMediaItems();
        return;
    }
    try {
        const mediaResponse = await fetch(`http://localhost/media?author_id=${currentUserId}`);
        if (!mediaResponse.ok) throw new Error('Kunde inte hämta media.');
        allMediaItems = await mediaResponse.json();
        renderMediaItems();
    } catch(error) {
        showToast(error.message, true);
        mediaList.innerHTML = `<p class="text-red-500">Fel vid laddning av data: ${error.message}</p>`;
    }
}

async function initializeApp() {
    try {
        const usersResponse = await fetch('http://localhost/users');
        if (!usersResponse.ok) throw new Error('Kunde inte hämta användare.');
        users = await usersResponse.json();
        updateUserSelect();
    } catch(error) {
        showToast(error.message, true);
        mediaList.innerHTML = `<p class="text-red-500">Fel vid laddning av data: ${error.message}</p>`;
    }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', initializeApp);