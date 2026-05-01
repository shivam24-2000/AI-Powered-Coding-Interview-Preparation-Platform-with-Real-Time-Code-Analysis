const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'LandingPage.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// The CSS to replace the invert hack
const cssBlock = `        /* Premium Light Mode Architecture */
        :root {
          --landing-bg: #030009;
          --landing-text: #ffffff;
          --landing-text-muted: rgba(255, 255, 255, 0.6);
          --landing-text-dim: rgba(255, 255, 255, 0.4);
          --landing-border: rgba(255, 255, 255, 0.08);
          --landing-border-light: rgba(255, 255, 255, 0.04);
          --landing-card: rgba(255, 255, 255, 0.02);
          --landing-card-hover: rgba(255, 255, 255, 0.05);
          --landing-glass: rgba(14, 10, 24, 0.85);
          --landing-glow: rgba(168, 85, 247, 0.15);
        }
        .landing-light-mode {
          --landing-bg: #fafafa;
          --landing-text: #0f172a;
          --landing-text-muted: rgba(15, 23, 42, 0.7);
          --landing-text-dim: rgba(15, 23, 42, 0.5);
          --landing-border: rgba(0, 0, 0, 0.1);
          --landing-border-light: rgba(0, 0, 0, 0.05);
          --landing-card: #ffffff;
          --landing-card-hover: rgba(0, 0, 0, 0.02);
          --landing-glass: rgba(255, 255, 255, 0.85);
          --landing-glow: rgba(168, 85, 247, 0.1);
        }
        .landing-light-mode .stat-card, .landing-light-mode .problem-card-enhanced {
          box-shadow: 0 4px 20px rgba(0,0,0,0.06) !important;
        }
        .landing-light-mode img.invert-protect {
          filter: none;
        }`;

content = content.replace(/\/\* Light Mode Overrides \*\/[\s\S]*?(?=\`\}<\/style>)/, cssBlock + '\n      ');

// Replace colors in styles object
content = content.replace(/background: '#030009'/g, "background: 'var(--landing-bg)'");
content = content.replace(/color: '#fff'/g, "color: 'var(--landing-text)'");
content = content.replace(/rgba\(255, 255, 255, 0\.04\)/g, "var(--landing-border-light)");
content = content.replace(/rgba\(255,255,255,0\.04\)/g, "var(--landing-border-light)");
content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.06\)/g, "var(--landing-border)");
content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.08\)/g, "var(--landing-border)");
content = content.replace(/rgba\(255,255,255,0\.6\)/g, "var(--landing-text-muted)");
content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.55\)/g, "var(--landing-text-muted)");
content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.5\)/g, "var(--landing-text-muted)");
content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.4\)/g, "var(--landing-text-dim)");
content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.45\)/g, "var(--landing-text-dim)");
content = content.replace(/rgba\(255,255,255,0\.02\)/g, "var(--landing-card)");
content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.01\)/g, "var(--landing-card)");
content = content.replace(/rgba\(3, 1, 8, 0\.6\)/g, "var(--landing-glass)");
content = content.replace(/rgba\(10, 8, 18, 0\.8\)/g, "var(--landing-glass)");
content = content.replace(/rgba\(20, 16, 28, 0\.95\)/g, "var(--landing-glass)");
content = content.replace(/rgba\(14,10,24,0\.95\)/g, "var(--landing-glass)");
content = content.replace(/#111827/g, "var(--landing-text)"); // If any existed

// Make some specific JSX fixes for light mode readability
content = content.replace(/background: 'linear-gradient\(135deg, #fff 0%, rgba\(255,255,255,0\.65\) 100%\)'/g, "background: 'var(--landing-text)'");
content = content.replace(/background: 'rgba\(3, 1, 8, 0\.75\)'/g, "background: 'var(--landing-bg)'");

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Theme variables implemented!');
