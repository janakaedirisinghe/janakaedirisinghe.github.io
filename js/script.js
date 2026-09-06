// function to set a given theme/color-scheme
function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
}

// function to toggle between light and dark theme
function toggleTheme() {
    if (localStorage.getItem('theme') === 'theme-dark') {
        setTheme('theme-light');
    } else {
        setTheme('theme-dark');
    }
}

// Immediately invoked function to set the theme on initial load
(function () {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'theme-dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setTheme('theme-dark');
    } else {
        setTheme('theme-light');
    }
})();

// Animated Number Counter Helper
function animateCounter(element, targetNumber, duration = 1600, suffix = '', prefix = '') {
    if (!element || isNaN(targetNumber)) return;
    
    let startTimestamp = null;
    const startNumber = 0;

    function step(timestamp) {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // easeOutCubic curve for smooth deceleration
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeProgress * (targetNumber - startNumber) + startNumber);
        
        element.innerHTML = `${prefix}${currentVal.toLocaleString()}${suffix}`;

        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            element.innerHTML = `${prefix}${targetNumber.toLocaleString()}${suffix}`;
        }
    }

    window.requestAnimationFrame(step);
}

// Global stats animation coordinator
const statsState = {
    inView: false,
    elements: {}
};

function registerOrAnimateStat(id, target, suffix = '', prefix = '') {
    const el = document.getElementById(id);
    if (!el) return;

    statsState.elements[id] = { el, target, suffix, prefix, animated: false };

    if (statsState.inView) {
        animateCounter(el, target, 1600, suffix, prefix);
        statsState.elements[id].animated = true;
    }
}

function runStatsAnimations() {
    statsState.inView = true;
    Object.keys(statsState.elements).forEach(id => {
        const item = statsState.elements[id];
        if (!item.animated) {
            animateCounter(item.el, item.target, 1600, item.suffix, item.prefix);
            item.animated = true;
        }
    });
}

// Fetch GitHub Stats
fetch('https://api.github.com/users/janakaedirisinghe')
    .then(response => {
        if (!response.ok) throw new Error('GitHub API error');
        return response.json();
    })
    .then(data => {
        const avatarEl = document.getElementById("github_avatar");
        if (avatarEl && data.avatar_url) avatarEl.src = data.avatar_url;

        registerOrAnimateStat("public_repos", data.public_repos ?? 0, ' Public Repos');
        registerOrAnimateStat("public_gists", data.public_gists ?? 0, ' Gists');
        registerOrAnimateStat("followers", data.followers ?? 0, ' Followers');
    })
    .catch(err => {
        console.warn('Could not fetch GitHub user info:', err);
    });

// Fetch StackOverflow Stats
fetch('https://api.stackexchange.com/2.2/users/10215448?order=desc&sort=reputation&site=stackoverflow')
    .then(response => {
        if (!response.ok) throw new Error('StackOverflow API error');
        return response.json();
    })
    .then(data => {
        if (data.items && data.items.length > 0) {
            const rep = data.items[0].reputation ?? 0;
            const repChange = data.items[0].reputation_change_year ?? 0;
            registerOrAnimateStat("reputation", rep, ' Reputation');
            registerOrAnimateStat("reputation_change_year", repChange, ' This year', '+');
        }
    })
    .catch(err => {
        console.warn('Could not fetch StackOverflow info:', err);
    });

// Track page visit via CounterAPI v2 (Query param avoids CORS preflight)
fetch('https://api.counterapi.dev/v2/janaka-edirisinghes-team-5388/janaka-edirisinghe/up?api_key=ut_5K0vp7fUlQdsASmZ94aCzEG4nQEMdjG3QVVf1Mqb')
    .catch(err => {
        console.debug('Visitor tracking error:', err);
    });

document.addEventListener('DOMContentLoaded', function () {
    // Register static stats (e.g. Medium)
    registerOrAnimateStat("medium_articles", 6, ' Articles');

    // Theme Switcher
    const themeSwitcher = document.getElementById('theme-switcher');
    if (themeSwitcher) {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme === 'theme-dark' || (!savedTheme && prefersDark)) {
            setTheme('theme-dark');
            themeSwitcher.checked = true;
        } else {
            setTheme('theme-light');
            themeSwitcher.checked = false;
        }

        themeSwitcher.addEventListener('change', function () {
            if (themeSwitcher.checked) {
                setTheme('theme-dark');
            } else {
                setTheme('theme-light');
            }
            localStorage.setItem('theme', this.checked ? 'theme-dark' : 'theme-light');
        });
    }

    // Observe stats section for scroll trigger
    const statsSection = document.getElementById('stats');
    if (statsSection && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    runStatsAnimations();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        observer.observe(statsSection);
    } else {
        // Fallback if observer not supported
        runStatsAnimations();
    }
});