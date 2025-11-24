# Local Testing Guide - Canonical URLs

## Dev Server
The dev server should be running on: **http://localhost:5173**

## Test URLs

### 1. Test HTML Version with Normalized Slug
**URL**: `http://localhost:5173/blogs/resolving-kubernetes-node-not-ready-error.html`
**Expected Canonical**: `https://www.alertmend.io/blogs/resolving-kubernetes-node-not-ready-error.html`

### 2. Test HTML Version with Underscores/Capitals (Should Normalize)
**URL**: `http://localhost:5173/blogs/Resolving_Kubernetes_Node_Not_Ready_Error.html`
**Expected Canonical**: `https://www.alertmend.io/blogs/resolving-kubernetes-node-not-ready-error.html`

### 3. Test Non-HTML Version
**URL**: `http://localhost:5173/blog/resolving-kubernetes-node-not-ready-error`
**Expected Canonical**: `https://www.alertmend.io/blog/resolving-kubernetes-node-not-ready-error`

### 4. Test Another Blog Post
**URL**: `http://localhost:5173/blogs/oomkilled-in-kubernetes.html`
**Expected Canonical**: `https://www.alertmend.io/blogs/oomkilled-in-kubernetes.html`

## How to Verify

### Method 1: View Page Source
1. Open the URL in your browser
2. Right-click → "View Page Source" (or Cmd+Option+U on Mac)
3. Search for "canonical" (Cmd+F or Ctrl+F)
4. Look for: `<link rel="canonical" href="https://www.alertmend.io/...">`

### Method 2: Browser DevTools Console
1. Open DevTools (F12 or Cmd+Option+I)
2. Go to Console tab
3. Run this command:
   ```javascript
   document.querySelector('link[rel="canonical"]')?.href
   ```
4. It should show the correct canonical URL

### Method 3: Elements Tab
1. Open DevTools (F12 or Cmd+Option+I)
2. Go to Elements tab
3. Expand `<head>` section
4. Look for `<link rel="canonical" href="...">`

## What to Check

✅ Canonical URL should NOT be `https://www.alertmend.io/` (homepage)
✅ Canonical URL should match the blog post URL format
✅ HTML version should have `.html` extension in canonical
✅ Non-HTML version should NOT have `.html` extension
✅ Slugs should be normalized (lowercase, hyphens, no underscores)
✅ Domain should be `https://www.alertmend.io`

## Expected Results

- **HTML version** (`/blogs/slug.html`) → Canonical: `/blogs/slug.html`
- **Non-HTML version** (`/blog/slug`) → Canonical: `/blog/slug`
- **URL variations** (underscores/capitals) → Normalized to lowercase hyphens
- **No homepage canonical** → Should never show `/` as canonical

## Quick Test Script

Open browser console and run:
```javascript
// Test current page canonical
const canonical = document.querySelector('link[rel="canonical"]')
console.log('Current canonical:', canonical?.href)
console.log('Expected format:', window.location.pathname.startsWith('/blogs/') ? 'Should have .html' : 'Should NOT have .html')
```
