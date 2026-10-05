const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

// Replace root variables
css = css.replace(
  /:root \{[\s\S]*?\}/,
  `:root {
  --primary: #a855f7;
  --primary-hover: #9333ea;
  --bg-color: #0B0F19;
  --text-color: #f1f5f9;
  --text-muted: #94a3b8;
  --surface-color: rgba(30, 41, 59, 0.6);
  --border-color: rgba(255, 255, 255, 0.1);
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}`
);

// Replace body styles
css = css.replace(
  /body \{[\s\S]*?\}/,
  `body {
  font-family: 'Outfit', 'Inter', -apple-system, sans-serif;
  background-color: var(--bg-color);
  background-image: 
    radial-gradient(circle at 15% 50%, rgba(168, 85, 247, 0.15), transparent 25%),
    radial-gradient(circle at 85% 30%, rgba(6, 182, 212, 0.15), transparent 25%);
  background-attachment: fixed;
  color: var(--text-color);
  line-height: 1.6;
}`
);

// Update glass-card
css = css.replace(
  /\.glass-card \{[\s\S]*?\}/,
  `.glass-card {
  background: var(--surface-color);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-color);
  box-shadow: var(--glass-shadow);
}`
);

// Replace hardcoded grays
css = css.replace(/#4b5563/g, 'var(--text-muted)');
css = css.replace(/#6b7280/g, 'var(--text-muted)');

// Make navbar transparent/glassy
css = css.replace(
  /\.navbar \{[\s\S]*?\}/,
  `.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: rgba(11, 15, 25, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
}`
);

// Make standard cards glassy too
css = css.replace(
  /\.card \{[\s\S]*?\}/,
  `.card {
  background-color: var(--surface-color);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: var(--glass-shadow);
}`
);

fs.writeFileSync('src/index.css', css);
console.log('CSS updated successfully');
