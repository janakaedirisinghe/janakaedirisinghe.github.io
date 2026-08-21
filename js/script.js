
// function to set a given theme/color-scheme
function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
}

// function to toggle between light and dark theme
function toggleTheme() {
    console.log('hello');
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

fetch('https://api.github.com/users/janakaedirisinghe')
    .then(response => {
        if (!response.ok) throw new Error('GitHub API error');
        return response.json();
    })
    .then(data => {
        const gistsEl = document.getElementById("public_gists");
        const followersEl = document.getElementById("followers");
        const reposEl = document.getElementById("public_repos");
        const avatarEl = document.getElementById("github_avatar");

        if (gistsEl) gistsEl.innerHTML = (data.public_gists ?? 0) + ' Gists';
        if (followersEl) followersEl.innerHTML = (data.followers ?? 0) + ' Followers';
        if (reposEl) reposEl.innerHTML = (data.public_repos ?? 0) + ' Public Repos';
        if (avatarEl && data.avatar_url) avatarEl.src = data.avatar_url;
    })
    .catch(err => {
        console.warn('Could not fetch GitHub user info:', err);
    });

fetch('https://api.stackexchange.com/2.2/users/10215448?order=desc&sort=reputation&site=stackoverflow')
    .then(response => {
        if (!response.ok) throw new Error('StackOverflow API error');
        return response.json();
    })
    .then(data => {
        if (data.items && data.items.length > 0) {
            const repChangeEl = document.getElementById("reputation_change_year");
            const repEl = document.getElementById("reputation");
            if (repChangeEl) repChangeEl.innerHTML = (data.items[0].reputation_change_year ?? 0) + ' This year';
            if (repEl) repEl.innerHTML = (data.items[0].reputation ?? 0) + ' Reputation';
        }
    })
    .catch(err => {
        console.warn('Could not fetch StackOverflow info:', err);
    });

document.addEventListener('DOMContentLoaded', function () {
    const themeSwitcher = document.getElementById('theme-switcher');
    if (!themeSwitcher) return;

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
});