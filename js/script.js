
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
    if (localStorage.getItem('theme') === 'theme-dark') {
        setTheme('theme-dark');
    } else {
        setTheme('theme-light');
    }
})();

fetch('https://api.github.com/users/janakaedirisinghe')
  .then(response => response.json())
  .then(data => {
    //   console.log(data);
      document.getElementById("public_gists").innerHTML = data.public_gists+' Gits';
      document.getElementById("followers").innerHTML = data.followers+ ' Followers';
      document.getElementById("public_repos").innerHTML = data.public_repos+ ' Public Repos';
      document.getElementById("github_avatar").src = data.avatar_url;
  });
  fetch('  https://api.stackexchange.com/2.2/users/10215448?order=desc&sort=reputation&site=stackoverflow')
  .then(response => response.json())
  .then(data => {
    //   console.log(data.items[0]);
      document.getElementById("reputation_change_year").innerHTML = data.items[0].reputation_change_year+ ' This year';

      document.getElementById("reputation").innerHTML = data.items[0].reputation+ ' Reputation';
  });