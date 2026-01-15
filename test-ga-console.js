/**
 * Google Analytics Testing Script
 * 
 * Copy and paste this entire script into your browser console (F12 → Console tab)
 * when testing on localhost:5173
 * 
 * This will:
 * 1. Monitor all Google Analytics events
 * 2. Log them to console with nice formatting
 * 3. Show you exactly what's being sent to GA
 */

(function() {
  console.log('%c🔍 Google Analytics Event Monitor Started', 'color: #4CAF50; font-size: 16px; font-weight: bold;');
  console.log('%cClick Register buttons to see events logged here', 'color: #666; font-size: 12px;');
  console.log('');

  // Ensure dataLayer exists
  window.dataLayer = window.dataLayer || [];

  // Monitor dataLayer pushes
  const originalPush = window.dataLayer.push;
  window.dataLayer.push = function(...args) {
    const eventData = args[0];
    
    // Only log event commands (not config or js)
    if (args[0] === 'event' || (typeof eventData === 'object' && eventData.event)) {
      const eventName = args[0] === 'event' ? args[1] : eventData.event;
      const eventParams = args[0] === 'event' ? args[2] : eventData;
      
      if (eventName === 'register_click') {
        console.log('%c📊 Register Click Event Detected!', 'color: #2196F3; font-size: 14px; font-weight: bold;');
        console.log('Event Name:', eventName);
        console.log('Event Parameters:', eventParams);
        
        // Highlight blog-related events
        if (eventParams.source === 'blog-list' || eventParams.source === 'blog-post') {
          console.log('%c✅ Blog Source Tracking:', 'color: #4CAF50; font-weight: bold;', {
            source: eventParams.source,
            blog_slug: eventParams.blog_slug || 'N/A',
            content_type: eventParams.content_type || 'N/A'
          });
        }
        
        console.log('---');
      } else {
        console.log('📈 GA Event:', eventName, eventParams);
      }
    }
    
    // Call original push
    return originalPush.apply(this, args);
  };

  // Test function to manually trigger events
  window.testGATracking = function() {
    console.log('%c🧪 Testing GA Tracking Functions', 'color: #FF9800; font-size: 14px; font-weight: bold;');
    
    // Check if gtag is available
    if (typeof window.gtag === 'undefined') {
      console.warn('⚠️ gtag is not available. Make sure GA script is loaded.');
      return;
    }
    
    console.log('✅ gtag is available');
    console.log('✅ dataLayer is available');
    console.log('');
    console.log('Test by clicking Register buttons on:');
    console.log('  - Blog listing: http://localhost:5173/blog');
    console.log('  - Blog post: http://localhost:5173/blog/kubernetes-cost-optimization-strategies');
    console.log('  - Homepage: http://localhost:5173/');
  };

  // Run test
  window.testGATracking();

  console.log('');
  console.log('%c💡 Tip: Type testGATracking() to run diagnostics', 'color: #9C27B0; font-style: italic;');
})();
