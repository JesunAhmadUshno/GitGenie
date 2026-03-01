# Deploy GitGenie to GitHub Pages - 3 Steps

## Step 1: Create GitHub Repository

```bash
# Initialize git in your project
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: GitGenie for GitHub Pages"

# Create empty repo on GitHub at: https://github.com/new
# Name it: gitgenie
# Then push:

git remote add origin https://github.com/yourusername/gitgenie.git
git branch -M main
git push -u origin main
```

## Step 2: Enable GitHub Pages

1. Go to: `https://github.com/yourusername/gitgenie/settings/pages`
2. Under **Source**, select:
   - **Deploy from a branch**
   - Branch: `main`
   - Folder: `/ (root)`
3. Click **Save**

GitHub will now automatically deploy from the GitHub Actions workflow.

## Step 3: Access Your Site

After 1-2 minutes, your site is live at:

```
https://yourusername.github.io/gitgenie
```

---

## 🎉 That's It!

Your site is now running on GitHub Pages!

### What Happens Automatically

Every time you push to `main`:
1. GitHub Actions runs the build
2. Next.js exports static files to `./out`
3. Files are deployed to GitHub Pages
4. Changes visible in 1-2 minutes

---

## 🔄 Making Changes

### Edit Code Locally

```bash
# Make your changes
nano app/page.tsx

# Test locally
npm run dev

# Commit and push
git add .
git commit -m "feat: update achievement display"
git push origin main
```

### Deploy Automatically

Push to `main` → Automatic rebuild and deploy → Live in minutes!

---

## ✅ Verify Setup

1. Visit: `https://yourusername.github.io/gitgenie`
2. Enter any GitHub username
3. Click **View Profile**
4. See their achievements!

---

## 🔧 Troubleshooting

### Site Shows 404

- Check repository name is `gitgenie` (case-sensitive)
- Wait 3-5 minutes for first deployment
- Check Actions tab for build status

### Changes Not Appearing

- Push to `main` branch (not other branches)
- Wait 1-2 minutes for build
- Check github.com/yourusername/gitgenie/actions

### Build Failing

- Check Actions tab for error messages
- Run `npm run build` locally to debug
- Fix errors and push again

---

## 📚 Learn More

See [GITHUB_PAGES_SETUP.md](./GITHUB_PAGES_SETUP.md) for:
- How GitGenie works without a backend
- Achievement detection details
- Privacy information
- Customization options
- Advanced configuration

---

## 🚀 Next Steps

After deploying:

1. **Share your profile URL** with others
2. **Update README** with your new site link  
3. **Star the repo** if you like it!
4. **Follow on GitHub** for updates

---

**Your GitGenie site is now live!** 🎊
