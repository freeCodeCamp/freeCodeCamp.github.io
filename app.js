/**
 * freeCodeCamp Open Source Showcase
 * Dynamic project loading from YAML configuration
 */

(function() {
    'use strict';

    // DOM Elements
    const projectsGrid = document.getElementById('projectsGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const statValues = document.querySelectorAll('.stat-value');

    // State
    let projects = [];
    let currentFilter = 'all';

    /**
     * Format large numbers with K/M suffix
     */
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return num.toString();
    }

    /**
     * Get language class for color dot
     */
    function getLanguageClass(language) {
        if (!language) return 'default';
        return language.toLowerCase().replace(/[^a-z]/g, '');
    }

    /**
     * Get icon for project category
     */
    function getCategoryIcon(category) {
        const icons = {
            learning: 'fa-graduation-cap',
            tools: 'fa-wrench',
            mobile: 'fa-mobile-alt',
            community: 'fa-users',
            resources: 'fa-book'
        };
        return icons[category] || 'fa-code';
    }

    /**
     * Create a project card element
     */
    function createProjectCard(project) {
        const card = document.createElement('article');
        card.className = `project-card size-${project.size || 'small'}`;
        if (project.featured) card.classList.add('featured');
        card.dataset.category = project.category;

        const tagsHtml = project.tags && project.tags.slice(0, 3).map(tag =>
            `<span class="project-tag">${tag}</span>`
        ).join('') || '';

        card.innerHTML = `
            <div class="project-header">
                <div class="project-icon">
                    <i class="fas ${getCategoryIcon(project.category)}"></i>
                </div>
                <div class="project-stars">
                    <i class="fas fa-star"></i>
                    <span>${formatNumber(project.stars || 0)}</span>
                </div>
            </div>
            <h3 class="project-name">${project.name}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-footer">
                <div class="project-language">
                    <span class="language-dot ${getLanguageClass(project.language)}"></span>
                    <span>${project.language || 'N/A'}</span>
                </div>
                <a href="https://github.com/${project.repo}" class="project-link" target="_blank" rel="noopener">
                    View <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;

        // Add click handler for the entire card
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.project-link')) {
                window.open(`https://github.com/${project.repo}`, '_blank');
            }
        });

        return card;
    }

    /**
     * Render projects with optional filter
     */
    function renderProjects(filter = 'all') {
        currentFilter = filter;

        // Clear grid with fade out
        projectsGrid.style.opacity = '0';

        setTimeout(() => {
            projectsGrid.innerHTML = '';

            const filteredProjects = filter === 'all'
                ? projects
                : projects.filter(p => p.category === filter);

            if (filteredProjects.length === 0) {
                projectsGrid.innerHTML = `
                    <div class="loading" style="grid-column: 1 / -1;">
                        <p>No projects found in this category.</p>
                    </div>
                `;
            } else {
                // Sort: featured first, then by stars
                filteredProjects.sort((a, b) => {
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    return (b.stars || 0) - (a.stars || 0);
                });

                filteredProjects.forEach(project => {
                    const card = createProjectCard(project);
                    projectsGrid.appendChild(card);
                });
            }

            projectsGrid.style.opacity = '1';
        }, 200);
    }

    /**
     * Initialize filter buttons
     */
    function initFilters() {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter projects
                const category = btn.dataset.category;
                renderProjects(category);
            });
        });
    }

    /**
     * Animate stat counters
     */
    function animateStats() {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statCard = entry.target;
                    const valueEl = statCard.querySelector('.stat-value');
                    const target = parseInt(valueEl.dataset.target, 10);
                    animateCounter(valueEl, target);
                    observer.unobserve(statCard);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.stat-card').forEach(card => {
            observer.observe(card);
        });
    }

    /**
     * Animate a single counter
     */
    function animateCounter(element, target) {
        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(startValue + (target - startValue) * easeOut);

            element.textContent = formatNumber(currentValue);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = formatNumber(target);
            }
        }

        requestAnimationFrame(update);
    }

    /**
     * Smooth scroll for anchor links
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetEl = document.querySelector(targetId);

                if (targetEl) {
                    const headerOffset = 80;
                    const elementPosition = targetEl.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Load projects from YAML file
     */
    async function loadProjects() {
        try {
            // Show loading state
            projectsGrid.innerHTML = `
                <div class="loading" style="grid-column: 1 / -1;">
                    <div class="loading-spinner"></div>
                </div>
            `;

            const response = await fetch('projects.yaml');
            if (!response.ok) {
                throw new Error(`Failed to load projects: ${response.status}`);
            }

            const yamlText = await response.text();
            const data = jsyaml.load(yamlText);

            projects = data.projects || [];

            // Update stats if available in YAML
            if (data.stats) {
                updateStats(data.stats);
            }

            renderProjects();
        } catch (error) {
            console.error('Error loading projects:', error);
            projectsGrid.innerHTML = `
                <div class="loading" style="grid-column: 1 / -1; text-align: center;">
                    <p style="color: var(--fcc-red);">
                        <i class="fas fa-exclamation-triangle" style="margin-right: 8px;"></i>
                        Failed to load projects. Please try again later.
                    </p>
                </div>
            `;
        }
    }

    /**
     * Update stats from YAML data
     */
    function updateStats(stats) {
        const mappings = {
            'total_stars': 'GitHub Stars',
            'contributors': 'Contributors',
            'countries': 'Countries',
            'learners': 'Learners'
        };

        statValues.forEach(el => {
            const label = el.nextElementSibling?.textContent?.toLowerCase().replace(/\s+/g, '_');
            if (label && stats[label] !== undefined) {
                el.dataset.target = stats[label];
            }
        });
    }

    /**
     * Add scroll-based navbar styling
     */
    function initNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
            } else {
                navbar.style.boxShadow = 'none';
            }

            lastScroll = currentScroll;
        });
    }

    /**
     * Initialize the application
     */
    function init() {
        loadProjects();
        initFilters();
        animateStats();
        initSmoothScroll();
        initNavbarScroll();
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
