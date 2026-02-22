# 📘 How to Edit Your Personal Portfolio

## ✅ Problem Fixed!

Your admin panel changes will now **automatically appear on the public site**. The pages were using hardcoded data, but I've updated them to load from the admin panel.

---

## 🚀 Quick Start Guide

### 1. **Access the Admin Panel**

1. Navigate to your portfolio site
2. Click the **"Admin"** button in the footer/header (or go to `/admin`)
3. Login with your credentials:
   - Default email: Set in `authService`
   - Default password: Set in `authService`
   - ⚠️ **Change these in production!**

---

## 📝 Edit Your About/Profile Page

### Step 1: Navigate to Profile Editor

1. In admin panel, click **"Profile"** in the sidebar
2. You'll see the Profile Editor page with all your personal details

### Step 2: Fill in Basic Information

**Fields to edit:**
- **Full Name**: Your name (e.g., "John Doe")
- **Professional Title**: Your role (e.g., "Full Stack Developer")
- **Location**: Where you're based (e.g., "San Francisco, CA")
- **Bio**: A brief paragraph about yourself (use multiple paragraphs separated by blank lines)
- **Profile Picture**: Click "Upload Image" to add your photo via Cloudinary

**Example Bio:**
```
I build digital products that live at the intersection of design and engineering. With a focus on user experience and system architecture, I help companies transform complex problems into elegant solutions.

My journey began in graphic design, which gives me a unique perspective on frontend development. I don't just implement designs; I understand the intent behind them.
```

### Step 3: Set Professional Vitals

These appear in the sidebar on your About page:

- **Experience**: e.g., "5+ Years"
- **Level**: e.g., "Senior Developer"
- **Location**: e.g., "Remote / Hybrid"
- **Status**: e.g., "Available for hire"

### Step 4: Add About Sections

Click **"Add Section"** to create sections like:

**Section 1:**
- **Section Title**: "On Background"
- **Subheading**: "A Foundation in Systems"
- **Content**: Your background story...

**Section 2:**
- **Section Title**: "On Approach"
- **Subheading**: "Performance First"
- **Content**: Your development philosophy...

**Section 3:**
- **Section Title**: "On The Future"
- **Subheading**: "Continuous Evolution"
- **Content**: What you're currently learning...

**💡 Tip:** These sections will appear in the middle column of your About page in the order you set.

### Step 5: Add Social Links

Fill in your social media profiles:
- **Email**: your@email.com
- **GitHub**: https://github.com/yourusername
- **LinkedIn**: https://linkedin.com/in/yourusername
- **Twitter/X**: https://twitter.com/yourusername
- **Website**: https://yourwebsite.com

### Step 6: Save Your Profile

Click **"Save Profile"** at the bottom. Your changes will be logged in the activity log.

---

## 💼 Add Your Projects

### Step 1: Navigate to Projects Manager

1. Click **"Projects"** in the admin sidebar
2. Click **"Add Project"** button

### Step 2: Fill in Project Details

**Required Fields:**
- **Title**: Project name (e.g., "E-Commerce Platform")
- **Short Description**: Brief summary (1-2 sentences)
- **Full Description**: Detailed explanation
- **Year**: When you built it (e.g., "2023")
- **Category**: Type (e.g., "Web App", "Mobile App", "Open Source")

**Optional Fields:**
- **Featured Image**: Upload a screenshot via Cloudinary
- **Tech Stack**: Comma-separated (e.g., "React, Node.js, PostgreSQL")
- **Demo URL**: Link to live demo
- **Repository URL**: GitHub/GitLab link
- **Featured**: Check to highlight on homepage

**💡 Tip:** Add at least 3-5 projects to make your portfolio look complete.

### Step 3: Save Project

Click **"Add Project"** or **"Update Project"** if editing. The project will appear on:
- **Front Page** (if featured)
- **Projects/Classifieds Page** (all projects)

---

## 🛠️ Add Your Skills

### Step 1: Navigate to Skills Manager

1. Click **"Skills"** in the admin sidebar
2. Click **"Add Skill"** button

### Step 2: Add Each Skill

**Fields:**
- **Skill Name**: e.g., "React", "TypeScript", "Node.js"
- **Category**: Choose from dropdown (Frontend, Backend, Database, etc.)
- **Proficiency Level**: Beginner, Intermediate, Advanced, or Expert
- **Years of Experience**: How long you've used it
- **Icon/Logo**: Upload skill icon (optional)
- **Trend**: bullish, high, stable, bearish, declining (for front page market watch)
- **Display Order**: Lower numbers appear first
- **Featured**: Check to show on About page and Front page

**💡 Recommended Skills to Add:**
1. Your primary language (JavaScript/TypeScript/Python)
2. Your main framework (React/Vue/Angular)
3. Backend tech (Node.js/Django/Rails)
4. Database (PostgreSQL/MongoDB/MySQL)
5. DevOps tools (Docker/AWS/Git)
6. Design tools (Figma/Photoshop)

**💡 Tip:** Mark your top 4-8 skills as "Featured" - these will show on:
- **About Page** - "Toolbox" section
- **Front Page** - "Skill Market Watch" sidebar

### Step 3: Save Skills

Click **"Add Skill"**. Skills will appear on multiple pages automatically.

---

## 📰 Add Blog Posts (Optional)

### Step 1: Navigate to Blog Manager

1. Click **"Blog Posts"** in the admin sidebar
2. Click **"New Post"** button

### Step 2: Write Your Post

**Fields:**
- **Title**: Post headline
- **Subtitle**: Optional subheading
- **Author**: Your name (auto-filled)
- **Publish Date**: When to publish
- **Read Time**: Estimated reading time (e.g., "5 min")
- **Category**: Tutorial, Article, News, etc.
- **Tags**: Comma-separated (e.g., "react, typescript, tutorial")
- **Featured Image**: Upload cover image
- **Content**: Write your post (separate paragraphs with blank lines)
- **Publish immediately**: Check to make live

**💡 Tip:** You can save as "Draft" (uncheck publish) to work on it later.

---

## ⚙️ Site Configuration

### Navigate to Site Config

1. Click **"Site Config"** in the admin sidebar
2. Edit global settings:
   - **Site Title**: Portfolio name
   - **Tagline**: Subtitle
   - **Description**: Site summary
   - **Logo**: Site logo image
   - **SEO Settings**: Meta description, keywords, OG image
   - **Analytics**: Google Analytics ID
   - **Social Media**: Global social links
   - **Footer**: Footer text and copyright

**💡 Tip:** These settings apply site-wide.

---

## ✅ Verify Your Changes

### Check the Public Site

After saving changes in the admin panel:

1. Click **"View Site"** button in the admin sidebar (or navigate to front page)
2. Your changes should appear immediately!

**Where to check:**
- **Front Page** → Shows your name, location, experience, featured skills
- **About Page** → Shows full profile, bio, vitals, sections, skills toolbox
- **Projects/Classifieds Page** → Shows all your projects
- **Blog/Editorial Page** → Shows published blog posts

### Troubleshooting

**If changes don't appear:**
1. **Hard refresh**: Press `Ctrl+Shift+R` (Win) or `Cmd+Shift+R` (Mac)
2. **Clear cache**: Browser may be caching old data
3. **Check admin panel**: Ensure you clicked "Save"
4. **Check Activity Log**: Admin Dashboard shows recent changes

---

## 📊 Activity Log & Monitoring

### View Activity Log

1. Go to **Admin Dashboard**
2. Scroll to **"Recent Activity"** section
3. See all your recent changes (creates, updates, deletes)

**Features:**
- Last 10 actions shown
- Color-coded by action type
- Timestamps (relative time)
- **Export Logs** button to download CSV

---

## 🎨 Customization Tips

### Make It Personal

1. **Use your real photo** - Not a placeholder
2. **Write authentic bio** - Tell your story
3. **Showcase best projects** - Quality over quantity (3-6 is good)
4. **Be specific in skills** - List what you actually use
5. **Keep it updated** - Add new projects/skills regularly

### Content Guidelines

**Bio (2-3 paragraphs):**
- Who you are
- What you do
- What makes you unique

**Projects (per project):**
- What problem it solved
- Technologies used
- Your specific role/contribution
- Results/impact

**Skills:**
- Only list skills you can confidently discuss in an interview
- Mark realistic proficiency levels
- Focus on relevant/in-demand technologies

---

## 🔒 Security Notes

### Important Security Steps

1. **Change default admin credentials** in `authService`
2. **Set up environment variables** for API keys (Cloudinary, Firebase)
3. **Enable rate limiting** (already configured - 5 attempts, 15min lockout)
4. **Monitor activity logs** for suspicious actions
5. **Session timeout** is set to 30 minutes

### For Production

- Use real backend (not localStorage)
- Add proper authentication (OAuth, JWT)
- Enable HTTPS
- Add input validation on backend
- Set up automated backups

---

## 🆘 Common Issues & Solutions

### Issue: "No profile data found"
**Solution:** You haven't created a profile yet. Go to Admin → Profile and fill in your details.

### Issue: Projects not showing
**Solution:** Add at least one project in Admin → Projects.

### Issue: Skills not appearing in toolbox
**Solution:** Mark skills as "Featured" in Admin → Skills.

### Issue: Can't upload images
**Solution:** Check Cloudinary API keys in `.env` file.

### Issue: Session keeps timing out
**Solution:** Extend session in `authService` or activity extends it automatically.

### Issue: Changes not saving
**Solution:** Check browser console for errors. Data is stored in localStorage.

---

## 📚 Additional Resources

### Files You Can Edit

**For deeper customization:**
- `src/pages/AboutPage.tsx` - About page layout/styling
- `src/pages/FrontPage.tsx` - Homepage layout
- `src/pages/ClassifiedsPage.tsx` - Projects page layout
- `src/styles/globals.css` - Global styles and colors

### Data Storage

All data is currently stored in **browser localStorage**:
- Profile: `profile` key
- Projects: `projects` key
- Skills: `skills` key
- Blog Posts: `blog_posts` key
- Site Config: `site_config` key

**To export all data:**
```javascript
// In browser console on your site:
const data = {
  profile: localStorage.getItem('profile'),
  projects: localStorage.getItem('projects'),
  skills: localStorage.getItem('skills'),
  blogPosts: localStorage.getItem('blog_posts'),
  siteConfig: localStorage.getItem('site_config')
};
console.log(JSON.stringify(data, null, 2));
```

**To reset/clear all data:**
```javascript
// In browser console:
localStorage.clear();
```

---

## 🎯 Next Steps

1. **✅ Fill in your profile** (Name, bio, photo, vitals, sections)
2. **✅ Add 3-5 projects** with images and descriptions
3. **✅ Add 8-12 skills** and mark top ones as featured
4. **✅ Configure site settings** (title, tagline, SEO, social links)
5. **✅ Test on mobile** and desktop
6. **✅ Share your portfolio!** 🚀

---

## 💬 Need Help?

If you encounter issues:
1. Check the **Activity Log** in Admin Dashboard
2. Open browser **Developer Tools** (F12) → Console tab
3. Look for error messages
4. Check that all required fields are filled

**Happy building!** 🎉
