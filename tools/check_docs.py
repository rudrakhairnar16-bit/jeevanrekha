"""Offline documentation checks; no application or clinical code."""
from pathlib import Path
import re
root = Path(__file__).resolve().parents[1]
errors = []
for p in root.rglob('*.md'):
    if any(part in {'node_modules', '.next', 'test-results', 'playwright-report', '.git'} for part in p.relative_to(root).parts):
        continue
    text = p.read_text(encoding='utf-8')
    for link in re.findall(r'\]\(([^\s)]+)\)', text):
        if link.startswith(('https:', 'http:', 'mailto:', '#')):
            continue
        target = link.split('#')[0]
        if target and not (p.parent / target).exists():
            errors.append(f'{p.relative_to(root)}: missing {target}')
    if text.count('```') % 2:
        errors.append(f'{p.relative_to(root)}: unbalanced code fences')
if errors:
    raise SystemExit('\n'.join(errors))
print('PASS: local Markdown file links and code fences')
