const fs = require('fs');

const path = '/Users/shivamsinghal/Projects/ai-interview-platform/src/components/LandingPage.tsx';
let code = fs.readFileSync(path, 'utf8');

// The massive regex replacement to use native CSS variables!
const replacements = [
  { p: /'#030009'/g, r: "'var(--landing-bg-primary)'" },
  { p: /'#fff'/g, r: "'var(--landing-text-primary)'" },
  { p: /'rgba\(255, ?255, ?255, ?0\.85\)'/g, r: "'var(--landing-text-high)'" },
  { p: /'rgba\(255, ?255, ?255, ?0\.8\)'/g, r: "'var(--landing-text-high)'" },
  { p: /'rgba\(255, ?255, ?255, ?0\.65\)'/g, r: "'var(--landing-text-accent)'" },
  { p: /'rgba\(255, ?255, ?255, ?0\.6\)'/g, r: "'var(--landing-text-muted)'" },
  { p: /'rgba\(255, ?255, ?255, ?0\.55\)'/g, r: "'var(--landing-text-muted)'" },
  { p: /'rgba\(255, ?255, ?255, ?0\.5\)'/g, r: "'var(--landing-text-muted)'" },
  { p: /'rgba\(255, ?255, ?255, ?0\.45\)'/g, r: "'var(--landing-text-dim)'" },
  { p: /'rgba\(255, ?255, ?255, ?0\.48\)'/g, r: "'var(--landing-text-dim)'" },
  { p: /'rgba\(255, ?255, ?255, ?0\.4\)'/g, r: "'var(--landing-text-dim)'" },
  { p: /'rgba\(255, ?255, ?255, ?0\.35\)'/g, r: "'var(--landing-text-dim)'" },
  { p: /'rgba\(255, ?255, ?255, ?0\.3\)'/g, r: "'var(--landing-text-dim)'" },
  
  { p: /'rgba\(255, ?255, ?255, ?0\.15\)'/g, r: "'var(--landing-border-strong)'" },
  { p: /'rgba\(255, ?255, ?255, ?0\.08\)'/g, r: "'var(--landing-border)'" },
  { p: /'rgba\(255, ?255, ?255, ?0\.06\)'/g, r: "'var(--landing-border)'" },
  { p: /'rgba\(255, ?255, ?255, ?0\.05\)'/g, r: "'var(--landing-border-light)'" },
  { p: /'rgba\(255, ?255, ?255, ?0\.04\)'/g, r: "'var(--landing-border-light)'" },
  { p: /'rgba\(255, ?255, ?255, ?0\.03\)'/g, r: "'var(--landing-card-bg)'" },
  { p: /'rgba\(255, ?255, ?255, ?0\.02\)'/g, r: "'var(--landing-card-bg)'" },
  { p: /'rgba\(255, ?255, ?255, ?0\.01\)'/g, r: "'var(--landing-card-bg)'" },
  { p: /'rgba\(255, ?255, ?255, ?0\.015\)'/g, r: "'var(--landing-card-bg)'" },

  { p: /'rgba\(3, ?1, ?8, ?0\.6\)'/g, r: "'var(--landing-glass)'" },
  { p: /'rgba\(3, ?1, ?8, ?0\.75\)'/g, r: "'var(--landing-glass-dark)'" },
  { p: /'rgba\(14, ?10, ?24, ?0\.95\)'/g, r: "'var(--landing-glass-heavy)'" },
  { p: /'rgba\(20, ?16, ?28, ?0\.95\)'/g, r: "'var(--landing-glass-heavy)'" },
];

replacements.forEach(({p, r}) => {
  code = code.replace(p, r);
});

// Write it back
fs.writeFileSync(path, code, 'utf8');

console.log("Refactored JSX to use CSS Variables successfully!");
