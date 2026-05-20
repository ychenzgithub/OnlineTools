document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const resourcesGrid = document.getElementById('resourcesGrid');
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearch');
    const filterTabs = document.getElementById('filterTabs');
    const emptyState = document.getElementById('emptyState');
    
    // Badge Counts Elements
    const countAll = document.querySelector('.count-all');
    const countTools = document.querySelector('.count-tools');
    const countWebpages = document.querySelector('.count-webpages');
    const countCourses = document.querySelector('.count-courses');
    const countBooks = document.querySelector('.count-books');

    // App State
    let currentCategory = 'all';
    let searchQuery = '';

    // Category Icon Map
    const categoryIcons = {
        'Tools': 'fa-solid fa-screwdriver-wrench',
        'Webpages': 'fa-solid fa-laptop-code',
        'Courses': 'fa-solid fa-graduation-cap',
        'Books': 'fa-solid fa-book-open'
    };

    // Initialize Badge Counts
    function updateBadgeCounts() {
        const counts = { all: 0, Tools: 0, Webpages: 0, Courses: 0, Books: 0 };
        
        RESOURCES_DATA.forEach(item => {
            counts.all++;
            if (counts[item.category] !== undefined) {
                counts[item.category]++;
            }
        });

        countAll.textContent = counts.all;
        countTools.textContent = counts.Tools;
        countWebpages.textContent = counts.Webpages;
        countCourses.textContent = counts.Courses;
        countBooks.textContent = counts.Books;
    }

    // Copy URL to Clipboard Helper
    window.copyToClipboard = function(btn, url) {
        navigator.clipboard.writeText(url).then(() => {
            const icon = btn.querySelector('i');
            icon.className = 'fa-solid fa-check';
            btn.style.color = '#34d399';
            
            setTimeout(() => {
                icon.className = 'fa-regular fa-copy';
                btn.style.color = '';
            }, 1500);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    // Render Cards
    function renderResources() {
        // Clear grid
        resourcesGrid.innerHTML = '';
        
        // Filter resources
        const filtered = RESOURCES_DATA.filter(item => {
            const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
            
            const matchesSearch = searchQuery === '' || 
                item.title.toLowerCase().includes(searchQuery) ||
                item.description.toLowerCase().includes(searchQuery) ||
                item.url.toLowerCase().includes(searchQuery);
                
            return matchesCategory && matchesSearch;
        });

        // Toggle empty state
        if (filtered.length === 0) {
            emptyState.style.display = 'flex';
            resourcesGrid.style.display = 'none';
            return;
        } else {
            emptyState.style.display = 'none';
            resourcesGrid.style.display = 'grid';
        }

        // Generate HTML for each card
        filtered.forEach(item => {
            const fallbackIcon = categoryIcons[item.category] || 'fa-solid fa-globe';
            const faviconUrl = item.domain 
                ? `https://www.google.com/s2/favicons?sz=64&domain=${item.domain}` 
                : '';

            const card = document.createElement('div');
            card.className = 'card';
            card.setAttribute('data-category', item.category);

            // Clean domain text for nice display link
            const displayDomain = item.domain.replace(/^www\./, '');

            card.innerHTML = `
                <div class="card-header">
                    <div class="card-favicon">
                        ${faviconUrl 
                            ? `<img src="${faviconUrl}" alt="${item.title}" onerror="this.outerHTML='<i class=\\\"${fallbackIcon} fallback-icon\\\"></i>'">`
                            : `<i class="${fallbackIcon} fallback-icon"></i>`
                        }
                    </div>
                    <div class="card-meta">
                        <div class="card-title-row">
                            <h3 class="card-title" title="${item.title}">${item.title}</h3>
                        </div>
                        <span class="category-tag">${item.category}</span>
                    </div>
                </div>
                <p class="card-description">${item.description}</p>
                <div class="card-actions">
                    <a href="${item.url}" target="_blank" class="card-link" title="Visit ${item.title}">
                        Visit Link <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                    <button class="copy-btn" onclick="copyToClipboard(this, '${item.url}')" title="Copy link to clipboard">
                        <i class="fa-regular fa-copy"></i>
                    </button>
                </div>
            `;

            resourcesGrid.appendChild(card);
        });
    }

    // Search input handler
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        
        // Show/hide clear button
        if (searchQuery.length > 0) {
            clearSearchBtn.style.display = 'block';
        } else {
            clearSearchBtn.style.display = 'none';
        }
        
        renderResources();
    });

    // Clear search button handler
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.style.display = 'none';
        searchInput.focus();
        renderResources();
    });

    // Category Filter Tab handlers
    filterTabs.addEventListener('click', (e) => {
        const tab = e.target.closest('.filter-tab');
        if (!tab) return;

        // Update active class
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update state and render
        currentCategory = tab.getAttribute('data-category');
        renderResources();
    });

    // Run Initializations
    updateBadgeCounts();
    renderResources();
});
