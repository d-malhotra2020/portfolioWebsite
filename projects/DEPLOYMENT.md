# Project Deployment Guide

This guide walks through deploying all 5 portfolio projects to make them publicly accessible.

## 🚀 Recommended Hosting Platforms

### Free Tier Options:
1. **Railway** (Recommended) - railway.app
2. **Render** - render.com  
3. **Heroku** - heroku.com
4. **Vercel** (for static/frontend) - vercel.com

## 📦 Quick Deploy Instructions

### Option 1: Railway (Easiest)

1. **Sign up** at https://railway.app with GitHub
2. **Connect your repository**: d-malhotra2020/portfolioWebsite
3. **Create 5 separate services**, each pointing to a project subdirectory:

**Smart Home Automation**
- Root Directory: `/projects/smart-home-automation`
- Start Command: `python main.py`
- Port: Auto-detected from environment

**Financial Analysis Tool**  
- Root Directory: `/projects/financial-analysis-tool`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Port: Auto-detected

**Traffic Optimization**
- Root Directory: `/projects/traffic-optimization`  
- Start Command: `uvicorn src.main:app --host 0.0.0.0 --port $PORT`
- Port: Auto-detected

**Video Analytics**
- Root Directory: `/projects/video-analytics`
- Start Command: `python -m src.main`  
- Port: Auto-detected

**Donation Platform**
- Root Directory: `/projects/donation-platform`
- Start Command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
- Port: Auto-detected

### Option 2: Render

1. **Sign up** at https://render.com with GitHub
2. **Create Web Service** for each project
3. **Configure each service:**
   - Repository: d-malhotra2020/portfolioWebsite
   - Root Directory: projects/[project-name]
   - Build Command: `pip install -r requirements.txt`
   - Start Command: (see Procfiles in each project)

### Option 3: Manual Docker Deployment

Each project includes deployment files. You can:

1. **Build Docker images** (if Docker files are added)
2. **Deploy to any cloud provider** (AWS, GCP, Azure)
3. **Use Docker Compose** for local multi-service deployment

## 🔧 Environment Configuration

### Required Environment Variables:

**Financial Analysis Tool:**
```
ALPHA_VANTAGE_API_KEY=demo
DATABASE_URL=sqlite:///./financial.db
```

**All Projects:**
```
PORT=8080  # Will be set automatically by hosting platform
```

## 📋 Deployment Checklist

- [ ] Create accounts on chosen hosting platform
- [ ] Deploy Smart Home Automation System
- [ ] Deploy Financial Analysis Tool  
- [ ] Deploy Traffic Optimization Engine
- [ ] Deploy Video Analytics Platform
- [ ] Deploy Donation Platform Enhancement
- [ ] Update portfolio website with live URLs
- [ ] Test all deployments
- [ ] Monitor performance and usage

## 🌐 Expected Live URLs (examples)

After deployment, your URLs will look like:
- Smart Home: `https://smart-home-automation-production.up.railway.app`
- Financial: `https://financial-analysis-production.up.railway.app` 
- Traffic: `https://traffic-optimization-production.up.railway.app`
- Video: `https://video-analytics-production.up.railway.app`
- Donation: `https://donation-platform-production.up.railway.app`

## 🔄 Updating Portfolio Links

Once deployed, update the live demo links in:
`src/components/Projects.jsx`

Replace localhost URLs with your actual deployment URLs:
```javascript
links: {
  github: "https://github.com/d-malhotra2020/portfolioWebsite/tree/main/projects/smart-home-automation",
  live: "https://your-actual-deployment-url.com"  // Update this
}
```

## 💡 Pro Tips

1. **Start with Railway** - it's the easiest for Python projects
2. **Deploy one project at a time** to troubleshoot issues
3. **Monitor resource usage** to stay within free tier limits
4. **Use custom domains** if you want professional URLs
5. **Set up monitoring** to ensure uptime

## 🆘 Troubleshooting

**Common Issues:**
- **Port binding errors**: Make sure apps use `PORT` environment variable
- **Dependency issues**: Check requirements.txt files are complete
- **Memory limits**: Free tiers have RAM restrictions
- **Build timeouts**: Large dependencies may need optimization

**Solutions:**
- Check logs in your hosting platform's dashboard
- Verify all requirements.txt files are present
- Test locally first with production settings
- Use health check endpoints for monitoring