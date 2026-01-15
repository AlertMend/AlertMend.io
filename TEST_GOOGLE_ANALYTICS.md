# Testing Google Analytics Blog Registration Tracking

## Prerequisites

1. **Start the development server:**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:5173` (or another port)

2. **Open your browser** and navigate to the local development URL

## Testing Methods

### Method 1: Browser Console (Easiest for Local Testing)

1. **Open Browser DevTools:**
   - Chrome/Edge: Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
   - Firefox: Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)

2. **Go to Console Tab**

3. **Monitor dataLayer:**
   ```javascript
   // Watch for events in real-time
   window.dataLayer = window.dataLayer || []
   console.log('Current dataLayer:', window.dataLayer)
   
   // Monitor new events
   const originalPush = window.dataLayer.push
   window.dataLayer.push = function(...args) {
     console.log('📊 GA Event:', args)
     return originalPush.apply(this, args)
   }
   ```

4. **Test the Register Button:**
   - Navigate to a blog page: `http://localhost:5173/blog`
   - Click the "Register" button in the navbar
   - Check the console for the event log

### Method 2: Google Analytics DebugView (Real-time Testing)

1. **Enable Debug Mode:**
   - Install [Google Analytics Debugger Chrome Extension](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
   - OR use the `?debug_mode=true` parameter (already enabled for localhost)

2. **Open Google Analytics:**
   - Go to [Google Analytics](https://analytics.google.com/)
   - Select your property (G-Z8QSJ5NK95)
   - Navigate to **Admin** → **DebugView** (under Property column)

3. **Test Events:**
   - Keep DebugView open
   - Navigate to blog pages and click Register
   - Events should appear in real-time in DebugView

### Method 3: Network Tab (Verify API Calls)

1. **Open DevTools** → **Network Tab**

2. **Filter by "collect" or "google-analytics"**

3. **Click Register button** from different pages:
   - Blog listing: `http://localhost:5173/blog`
   - Blog post: `http://localhost:5173/blog/kubernetes-cost-optimization-strategies`
   - Homepage: `http://localhost:5173/`

4. **Check the request payload:**
   - Look for `en=register_click` (event name)
   - Check `ec=registration` (event category)
   - Verify `source=blog-list` or `source=blog-post`
   - Check `blog_slug` parameter for blog posts

## Test Cases

### Test Case 1: Blog Listing Page
1. Navigate to: `http://localhost:5173/blog`
2. Click "Register" button in navbar
3. **Expected Event:**
   ```javascript
   {
     event: 'register_click',
     event_category: 'registration',
     event_label: 'register_button_click',
     source: 'blog-list',
     content_type: 'blog_list'
   }
   ```

### Test Case 2: Blog Post Page
1. Navigate to: `http://localhost:5173/blog/kubernetes-cost-optimization-strategies`
2. Click "Register" button in navbar
3. **Expected Event:**
   ```javascript
   {
     event: 'register_click',
     event_category: 'registration',
     event_label: 'register_button_click',
     source: 'blog-post',
     blog_slug: 'kubernetes-cost-optimization-strategies',
     content_type: 'blog_post'
   }
   ```

### Test Case 3: Legacy Blog Post Format
1. Navigate to: `http://localhost:5173/blogs/kubernetes-cost-optimization-strategies.html`
2. Click "Register" button in navbar
3. **Expected Event:**
   ```javascript
   {
     event: 'register_click',
     event_category: 'registration',
     event_label: 'register_button_click',
     source: 'blog-post',
     blog_slug: 'kubernetes-cost-optimization-strategies', // normalized
     content_type: 'blog_post'
   }
   ```

### Test Case 4: Homepage (Non-Blog)
1. Navigate to: `http://localhost:5173/`
2. Click "Register" button in navbar
3. **Expected Event:**
   ```javascript
   {
     event: 'register_click',
     event_category: 'registration',
     event_label: 'register_button_click',
     source: 'navbar',
     solution: 'default'
   }
   ```

### Test Case 5: Mobile Menu
1. Resize browser to mobile view (< 1024px width)
2. Open mobile menu
3. Click "Register" button
4. Verify same events are tracked

## Quick Test Script

Run this in the browser console to test the tracking function:

```javascript
// Test the tracking function directly
import { trackRegisterClick } from './src/utils/analytics'

// Test blog list
trackRegisterClick('blog-list', null)

// Test blog post
trackRegisterClick('blog-post', 'test-blog-slug')

// Test navbar
trackRegisterClick('navbar', null, { solution: 'default' })
```

## Verify in Google Analytics Dashboard

After testing, check Google Analytics:

1. **Go to Google Analytics** → **Reports** → **Engagement** → **Events**

2. **Look for `register_click` event**

3. **Use Secondary Dimension:**
   - Add "Source" dimension to see `blog-list`, `blog-post`, or `navbar`
   - Add "Blog Slug" dimension to see which blog posts drive registrations

4. **Create Custom Report:**
   - Event: `register_click`
   - Dimensions: `Source`, `Blog Slug`, `Content Type`
   - Metrics: `Event count`, `Total users`

## Troubleshooting

### Events Not Appearing?

1. **Check if gtag is loaded:**
   ```javascript
   console.log('gtag available:', typeof window.gtag !== 'undefined')
   console.log('dataLayer:', window.dataLayer)
   ```

2. **Check browser console for errors**

3. **Verify GA script is loading:**
   - Check Network tab for `gtag/js?id=G-Z8QSJ5NK95`

4. **Test with manual event:**
   ```javascript
   if (window.gtag) {
     window.gtag('event', 'test_event', {
       event_category: 'test',
       event_label: 'manual_test'
     })
   }
   ```

### Localhost Events Not Showing in GA?

- Localhost events may be filtered out by default
- Use DebugView for real-time testing
- Or deploy to staging/production to see events in main reports

## Production Testing

Once deployed, events will appear in Google Analytics within 24-48 hours (or immediately in Real-time reports).

To view real-time:
1. Go to **Reports** → **Real-time** → **Events**
2. Click Register buttons on your live site
3. Events should appear within seconds
