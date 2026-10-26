function setOfflineUI(isOffline) {
  const offlineDiv = document.getElementById('offlinediv');
  const offlineScripts = document.querySelectorAll('.offlineScript');
  const offlineElements = document.querySelectorAll('.offline');
  if (isOffline) {
    offlineScripts.forEach(el => (el.src = ''));
    offlineElements.forEach(el => (el.style.display = 'none'));
    offlineDiv.style.display = 'flex';
  } else {
    offlineDiv.style.display = 'none';
    // Ensure offline elements are visible if they should be (they may be hidden via CSS initially)
    offlineElements.forEach(el => (el.style.display = ''));
  }
}

// Set initial UI based on current online status
setOfflineUI(!navigator.onLine);

// Listen for online/offline events to update UI dynamically
window.addEventListener('offline', () => setOfflineUI(true));
window.addEventListener('online', () => setOfflineUI(false));

