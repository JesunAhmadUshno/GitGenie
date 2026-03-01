# GitGenie - GitHub Pages Setup Guide

GitGenie now runs **entirely on GitHub Pages** - no backend server needed!

## 🚀 Quick Setup

### 1. Fork the Repository

1. Go to: https://github.com/yourusername/gitgenie
2. Click **Fork** (top right)
3. Keep it public for GitHub Pages

### 2. Enable GitHub Pages

1. Go to your forked repo → **Settings**
2. Click **Pages** (left sidebar)
3. **Source**: Choose "Deploy from a branch"
4. **Branch**: Select `main` and `/root` folder
5. Wait for deployment (usually 1-2 minutes)
6. Your site is at: `https://yourusername.github.io/gitgenie`

### 3. That's It! 🎉

The site is now live and fully functional!

---

## 📝 How It Works

### What Runs on GitHub Pages
✅ **Frontend** - Complete React/Next.js site  
✅ **Achievement Detection** - Client-side JavaScript  
✅ **GitHub API Integration** - Fetches from GitHub directly  
✅ **Local Storage** - Saves data in your browser  
✅ **Auto-Deploy** - GitHub Actions builds on every push  

### What's NOT in GitHub Pages
❌ Backend server (Express)  
❌ Database (PostgreSQL)  
❌ Real-time features (WebSocket)  
❌ Authentication server  

---

## 🔍 Using GitGenie

### View Your Achievements

1. Visit: `https://yourusername.github.io/gitgenie`
2. Enter your GitHub username
3. Click **View Profile**
4. See all your achievements!

### Data Storage

- **Stored Locally**: All data in your browser's localStorage
- **No Sync**: Data stays on your device (no cloud sync)
- **Privacy**: No tracking, no server logs
- **Export**: Download your achievements as JSON

---

## 🌟 Features

### Achievement Detection

GitGenie detects achievements from your GitHub profile:

| Achievement | How to Unlock |
|------------|---------------|
| **QuickDraw** ⚡ | Close an issue in under 5 minutes |
| **Pull Shark** 🦈 | Merge 2+ pull requests |
| **YOLO** 🎉 | Get a PR merged without review |
| **Pair Extraordinaire** 🤝 | Co-author commits with others |
| **Galaxy Brain** 🧠 | Answer 2+ discussion questions |
| **StarStruck** ⭐ | Get 16+ repository stars |
| **Public Sponsor** 💝 | Become a GitHub sponsor |
| **Heart On Your Sleeve** 💖 | Get followers from others |

### Leaderboard

Compare achievements with other GitHub users:
- Search any public GitHub username
- See their achievements
- Compare scores
- No registration needed

---

## 🔧 Development

### Local Development

```bash
# Start dev server
npm run dev

# View at http://localhost:3000
```

### Build for GitHub Pages

```bash
# Create static export
npm run build

# Output in ./out directory
```

### Deploy Changes

1. Make changes to the code
2. Push to main branch:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin main
   ```
3. GitHub Actions automatically rebuilds and deploys
4. Changes live in 1-2 minutes

---

## 📊 Rate Limits

GitHub API has rate limits for unauthenticated requests:
- **60 requests per hour** per IP
- **Authentication recommended** for higher limits

To increase limits, create a GitHub Token:

1. Go to: https://github.com/settings/tokens
2. Click **Generate new token (classic)**
3. Select scopes: `public_repo`, `read:user`
4. Copy token
5. Edit `lib/services/github.ts`:

```typescript
const TOKEN = 'your_token_here'

// Add to fetch headers:
headers: {
  'Authorization': `token ${TOKEN}`
}
```

---

## 🎨 Customization

### Change Site Title

Edit `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: 'Your Custom Title | GitGenie',
  // ...
}
```

### Change Base Path

Edit `next.config.ts`:

```typescript
basePath: '/your-custom-path',
assetPrefix: '/your-custom-path/',
```

Then visit: `https://yourusername.github.io/your-custom-path`

### Add More Achievements

Edit `lib/services/achievements.ts`:

```typescript
function detectYourAchievement(data: any): Achievement {
  return {
    id: 'your_achievement',
    name: 'Your Achievement',
    description: 'Description here',
    icon: '🎯',
    rarity: 'rare',
    progress: 0,
    unlocked: false,
  }
}
```

---

## 🔐 Privacy & Security

### What's Private
- Your achievements data stays **only in your browser**
- No server stores your information
- No cookies or tracking
- No account registration

### What's Public
- Your GitHub profile data (already public)
- Achievement scores (you control sharing)

### Data Export

Download your achievements:
1. View your profile
2. Click **Export Data** button
3. Saves as JSON file

---

## 🆘 Troubleshooting

### Site Not Loading

**Problem**: Page shows 404

**Solution**:
1. Check repository name (must be `gitgenie`)
2. Verify GitHub Pages enabled
3. Check branch is `main`
4. Wait 2-3 minutes for deployment

### Achievements Not Detecting

**Problem**: No achievements showing

**Solutions**:
- Check username is correct (case-sensitive)
- User needs public GitHub activity
- Might be caching - refresh browser
- Check rate limit (GitHub API limits)

### Slow Loading

**Problem**: Takes long to load user achievements

**Solutions**:
- GitHub API rate limits might be hit
- Cache achievements locally (already done)
- Use authentication token for faster API
- Try a different username

### Build Fails on Deploy

**Problem**: GitHub Actions build fails

**Solution**:
1. Check build logs in **Actions** tab
2. Common issues:
   - Missing Node.js version
   - Dependency conflicts
   - TypeScript errors
3. Fix locally and push again

---

## 📡 Environment Variables

For GitHub Pages, set these (no backend needed):

```env
NEXT_PUBLIC_API_URL=https://api.github.com
NEXT_PUBLIC_GITHUB_OWNER=yourusername
NEXT_PUBLIC_GITHUB_REPO=gitgenie
```

---

## 🚀 Deployment Steps Summary

1. **Fork** the repo
2. **Enable Pages** in Settings
3. **Done!** Site deploys automatically

Changes deploy within 1-2 minutes of any push to `main`.

---

## 📚 Additional Resources

- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Next.js Static Export](https://nextjs.org/docs/pages/building-your-application/exporting)
- [GitHub API Docs](https://docs.github.com/en/rest)
- [JavaScript localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

## 💬 Support

- **Issues**: Create a GitHub issue
- **Questions**: Start a GitHub discussion
- **Feedback**: Let us know what you think!

---

## 📝 License

MIT License - Use freely, modify, share!

---

**GitGenie** - *Discover your GitHub achievements on GitHub Pages* 🎉
