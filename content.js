// Content script to handle redirects on the page level
(function() {
  'use strict';
  
  // Function to redirect current page if it's on bsky.app
  function redirectCurrentPage() {
    if (window.location.hostname === 'bsky.app') {
      const newUrl = window.location.href.replace('bsky.app', 'deer.social');
      window.location.replace(newUrl);
    }
  }
  
  // Function to handle clicks on links
  function handleLinkClicks(event) {
    const target = event.target.closest('a');
    if (target && target.href && target.href.includes('bsky.app')) {
      event.preventDefault();
      const newUrl = target.href.replace('bsky.app', 'deer.social');
      window.location.href = newUrl;
    }
  }
  
  // Function to update existing links on the page
  function updateLinks() {
    const links = document.querySelectorAll('a[href*="bsky.app"]');
    links.forEach(link => {
      if (link.href.includes('bsky.app')) {
        link.href = link.href.replace('bsky.app', 'deer.social');
      }
    });
  }
  
  // Redirect immediately if we're on bsky.app
  redirectCurrentPage();
  
  // Add click listener for any remaining links
  document.addEventListener('click', handleLinkClicks, true);
  
  // Update links when DOM changes (for dynamic content)
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        updateLinks();
      }
    });
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Also update links on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateLinks);
  } else {
    updateLinks();
  }
})();
