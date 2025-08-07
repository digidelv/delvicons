#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '../dist');
const PORT = 3000;

function generatePreviewHTML() {
  const iconsData = JSON.parse(fs.readFileSync(path.join(DIST_DIR, 'icons.json'), 'utf8'));
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DelvIcons Preview</title>
    <link rel="stylesheet" href="/delvicons.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f8fafc;
            color: #1e293b;
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .header {
            text-align: center;
            margin-bottom: 3rem;
        }
        
        .header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.5rem;
        }
        
        .header p {
            font-size: 1.1rem;
            color: #64748b;
        }
        
        .stats {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin: 2rem 0;
            padding: 1rem;
            background: white;
            border-radius: 0.5rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .stat {
            text-align: center;
        }
        
        .stat-number {
            font-size: 1.5rem;
            font-weight: 700;
            color: #3b82f6;
        }
        
        .stat-label {
            font-size: 0.875rem;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .filters {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
            justify-content: center;
        }
        
        .filter-btn {
            padding: 0.5rem 1rem;
            border: 1px solid #d1d5db;
            background: white;
            border-radius: 0.375rem;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 0.875rem;
        }
        
        .filter-btn:hover,
        .filter-btn.active {
            background: #3b82f6;
            color: white;
            border-color: #3b82f6;
        }
        
        .search {
            max-width: 400px;
            margin: 0 auto 2rem;
        }
        
        .search input {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            font-size: 1rem;
            outline: none;
            transition: border-color 0.2s;
        }
        
        .search input:focus {
            border-color: #3b82f6;
        }
        
        .categories {
            display: grid;
            gap: 2rem;
        }
        
        .category {
            background: white;
            border-radius: 0.5rem;
            padding: 1.5rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .category h2 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #1e293b;
        }
        
        .category p {
            color: #64748b;
            margin-bottom: 1.5rem;
        }
        
        .icons-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 1rem;
        }
        
        .icon-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 1rem;
            border: 1px solid #e2e8f0;
            border-radius: 0.375rem;
            cursor: pointer;
            transition: all 0.2s;
            background: #f8fafc;
        }
        
        .icon-card:hover {
            border-color: #3b82f6;
            background: white;
            transform: translateY(-2px);
        }
        
        .icon-card .delv-icon {
            font-size: 2rem;
            margin-bottom: 0.5rem;
            color: #374151;
        }
        
        .icon-card .icon-name {
            font-size: 0.75rem;
            font-weight: 500;
            text-align: center;
            color: #64748b;
        }
        
        .icon-card.animated .delv-icon {
            color: #3b82f6;
        }
        
        .size-controls {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 2rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .size-btn {
            padding: 0.25rem 0.5rem;
            border: 1px solid #d1d5db;
            background: white;
            border-radius: 0.25rem;
            cursor: pointer;
            font-size: 0.75rem;
            transition: all 0.2s;
        }
        
        .size-btn:hover,
        .size-btn.active {
            background: #f3f4f6;
            border-color: #9ca3af;
        }
        
        .animation-controls {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 2rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .stats {
                flex-direction: column;
                gap: 1rem;
            }
            
            .icons-grid {
                grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>DelvIcons</h1>
            <p>Comprehensive icon library with static and animated SVG icons</p>
        </div>
        
        <div class="stats">
            <div class="stat">
                <div class="stat-number">${Object.keys(iconsData.icons).length}</div>
                <div class="stat-label">Total Icons</div>
            </div>
            <div class="stat">
                <div class="stat-number">${Object.values(iconsData.icons).filter(i => i.type === 'static').length}</div>
                <div class="stat-label">Static Icons</div>
            </div>
            <div class="stat">
                <div class="stat-number">${Object.values(iconsData.icons).filter(i => i.type === 'animated').length}</div>
                <div class="stat-label">Animated Icons</div>
            </div>
            <div class="stat">
                <div class="stat-number">${Object.keys(iconsData.categories).length}</div>
                <div class="stat-label">Categories</div>
            </div>
        </div>
        
        <div class="search">
            <input type="text" id="search" placeholder="Search icons by name or tags...">
        </div>
        
        <div class="filters">
            <button class="filter-btn active" data-filter="all">All Icons</button>
            <button class="filter-btn" data-filter="static">Static Only</button>
            <button class="filter-btn" data-filter="animated">Animated Only</button>
            ${Object.entries(iconsData.categories).map(([key, cat]) => 
                `<button class="filter-btn" data-filter="${key}">${cat.name}</button>`
            ).join('')}
        </div>
        
        <div class="size-controls">
            <button class="size-btn" data-size="delv-icon-xs">XS</button>
            <button class="size-btn" data-size="delv-icon-sm">SM</button>
            <button class="size-btn active" data-size="">MD</button>
            <button class="size-btn" data-size="delv-icon-lg">LG</button>
            <button class="size-btn" data-size="delv-icon-xl">XL</button>
            <button class="size-btn" data-size="delv-icon-2xl">2XL</button>
        </div>
        
        <div class="animation-controls">
            <button class="size-btn" onclick="toggleAnimations(false)">Pause All</button>
            <button class="size-btn" onclick="toggleAnimations(true)">Play All</button>
        </div>
        
        <div class="categories" id="categories">
            ${Object.entries(iconsData.categories).map(([categoryKey, category]) => {
                const categoryIcons = Object.entries(iconsData.icons).filter(([, icon]) => icon.category === categoryKey);
                return `
                    <div class="category" data-category="${categoryKey}">
                        <h2>${category.name}</h2>
                        <p>${category.description}</p>
                        <div class="icons-grid">
                            ${categoryIcons.map(([iconName, iconData]) => {
                                const svgPath = path.join(DIST_DIR, 'svg', iconData.type, Object.values(iconData.variants)[0]);
                                let svgContent = '';
                                if (fs.existsSync(svgPath)) {
                                    svgContent = fs.readFileSync(svgPath, 'utf8');
                                }
                                return `
                                    <div class="icon-card ${iconData.type}" data-name="${iconName}" data-type="${iconData.type}" data-tags="${iconData.tags.join(' ')}">
                                        <div class="delv-icon delv-icon-${iconName} ${iconData.type === 'animated' ? 'delv-animated' : ''}">${svgContent.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '')}</div>
                                        <div class="icon-name">${iconName}</div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    </div>
    
    <script>
        // Filter functionality
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.dataset.filter;
                filterIcons(filter);
            });
        });
        
        // Size controls
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                if (!this.dataset.size) return;
                
                document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const sizeClass = this.dataset.size;
                document.querySelectorAll('.delv-icon').forEach(icon => {
                    icon.className = icon.className.replace(/delv-icon-(xs|sm|lg|xl|2xl)/g, '');
                    if (sizeClass) icon.classList.add(sizeClass);
                });
            });
        });
        
        // Search functionality
        document.getElementById('search').addEventListener('input', function() {
            const query = this.value.toLowerCase();
            filterIcons('search', query);
        });
        
        function filterIcons(type, query = '') {
            const categories = document.querySelectorAll('.category');
            
            categories.forEach(category => {
                const icons = category.querySelectorAll('.icon-card');
                let visibleCount = 0;
                
                icons.forEach(icon => {
                    let show = false;
                    
                    if (type === 'search') {
                        const name = icon.dataset.name;
                        const tags = icon.dataset.tags;
                        show = name.includes(query) || tags.includes(query);
                    } else if (type === 'all') {
                        show = true;
                    } else if (type === 'static' || type === 'animated') {
                        show = icon.dataset.type === type;
                    } else {
                        show = category.dataset.category === type;
                    }
                    
                    icon.style.display = show ? 'flex' : 'none';
                    if (show) visibleCount++;
                });
                
                category.style.display = visibleCount > 0 ? 'block' : 'none';
            });
        }
        
        function toggleAnimations(play) {
            document.querySelectorAll('.delv-animated').forEach(icon => {
                icon.style.animationPlayState = play ? 'running' : 'paused';
            });
        }
        
        // Copy icon name on click
        document.querySelectorAll('.icon-card').forEach(card => {
            card.addEventListener('click', function() {
                const iconName = this.dataset.name;
                navigator.clipboard.writeText(iconName).then(() => {
                    const originalText = this.querySelector('.icon-name').textContent;
                    this.querySelector('.icon-name').textContent = 'Copied!';
                    setTimeout(() => {
                        this.querySelector('.icon-name').textContent = originalText;
                    }, 1000);
                });
            });
        });
    </script>
</body>
</html>
  `;
  
  return html.trim();
}

function startPreviewServer() {
  const server = http.createServer((req, res) => {
    const url = req.url;
    
    if (url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(generatePreviewHTML());
    } else if (url === '/delvicons.css') {
      const cssPath = path.join(DIST_DIR, 'delvicons.css');
      if (fs.existsSync(cssPath)) {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(fs.readFileSync(cssPath, 'utf8'));
      } else {
        res.writeHead(404);
        res.end('CSS not found');
      }
    } else if (url.startsWith('/svg/')) {
      const svgPath = path.join(DIST_DIR, url);
      if (fs.existsSync(svgPath)) {
        res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
        res.end(fs.readFileSync(svgPath, 'utf8'));
      } else {
        res.writeHead(404);
        res.end('SVG not found');
      }
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });
  
  server.listen(PORT, () => {
    console.log(`🚀 DelvIcons preview server running at http://localhost:${PORT}`);
    console.log('📁 Serving from:', DIST_DIR);
    
    // Try to open browser (cross-platform)
    const start = process.platform === 'darwin' ? 'open' :
                  process.platform === 'win32' ? 'start' : 'xdg-open';
    import('child_process').then(({ exec }) => {
      exec(`${start} http://localhost:${PORT}`);
    });
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ Dist folder not found. Please run "npm run build" first.');
    process.exit(1);
  }
  
  startPreviewServer();
}