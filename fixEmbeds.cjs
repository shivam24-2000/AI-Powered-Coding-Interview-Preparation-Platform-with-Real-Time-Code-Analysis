const fs = require('fs');

const path = '/Users/shivamsinghal/Projects/ai-interview-platform/src/components/LandingPage.tsx';
let code = fs.readFileSync(path, 'utf8');

// Advanced RegEx to catch embedded rgba values
const advancedReplacements = [
  // Fix explicit onMouseLeave resets
  { p: /e\.currentTarget\.style\.background='rgba\(255,255,255,0\.02\)'/g, r: "e.currentTarget.style.background='var(--landing-card-bg)'" },
  { p: /e\.currentTarget\.style\.borderColor='rgba\(255,255,255,0\.05\)'/g, r: "e.currentTarget.style.borderColor='var(--landing-border-light)'" },
  
  // Fix embedded borders
  { p: /'1px solid rgba\(255,255,255,0\.04\)'/g, r: "'1px solid var(--landing-border-light)'" },
  { p: /'1px solid rgba\(255,255,255,0\.05\)'/g, r: "'1px solid var(--landing-border-light)'" },
  { p: /'1px solid rgba\(255,255,255,0\.06\)'/g, r: "'1px solid var(--landing-border)'" },
  { p: /'1px solid rgba\(255,255,255,0\.1\)'/g, r: "'1px solid var(--landing-border-strong)'" },
  { p: /'1px solid rgba\(255,255,255,0\.15\)'/g, r: "'1px solid var(--landing-border-strong)'" },
  { p: /'1px solid rgba\(255,255,255,0\.2\)'/g, r: "'1px solid var(--landing-border-strong)'" },

  // Shadow opacities inside box-shadows (they usually just need to not be white in light mode)
  // We'll leave rgba(255,255,255) in box shadows mostly alone unless explicitly #fff

  // Gradient buttons text color fix
  // I'll replace color: 'var(--landing-text-primary)' with color: '#fff' for anything containing a gradient!
];

advancedReplacements.forEach(({p, r}) => {
  code = code.replace(p, r);
});

// Write it back
fs.writeFileSync(path, code, 'utf8');
console.log("Refactored JSX embedded strings successfully!");
