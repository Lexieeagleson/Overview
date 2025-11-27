// ========================================
// Dynamic Repository Fetching and UI Logic
// ========================================

const GITHUB_USERNAME = 'Lexieeagleson';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;
const MAX_DESCRIPTION_LENGTH = 100;

// Language color mapping for repository cards
const languageColors = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#3178c6',
    'Python': '#3572A5',
    'Java': '#b07219',
    'C++': '#f34b7d',
    'C#': '#178600',
    'C': '#555555',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'Ruby': '#701516',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'Swift': '#ffac45',
    'Kotlin': '#A97BFF',
    'PHP': '#4F5D95',
    'Shell': '#89e051',
    'Dart': '#00B4AB',
    'Scala': '#c22d40',
    'Vue': '#41b883',
    'R': '#198CE7',
    'default': '#ff00ff'
};

// DOM Elements
const reposGrid = document.getElementById('repos-grid');
const loadingElement = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');

// Fetch repositories from GitHub API
async function fetchRepositories() {
    try {
        const response = await fetch(GITHUB_API_URL, {
            headers: {
                'Accept': 'application/vnd.github+json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const repos = await response.json();
        return repos;
    } catch (error) {
        console.error('Error fetching repositories:', error);
        throw error;
    }
}

// Create a repository card element
function createRepoCard(repo) {
    const card = document.createElement('div');
    card.className = 'repo-card';

    const languageColor = languageColors[repo.language] || languageColors['default'];
    const description = repo.description || 'No description available';
    const truncatedDescription = description.length > MAX_DESCRIPTION_LENGTH 
        ? description.substring(0, MAX_DESCRIPTION_LENGTH) + '...' 
        : description;

    card.innerHTML = `
        <h3>${escapeHtml(repo.name)}</h3>
        <p>${escapeHtml(truncatedDescription)}</p>
        <div class="repo-meta">
            ${repo.language ? `
                <span class="repo-language">
                    <span class="language-dot" style="background: ${languageColor}"></span>
                    ${escapeHtml(repo.language)}
                </span>
            ` : '<span></span>'}
            <span class="repo-stars">
                ⭐ ${repo.stargazers_count}
            </span>
        </div>
        <a href="https://lexieeagleson.github.io/${escapeHtml(repo.name)}" target="_blank" rel="noopener noreferrer" class="repo-link">
            Visit Site →
        </a>
    `;

    return card;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Display repositories in the grid
function displayRepositories(repos) {
    // Sort repos by updated date (most recent first)
    const sortedRepos = repos.sort((a, b) => 
        new Date(b.updated_at) - new Date(a.updated_at)
    );

    // Clear loading and display repos
    loadingElement.style.display = 'none';
    reposGrid.innerHTML = '';

    if (sortedRepos.length === 0) {
        reposGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No repositories found.</p>';
        return;
    }

    sortedRepos.forEach(repo => {
        const card = createRepoCard(repo);
        reposGrid.appendChild(card);
    });
}

// Show error message
function showError() {
    loadingElement.style.display = 'none';
    errorMessage.style.display = 'block';
}

// Initialize the page
async function init() {
    // Set current year in footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Fetch and display repositories
    try {
        const repos = await fetchRepositories();
        displayRepositories(repos);
    } catch (error) {
        showError();
    }

    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
