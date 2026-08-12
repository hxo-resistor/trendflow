// TrendFlow PWA Initialization Script
// This script handles Service Worker registration and Push notification setup

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('[PWA] ServiceWorker registered:', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          
          newWorker.addEventListener('statechange', () => {
            console.log('[PWA] Worker state changed:', newWorker.state);
            
            if (newWorker.state === 'activated') {
              console.log('[PWA] New content available!');
              // Show update notification
              if (confirm('发现新版本，是否立即更新？')) {
                window.location.reload();
              }
            }
          });
        });
        
        console.log('[PWA] Service Worker registered successfully');
      })
      .catch(error => {
        console.error('[PWA] Registration failed:', error);
      });
  });
}

// Push notification subscription
async function subscribePush() {
  if (!('PushManager' in window)) {
    console.log('[Push] Push not supported');
    return null;
  }
  
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        'BKdm5JmEjKLMw7yKpGZVRbzFqL0e3hKjVmXnQ9rS2tY4uW6xC8zA1bD3eF5gH7iJ9kL'
      )
    });
    
    // Send subscription to server
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription)
    });
    
    console.log('[Push] Subscription successful');
    return subscription;
  } catch (error) {
    console.error('[Push] Subscription failed:', error);
    return null;
  }
}

// Helper function to convert base64 to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Request push permission on daily-tasks page
if (window.location.pathname.includes('daily-tasks')) {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        subscribePush();
      }
    });
  }
}
