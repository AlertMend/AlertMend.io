# Testing Canonical URLs Locally

## Start the Development Server
```bash
npm run dev
```

The server will start on `http://localhost:5173` (or another port if 5173 is taken)

## Test Cases

### 1. Test HTML Version Blog Post
**URL**: `http://localhost:5173/blogs/resolving-kubernetes-node-not-ready-error.html`
**Expected Canonical**: `https://www.alertmend.io/blogs/resolving-kubernetes-node-not-ready-error.html`

**How to verify**:
1. Open the URL in your browser
2. View page source (Right-click → View Page Source)
3. Look for: `<link rel="canonical" href="https://www.alertmend.io/blogs/resolving-kubernetes-node-not-ready-error.html">`

### 2. Test Non-HTML Version Blog Post
**URL**: `http://localhost:5173/blog/resolving-kubernetes-node-not-ready-error`
**Expected Canonical**: `https://www.alertmend.io/blog/resolving-kubernetes-node-not-ready-error`

**How to verify**:
1. Open the URL in your browser
2. View page source (Right-click → View Page Source)
3. Look for: `<link rel="canonical" href="https://www.alertmend.io/blog/resolving-kubernetes-node-not-ready-error">`

### 3. Test URL with Variations (Underscores/Capitals)
**URL**: `http://localhost:5173/blogs/Resolving_Kubernetes_Node_Not_Ready_Error.html`
**Expected Canonical**: `https://www.alertmend.io/blogs/resolving-kubernetes-node-not-ready-error.html`

**How to verify**:
1. Open the URL in your browser
2. The slug should be normalized (underscores → hyphens, lowercase)
3. View page source and check canonical URL

### 4. Test Another Blog Post
**URL**: `http://localhost:5173/blogs/oomkilled-in-kubernetes.html`
**Expected Canonical**: `https://www.alertmend.io/blogs/oomkilled-in-kubernetes.html`

**Non-HTML version**:
**URL**: `http://localhost:5173/blog/oomkilled-in-kubernetes`
**Expected Canonical**: `https://www.alertmend.io/blog/oomkilled-in-kubernetes`

## Quick Test Script

You can also use browser DevTools:
1. Open DevTools (F12)
2. Go to Console tab
3. Run: `document.querySelector('link[rel="canonical"]')?.href`
4. This will show the current canonical URL

## Expected Results

✅ HTML version (`/blogs/slug.html`) → Canonical: `/blogs/slug.html`
✅ Non-HTML version (`/blog/slug`) → Canonical: `/blog/slug`
✅ URL variations (underscores/capitals) → Normalized to lowercase hyphens
✅ All canonical URLs use full domain: `https://www.alertmend.io`
