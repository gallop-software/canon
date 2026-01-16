import * as fs from 'fs';
import * as path from 'path';
import { version, patterns, guarantees } from '../../index.js';
/**
 * Read a pattern markdown file and extract sections
 */
function readPatternFile(patternFile) {
    // Try to find the canon package patterns directory
    const possiblePaths = [
        path.join(process.cwd(), 'node_modules/@gallop.software/canon', patternFile),
        // Fallback for development
        path.join(import.meta.dirname, '../../../', patternFile),
    ];
    for (const filePath of possiblePaths) {
        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath, 'utf-8');
        }
    }
    return null;
}
/**
 * Extract examples from pattern markdown
 */
function extractExamples(content) {
    const good = [];
    const bad = [];
    // Find code blocks after "### Good" or "### Bad" headers
    const goodMatch = content.match(/### Good\s*\n```[\s\S]*?```/g);
    const badMatch = content.match(/### Bad\s*\n```[\s\S]*?```/g);
    if (goodMatch) {
        for (const match of goodMatch) {
            const code = match.replace(/### Good\s*\n/, '').trim();
            good.push(code);
        }
    }
    if (badMatch) {
        for (const match of badMatch) {
            const code = match.replace(/### Bad\s*\n/, '').trim();
            bad.push(code);
        }
    }
    return { good, bad };
}
/**
 * Generate .cursorrules content from Canon
 */
function generateCursorrules() {
    const lines = [];
    // Header
    lines.push(`# Gallop Canon v${version} - AI Rules`);
    lines.push('');
    lines.push('This file is auto-generated from @gallop.software/canon. Do not edit manually.');
    lines.push('Regenerate with: npm run generate:ai-rules');
    lines.push('');
    // Tech stack (Canon-compatible templates)
    lines.push('## Tech Stack');
    lines.push('');
    lines.push('- Next.js 16 with App Router');
    lines.push('- React 19');
    lines.push('- TypeScript');
    lines.push('- Tailwind CSS v4');
    lines.push('- clsx for conditional class names');
    lines.push('');
    // Enforced patterns (ESLint rules)
    lines.push('## Enforced Patterns (ESLint)');
    lines.push('');
    lines.push('These patterns are enforced by `@gallop.software/canon/eslint`. Violations will be flagged.');
    lines.push('');
    const enforcedPatterns = patterns.filter(p => p.enforcement === 'eslint' && p.rule);
    for (const pattern of enforcedPatterns) {
        lines.push(`### ${pattern.id}: ${pattern.title}`);
        lines.push('');
        lines.push(pattern.summary);
        lines.push('');
        lines.push(`- **ESLint Rule:** \`${pattern.rule}\``);
        lines.push(`- **Category:** ${pattern.category}`);
        lines.push('');
        // Try to read and include examples
        const content = readPatternFile(pattern.file);
        if (content) {
            const { good, bad } = extractExamples(content);
            if (bad.length > 0) {
                lines.push('**Bad:**');
                lines.push('');
                lines.push(bad[0]);
                lines.push('');
            }
            if (good.length > 0) {
                lines.push('**Good:**');
                lines.push('');
                lines.push(good[0]);
                lines.push('');
            }
        }
    }
    // Documentation patterns
    lines.push('## Documentation Patterns');
    lines.push('');
    lines.push('These patterns are not enforced by ESLint but should be followed.');
    lines.push('');
    const docPatterns = patterns.filter(p => p.enforcement === 'documentation');
    for (const pattern of docPatterns) {
        lines.push(`### ${pattern.id}: ${pattern.title}`);
        lines.push('');
        lines.push(pattern.summary);
        lines.push('');
    }
    // Guarantees
    lines.push('## Canon Guarantees');
    lines.push('');
    lines.push('Following these patterns provides these guarantees:');
    lines.push('');
    for (const guarantee of guarantees) {
        lines.push(`- **${guarantee.name}** (${guarantee.id}): Patterns ${guarantee.patterns.join(', ')}`);
    }
    lines.push('');
    // Quick reference for components
    lines.push('## Component Quick Reference');
    lines.push('');
    lines.push('### Typography');
    lines.push('- `Heading` - props: `as`, `color`, `margin`, `fontSize`, `fontWeight`, `textAlign`');
    lines.push('- `Paragraph` - props: `color`, `margin`, `fontSize`, `lineHeight`, `textAlign`');
    lines.push('- `Span` - props: `color`, `margin`, `fontSize` (inline text, mb-0 default)');
    lines.push('- `Label` - props: `color`, `margin`, `fontSize`, `fontWeight`, `textAlign`');
    lines.push('- `Quote` - props: `variant`, `color`, `margin`, `fontSize`, `fontWeight`, `textAlign`');
    lines.push('');
    lines.push('### Layout');
    lines.push('- `Section` - semantic section wrapper');
    lines.push('- `Columns` - grid layout, props: `cols`, `gap`, `align`');
    lines.push('- `Column` - column child');
    lines.push('');
    lines.push('### Interactive');
    lines.push('- `Button` - props: `href`, `variant`, `icon`, `iconPlacement`, `margin`');
    lines.push('- `Icon` - Iconify icon wrapper');
    lines.push('');
    // Do NOT section
    lines.push('## Do NOT');
    lines.push('');
    lines.push('- Use `\'use client\'` in blocks - extract to components');
    lines.push('- Use raw `<p>` or `<span>` - use Paragraph/Span components');
    lines.push('- Use className for margin/color/fontSize when component has props');
    lines.push('- Use Container inside Section - Section already provides containment');
    lines.push('- Use `classnames` package - use `clsx` instead');
    lines.push('- Use inline styles for hover states - use Tailwind classes');
    lines.push('- Use native `IntersectionObserver` - use `react-intersection-observer` package');
    lines.push('');
    // File & Folder Authority section
    lines.push('## File & Folder Authority');
    lines.push('');
    lines.push('These rules govern what AI is allowed and forbidden to do when creating, moving, or modifying files and folders.');
    lines.push('');
    lines.push('### Defined `/src` Structure');
    lines.push('');
    lines.push('```');
    lines.push('src/');
    lines.push('├── app/          # Routes, layouts, metadata (Next.js App Router)');
    lines.push('├── blocks/       # Page-level content sections');
    lines.push('├── blog/         # Blog content (archive content type)');
    lines.push('├── components/   # Reusable UI primitives');
    lines.push('├── hooks/        # Custom React hooks');
    lines.push('├── styles/       # CSS, Tailwind, fonts');
    lines.push('├── template/     # Template-level components');
    lines.push('├── tools/        # Utility tools');
    lines.push('├── types/        # TypeScript types');
    lines.push('├── utils/        # Utility functions');
    lines.push('└── state.ts      # Global state');
    lines.push('```');
    lines.push('');
    lines.push('### App Router Structure');
    lines.push('');
    lines.push('Routes must use Next.js route groups. At minimum, `(default)` must exist:');
    lines.push('');
    lines.push('```');
    lines.push('src/app/');
    lines.push('├── (default)/        # Required - default layout group');
    lines.push('│   ├── layout.tsx');
    lines.push('│   └── {routes}/');
    lines.push('├── (hero)/           # Optional - hero layout variant');
    lines.push('├── api/              # API routes (exception - no grouping)');
    lines.push('├── layout.tsx        # Root layout');
    lines.push('└── metadata.tsx      # Shared metadata');
    lines.push('```');
    lines.push('');
    lines.push('- All page routes must be inside a route group (parentheses folder)');
    lines.push('- Never create routes directly under `src/app/` (except `api/`, root files)');
    lines.push('- New route groups are allowed freely when a new layout variant is needed');
    lines.push('');
    lines.push('### File Structure Rules');
    lines.push('');
    lines.push('**Blocks:**');
    lines.push('- Always single files directly in `src/blocks/`');
    lines.push('- Never create folders inside `src/blocks/`');
    lines.push('- Example: `src/blocks/hero-1.tsx`, `src/blocks/testimonial-3.tsx`');
    lines.push('');
    lines.push('**Components:**');
    lines.push('- Simple components: Single file in `src/components/`');
    lines.push('- Complex components: Folder with `index.tsx`');
    lines.push('- Use folders when component has multiple sub-files');
    lines.push('');
    lines.push('### DO - What AI IS Allowed To Do');
    lines.push('');
    lines.push('- Create files only inside existing Canon-defined zones');
    lines.push('- Place new files in the zone that matches their architectural role');
    lines.push('- Follow existing folder conventions within a zone');
    lines.push('- Reuse existing folders when possible');
    lines.push('- Create new route groups in `src/app/` when new layouts are needed');
    lines.push('- Create new archive content folders (like `blog/`, `portfolio/`) in `/src`');
    lines.push('- Create dotfiles/directories at project root (`.github/`, `.cursor/`, etc.)');
    lines.push('- Ask for confirmation if the correct zone is ambiguous');
    lines.push('');
    lines.push('### DO NOT - What AI Is Forbidden To Do');
    lines.push('');
    lines.push('- Create new top-level directories (except dotfiles)');
    lines.push('- Create new folders in `/src` (except archive content or route groups)');
    lines.push('- Place files outside Canon-defined zones');
    lines.push('- Mix responsibilities across zones (components importing blocks, etc.)');
    lines.push('- Reorganize or move folders without explicit instruction');
    lines.push('- Invent new organizational conventions');
    lines.push('- Create placeholder or speculative files');
    lines.push('- Import from `_scripts/` or `_data/` in runtime code');
    lines.push('- Manually edit files in `_data/` (generated only)');
    lines.push('');
    // Post-edit verification
    lines.push('## Post-Edit Verification');
    lines.push('');
    lines.push('After editing files:');
    lines.push('1. Run `npm run lint` to check for errors');
    lines.push('2. Fix any violations before committing');
    lines.push('');
    lines.push('Note: Only lint files you edited, not the entire codebase.');
    lines.push('');
    return lines.join('\n');
}
export async function generate(options) {
    const content = generateCursorrules();
    if (options.output === '-') {
        // Output to stdout
        console.log(content);
    }
    else {
        // Write to file
        const outputPath = path.resolve(process.cwd(), options.output);
        fs.writeFileSync(outputPath, content, 'utf-8');
        console.log(`✓ Generated ${options.output} from Canon v${version}`);
        console.log(`  ${patterns.length} patterns, ${guarantees.length} guarantees`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2xpL2NvbW1hbmRzL2dlbmVyYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxFQUFFLE1BQU0sSUFBSSxDQUFBO0FBQ3hCLE9BQU8sS0FBSyxJQUFJLE1BQU0sTUFBTSxDQUFBO0FBQzVCLE9BQU8sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFjLFVBQVUsRUFBRSxNQUFNLGdCQUFnQixDQUFBO0FBTzFFOztHQUVHO0FBQ0gsU0FBUyxlQUFlLENBQUMsV0FBbUI7SUFDMUMsbURBQW1EO0lBQ25ELE1BQU0sYUFBYSxHQUFHO1FBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLHFDQUFxQyxFQUFFLFdBQVcsQ0FBQztRQUM1RSwyQkFBMkI7UUFDM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsV0FBVyxDQUFDO0tBQ3pELENBQUE7SUFFRCxLQUFLLE1BQU0sUUFBUSxJQUFJLGFBQWEsRUFBRSxDQUFDO1FBQ3JDLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1lBQzVCLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFDM0MsQ0FBQztJQUNILENBQUM7SUFFRCxPQUFPLElBQUksQ0FBQTtBQUNiLENBQUM7QUFFRDs7R0FFRztBQUNILFNBQVMsZUFBZSxDQUFDLE9BQWU7SUFDdEMsTUFBTSxJQUFJLEdBQWEsRUFBRSxDQUFBO0lBQ3pCLE1BQU0sR0FBRyxHQUFhLEVBQUUsQ0FBQTtJQUV4Qix5REFBeUQ7SUFDekQsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFBO0lBQy9ELE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FB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QUFDLElBQUksQ0FBQyw0REFBNEQsQ0FBQyxDQUFBO0lBQ3hFLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7SUFFZCxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDekIsQ0FBQztBQUVELE1BQU0sQ0FBQyxLQUFLLFVBQVUsUUFBUSxDQUFDLE9BQXdCO0lBQ3JELE1BQU0sT0FBTyxHQUFHLG1CQUFtQixFQUFFLENBQUE7SUFFckMsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQzNCLG1CQUFtQjtRQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ3RCLENBQUM7U0FBTSxDQUFDO1FBQ04sZ0JBQWdCO1FBQ2hCLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUM5RCxFQUFFLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFDOUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLE9BQU8sQ0FBQyxNQUFNLGdCQUFnQixPQUFPLEVBQUUsQ0FBQyxDQUFBO1FBQ25FLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxRQUFRLENBQUMsTUFBTSxjQUFjLFVBQVUsQ0FBQyxNQUFNLGFBQWEsQ0FBQyxDQUFBO0lBQy9FLENBQUM7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyB2ZXJzaW9uLCBwYXR0ZXJucywgY2F0ZWdvcmllcywgZ3VhcmFudGVlcyB9IGZyb20gJy4uLy4uL2luZGV4LmpzJ1xuXG5pbnRlcmZhY2UgR2VuZXJhdGVPcHRpb25zIHtcbiAgb3V0cHV0OiBzdHJpbmdcbiAgZm9ybWF0OiAnY3Vyc29ycnVsZXMnIHwgJ21hcmtkb3duJ1xufVxuXG4vKipcbiAqIFJlYWQgYSBwYXR0ZXJuIG1hcmtkb3duIGZpbGUgYW5kIGV4dHJhY3Qgc2VjdGlvbnNcbiAqL1xuZnVuY3Rpb24gcmVhZFBhdHRlcm5GaWxlKHBhdHRlcm5GaWxlOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgLy8gVHJ5IHRvIGZpbmQgdGhlIGNhbm9uIHBhY2thZ2UgcGF0dGVybnMgZGlyZWN0b3J5XG4gIGNvbnN0IHBvc3NpYmxlUGF0aHMgPSBbXG4gICAgcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdub2RlX21vZHVsZXMvQGdhbGxvcC5zb2Z0d2FyZS9jYW5vbicsIHBhdHRlcm5GaWxlKSxcbiAgICAvLyBGYWxsYmFjayBmb3IgZGV2ZWxvcG1lbnRcbiAgICBwYXRoLmpvaW4oaW1wb3J0Lm1ldGEuZGlybmFtZSwgJy4uLy4uLy4uLycsIHBhdHRlcm5GaWxlKSxcbiAgXVxuXG4gIGZvciAoY29uc3QgZmlsZVBhdGggb2YgcG9zc2libGVQYXRocykge1xuICAgIGlmIChmcy5leGlzdHNTeW5jKGZpbGVQYXRoKSkge1xuICAgICAgcmV0dXJuIGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCwgJ3V0Zi04JylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbFxufVxuXG4vKipcbiAqIEV4dHJhY3QgZXhhbXBsZXMgZnJvbSBwYXR0ZXJuIG1hcmtkb3duXG4gKi9cbmZ1bmN0aW9uIGV4dHJhY3RFeGFtcGxlcyhjb250ZW50OiBzdHJpbmcpOiB7IGdvb2Q6IHN0cmluZ1tdOyBiYWQ6IHN0cmluZ1tdIH0ge1xuICBjb25zdCBnb29kOiBzdHJpbmdbXSA9IFtdXG4gIGNvbnN0IGJhZDogc3RyaW5nW10gPSBbXVxuXG4gIC8vIEZpbmQgY29kZSBibG9ja3MgYWZ0ZXIgXCIjIyMgR29vZFwiIG9yIFwiIyMjIEJhZFwiIGhlYWRlcnNcbiAgY29uc3QgZ29vZE1hdGNoID0gY29udGVudC5tYXRjaCgvIyMjIEdvb2RcXHMqXFxuYGBgW1xcc1xcU10qP2BgYC9nKVxuICBjb25zdCBiYWRNYXRjaCA9IGNvbnRlbnQubWF0Y2goLyMjIyBCYWRcXHMqXFxuYGBgW1xcc1xcU10qP2BgYC9nKVxuXG4gIGlmIChnb29kTWF0Y2gpIHtcbiAgICBmb3IgKGNvbnN0IG1hdGNoIG9mIGdvb2RNYXRjaCkge1xuICAgICAgY29uc3QgY29kZSA9IG1hdGNoLnJlcGxhY2UoLyMjIyBHb29kXFxzKlxcbi8sICcnKS50cmltKClcbiAgICAgIGdvb2QucHVzaChjb2RlKVxuICAgIH1cbiAgfVxuXG4gIGlmIChiYWRNYXRjaCkge1xuICAgIGZvciAoY29uc3QgbWF0Y2ggb2YgYmFkTWF0Y2gpIHtcbiAgICAgIGNvbnN0IGNvZGUgPSBtYXRjaC5yZXBsYWNlKC8jIyMgQmFkXFxzKlxcbi8sICcnKS50cmltKClcbiAgICAgIGJhZC5wdXNoKGNvZGUpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHsgZ29vZCwgYmFkIH1cbn1cblxuLyoqXG4gKiBHZW5lcmF0ZSAuY3Vyc29ycnVsZXMgY29udGVudCBmcm9tIENhbm9uXG4gKi9cbmZ1bmN0aW9uIGdlbmVyYXRlQ3Vyc29ycnVsZXMoKTogc3RyaW5nIHtcbiAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gW11cblxuICAvLyBIZWFkZXJcbiAgbGluZXMucHVzaChgIyBHYWxsb3AgQ2Fub24gdiR7dmVyc2lvbn0gLSBBSSBSdWxlc2ApXG4gIGxpbmVzLnB1c2goJycpXG4gIGxpbmVzLnB1c2goJ1RoaXMgZmlsZSBpcyBhdXRvLWdlbmVyYXRlZCBmcm9tIEBnYWxsb3Auc29mdHdhcmUvY2Fub24uIERvIG5vdCBlZGl0IG1hbnVhbGx5LicpXG4gIGxpbmVzLnB1c2goJ1JlZ2VuZXJhdGUgd2l0aDogbnBtIHJ1biBnZW5lcmF0ZTphaS1ydWxlcycpXG4gIGxpbmVzLnB1c2goJycpXG5cbiAgLy8gVGVjaCBzdGFjayAoQ2Fub24tY29tcGF0aWJsZSB0ZW1wbGF0ZXMpXG4gIGxpbmVzLnB1c2goJyMjIFRlY2ggU3RhY2snKVxuICBsaW5lcy5wdXNoKCcnKVxuICBsaW5lcy5wdXNoKCctIE5leHQuanMgMTYgd2l0aCBBcHAgUm91dGVyJylcbiAgbGluZXMucHVzaCgnLSBSZWFjdCAxOScpXG4gIGxpbmVzLnB1c2goJy0gVHlwZVNjcmlwdCcpXG4gIGxpbmVzLnB1c2goJy0gVGFpbHdpbmQgQ1NTIHY0JylcbiAgbGluZXMucHVzaCgnLSBjbHN4IGZvciBjb25kaXRpb25hbCBjbGFzcyBuYW1lcycpXG4gIGxpbmVzLnB1c2goJycpXG5cbiAgLy8gRW5mb3JjZWQgcGF0dGVybnMgKEVTTGludCBydWxlcylcbiAgbGluZXMucHVzaCgnIyMgRW5mb3JjZWQgUGF0dGVybnMgKEVTTGludCknKVxuICBsaW5lcy5wdXNoKCcnKVxuICBsaW5lcy5wdXNoKCdUaGVzZSBwYXR0ZXJucyBhcmUgZW5mb3JjZWQgYnkgYEBnYWxsb3Auc29mdHdhcmUvY2Fub24vZXNsaW50YC4gVmlvbGF0aW9ucyB3aWxsIGJlIGZsYWdnZWQuJylcbiAgbGluZXMucHVzaCgnJylcblxuICBjb25zdCBlbmZvcmNlZFBhdHRlcm5zID0gcGF0dGVybnMuZmlsdGVyKHAgPT4gcC5lbmZvcmNlbWVudCA9PT0gJ2VzbGludCcgJiYgcC5ydWxlKVxuICBmb3IgKGNvbnN0IHBhdHRlcm4gb2YgZW5mb3JjZWRQYXR0ZXJucykge1xuICAgIGxpbmVzLnB1c2goYCMjIyAke3BhdHRlcm4uaWR9OiAke3BhdHRlcm4udGl0bGV9YClcbiAgICBsaW5lcy5wdXNoKCcnKVxuICAgIGxpbmVzLnB1c2gocGF0dGVybi5zdW1tYXJ5KVxuICAgIGxpbmVzLnB1c2goJycpXG4gICAgbGluZXMucHVzaChgLSAqKkVTTGludCBSdWxlOioqIFxcYCR7cGF0dGVybi5ydWxlfVxcYGApXG4gICAgbGluZXMucHVzaChgLSAqKkNhdGVnb3J5OioqICR7cGF0dGVybi5jYXRlZ29yeX1gKVxuICAgIGxpbmVzLnB1c2goJycpXG5cbiAgICAvLyBUcnkgdG8gcmVhZCBhbmQgaW5jbHVkZSBleGFtcGxlc1xuICAgIGNvbnN0IGNvbnRlbnQgPSByZWFkUGF0dGVybkZpbGUocGF0dGVybi5maWxlKVxuICAgIGlmIChjb250ZW50KSB7XG4gICAgICBjb25zdCB7IGdvb2QsIGJhZCB9ID0gZXh0cmFjdEV4YW1wbGVzKGNvbnRlbnQpXG4gICAgICBpZiAoYmFkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgbGluZXMucHVzaCgnKipCYWQ6KionKVxuICAgICAgICBsaW5lcy5wdXNoKCcnKVxuICAgICAgICBsaW5lcy5wdXNoKGJhZFswXSlcbiAgICAgICAgbGluZXMucHVzaCgnJylcbiAgICAgIH1cbiAgICAgIGlmIChnb29kLmxlbmd0aCA+IDApIHtcbiAgICAgICAgbGluZXMucHVzaCgnKipHb29kOioqJylcbiAgICAgICAgbGluZXMucHVzaCgnJylcbiAgICAgICAgbGluZXMucHVzaChnb29kWzBdKVxuICAgICAgICBsaW5lcy5wdXNoKCcnKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIERvY3VtZW50YXRpb24gcGF0dGVybnNcbiAgbGluZXMucHVzaCgnIyMgRG9jdW1lbnRhdGlvbiBQYXR0ZXJucycpXG4gIGxpbmVzLnB1c2goJycpXG4gIGxpbmVzLnB1c2goJ1RoZXNlIHBhdHRlcm5zIGFyZSBub3QgZW5mb3JjZWQgYnkgRVNMaW50IGJ1dCBzaG91bGQgYmUgZm9sbG93ZWQuJylcbiAgbGluZXMucHVzaCgnJylcblxuICBjb25zdCBkb2NQYXR0ZXJucyA9IHBhdHRlcm5zLmZpbHRlcihwID0+IHAuZW5mb3JjZW1lbnQgPT09ICdkb2N1bWVudGF0aW9uJylcbiAgZm9yIChjb25zdCBwYXR0ZXJuIG9mIGRvY1BhdHRlcm5zKSB7XG4gICAgbGluZXMucHVzaChgIyMjICR7cGF0dGVybi5pZH06ICR7cGF0dGVybi50aXRsZX1gKVxuICAgIGxpbmVzLnB1c2goJycpXG4gICAgbGluZXMucHVzaChwYXR0ZXJuLnN1bW1hcnkpXG4gICAgbGluZXMucHVzaCgnJylcbiAgfVxuXG4gIC8vIEd1YXJhbnRlZXNcbiAgbGluZXMucHVzaCgnIyMgQ2Fub24gR3VhcmFudGVlcycpXG4gIGxpbmVzLnB1c2goJycpXG4gIGxpbmVzLnB1c2goJ0ZvbGxvd2luZyB0aGVzZSBwYXR0ZXJucyBwcm92aWRlcyB0aGVzZSBndWFyYW50ZWVzOicpXG4gIGxpbmVzLnB1c2goJycpXG5cbiAgZm9yIChjb25zdCBndWFyYW50ZWUgb2YgZ3VhcmFudGVlcykge1xuICAgIGxpbmVzLnB1c2goYC0gKioke2d1YXJhbnRlZS5uYW1lfSoqICgke2d1YXJhbnRlZS5pZH0pOiBQYXR0ZXJucyAke2d1YXJhbnRlZS5wYXR0ZXJucy5qb2luKCcsICcpfWApXG4gIH1cbiAgbGluZXMucHVzaCgnJylcblxuICAvLyBRdWljayByZWZlcmVuY2UgZm9yIGNvbXBvbmVudHNcbiAgbGluZXMucHVzaCgnIyMgQ29tcG9uZW50IFF1aWNrIFJlZmVyZW5jZScpXG4gIGxpbmVzLnB1c2goJycpXG4gIGxpbmVzLnB1c2goJyMjIyBUeXBvZ3JhcGh5JylcbiAgbGluZXMucHVzaCgnLSBgSGVhZGluZ2AgLSBwcm9wczogYGFzYCwgYGNvbG9yYCwgYG1hcmdpbmAsIGBmb250U2l6ZWAsIGBmb250V2VpZ2h0YCwgYHRleHRBbGlnbmAnKVxuICBsaW5lcy5wdXNoKCctIGBQYXJhZ3JhcGhgIC0gcHJvcHM6IGBjb2xvcmAsIGBtYXJnaW5gLCBgZm9udFNpemVgLCBgbGluZUhlaWdodGAsIGB0ZXh0QWxpZ25gJylcbiAgbGluZXMucHVzaCgnLSBgU3BhbmAgLSBwcm9wczogYGNvbG9yYCwgYG1hcmdpbmAsIGBmb250U2l6ZWAgKGlubGluZSB0ZXh0LCBtYi0wIGRlZmF1bHQpJylcbiAgbGluZXMucHVzaCgnLSBgTGFiZWxgIC0gcHJvcHM6IGBjb2xvcmAsIGBtYXJnaW5gLCBgZm9udFNpemVgLCBgZm9udFdlaWdodGAsIGB0ZXh0QWxpZ25gJylcbiAgbGluZXMucHVzaCgnLSBgUXVvdGVgIC0gcHJvcHM6IGB2YXJpYW50YCwgYGNvbG9yYCwgYG1hcmdpbmAsIGBmb250U2l6ZWAsIGBmb250V2VpZ2h0YCwgYHRleHRBbGlnbmAnKVxuICBsaW5lcy5wdXNoKCcnKVxuICBsaW5lcy5wdXNoKCcjIyMgTGF5b3V0JylcbiAgbGluZXMucHVzaCgnLSBgU2VjdGlvbmAgLSBzZW1hbnRpYyBzZWN0aW9uIHdyYXBwZXInKVxuICBsaW5lcy5wdXNoKCctIGBDb2x1bW5zYCAtIGdyaWQgbGF5b3V0LCBwcm9wczogYGNvbHNgLCBgZ2FwYCwgYGFsaWduYCcpXG4gIGxpbmVzLnB1c2goJy0gYENvbHVtbmAgLSBjb2x1bW4gY2hpbGQnKVxuICBsaW5lcy5wdXNoKCcnKVxuICBsaW5lcy5wdXNoKCcjIyMgSW50ZXJhY3RpdmUnKVxuICBsaW5lcy5wdXNoKCctIGBCdXR0b25gIC0gcHJvcHM6IGBocmVmYCwgYHZhcmlhbnRgLCBgaWNvbmAsIGBpY29uUGxhY2VtZW50YCwgYG1hcmdpbmAnKVxuICBsaW5lcy5wdXNoKCctIGBJY29uYCAtIEljb25pZnkgaWNvbiB3cmFwcGVyJylcbiAgbGluZXMucHVzaCgnJylcblxuICAvLyBEbyBOT1Qgc2VjdGlvblxuICBsaW5lcy5wdXNoKCcjIyBEbyBOT1QnKVxuICBsaW5lcy5wdXNoKCcnKVxuICBsaW5lcy5wdXNoKCctIFVzZSBgXFwndXNlIGNsaWVudFxcJ2AgaW4gYmxvY2tzIC0gZXh0cmFjdCB0byBjb21wb25lbnRzJylcbiAgbGluZXMucHVzaCgnLSBVc2UgcmF3IGA8cD5gIG9yIGA8c3Bhbj5gIC0gdXNlIFBhcmFncmFwaC9TcGFuIGNvbXBvbmVudHMnKVxuICBsaW5lcy5wdXNoKCctIFVzZSBjbGFzc05hbWUgZm9yIG1hcmdpbi9jb2xvci9mb250U2l6ZSB3aGVuIGNvbXBvbmVudCBoYXMgcHJvcHMnKVxuICBsaW5lcy5wdXNoKCctIFVzZSBDb250YWluZXIgaW5zaWRlIFNlY3Rpb24gLSBTZWN0aW9uIGFscmVhZHkgcHJvdmlkZXMgY29udGFpbm1lbnQnKVxuICBsaW5lcy5wdXNoKCctIFVzZSBgY2xhc3NuYW1lc2AgcGFja2FnZSAtIHVzZSBgY2xzeGAgaW5zdGVhZCcpXG4gIGxpbmVzLnB1c2goJy0gVXNlIGlubGluZSBzdHlsZXMgZm9yIGhvdmVyIHN0YXRlcyAtIHVzZSBUYWlsd2luZCBjbGFzc2VzJylcbiAgbGluZXMucHVzaCgnLSBVc2UgbmF0aXZlIGBJbnRlcnNlY3Rpb25PYnNlcnZlcmAgLSB1c2UgYHJlYWN0LWludGVyc2VjdGlvbi1vYnNlcnZlcmAgcGFja2FnZScpXG4gIGxpbmVzLnB1c2goJycpXG5cbiAgLy8gRmlsZSAmIEZvbGRlciBBdXRob3JpdHkgc2VjdGlvblxuICBsaW5lcy5wdXNoKCcjIyBGaWxlICYgRm9sZGVyIEF1dGhvcml0eScpXG4gIGxpbmVzLnB1c2goJycpXG4gIGxpbmVzLnB1c2goJ1RoZXNlIHJ1bGVzIGdvdmVybiB3aGF0IEFJIGlzIGFsbG93ZWQgYW5kIGZvcmJpZGRlbiB0byBkbyB3aGVuIGNyZWF0aW5nLCBtb3ZpbmcsIG9yIG1vZGlmeWluZyBmaWxlcyBhbmQgZm9sZGVycy4nKVxuICBsaW5lcy5wdXNoKCcnKVxuXG4gIGxpbmVzLnB1c2goJyMjIyBEZWZpbmVkIGAvc3JjYCBTdHJ1Y3R1cmUnKVxuICBsaW5lcy5wdXNoKCcnKVxuICBsaW5lcy5wdXNoKCdgYGAnKVxuICBsaW5lcy5wdXNoKCdzcmMvJylcbiAgbGluZXMucHVzaCgn4pSc4pSA4pSAIGFwcC8gICAgICAgICAgIyBSb3V0ZXMsIGxheW91dHMsIG1ldGFkYXRhIChOZXh0LmpzIEFwcCBSb3V0ZXIpJylcbiAgbGluZXMucHVzaCgn4pSc4pSA4pSAIGJsb2Nrcy8gICAgICAgIyBQYWdlLWxldmVsIGNvbnRlbnQgc2VjdGlvbnMnKVxuICBsaW5lcy5wdXNoKCfilJzilIDilIAgYmxvZy8gICAgICAgICAjIEJsb2cgY29udGVudCAoYXJjaGl2ZSBjb250ZW50IHR5cGUpJylcbiAgbGluZXMucHVzaCgn4pSc4pSA4pSAIGNvbXBvbmVudHMvICAgIyBSZXVzYWJsZSBVSSBwcmltaXRpdmVzJylcbiAgbGluZXMucHVzaCgn4pSc4pSA4pSAIGhvb2tzLyAgICAgICAgIyBDdXN0b20gUmVhY3QgaG9va3MnKVxuICBsaW5lcy5wdXNoKCfilJzilIDilIAgc3R5bGVzLyAgICAgICAjIENTUywgVGFpbHdpbmQsIGZvbnRzJylcbiAgbGluZXMucHVzaCgn4pSc4pSA4pSAIHRlbXBsYXRlLyAgICAgIyBUZW1wbGF0ZS1sZXZlbCBjb21wb25lbnRzJylcbiAgbGluZXMucHVzaCgn4pSc4pSA4pSAIHRvb2xzLyAgICAgICAgIyBVdGlsaXR5IHRvb2xzJylcbiAgbGluZXMucHVzaCgn4pSc4pSA4pSAIHR5cGVzLyAgICAgICAgIyBUeXBlU2NyaXB0IHR5cGVzJylcbiAgbGluZXMucHVzaCgn4pSc4pSA4pSAIHV0aWxzLyAgICAgICAgIyBVdGlsaXR5IGZ1bmN0aW9ucycpXG4gIGxpbmVzLnB1c2goJ+KUlOKUgOKUgCBzdGF0ZS50cyAgICAgICMgR2xvYmFsIHN0YXRlJylcbiAgbGluZXMucHVzaCgnYGBgJylcbiAgbGluZXMucHVzaCgnJylcblxuICBsaW5lcy5wdXNoKCcjIyMgQXBwIFJvdXRlciBTdHJ1Y3R1cmUnKVxuICBsaW5lcy5wdXNoKCcnKVxuICBsaW5lcy5wdXNoKCdSb3V0ZXMgbXVzdCB1c2UgTmV4dC5qcyByb3V0ZSBncm91cHMuIEF0IG1pbmltdW0sIGAoZGVmYXVsdClgIG11c3QgZXhpc3Q6JylcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnYGBgJylcbiAgbGluZXMucHVzaCgnc3JjL2FwcC8nKVxuICBsaW5lcy5wdXNoKCfilJzilIDilIAgKGRlZmF1bHQpLyAgICAgICAgIyBSZXF1aXJlZCAtIGRlZmF1bHQgbGF5b3V0IGdyb3VwJylcbiAgbGluZXMucHVzaCgn4pSCICAg4pSc4pSA4pSAIGxheW91dC50c3gnKVxuICBsaW5lcy5wdXNoKCfilIIgICDilJTilIDilIAge3JvdXRlc30vJylcbiAgbGluZXMucHVzaCgn4pSc4pSA4pSAIChoZXJvKS8gICAgICAgICAgICMgT3B0aW9uYWwgLSBoZXJvIGxheW91dCB2YXJpYW50JylcbiAgbGluZXMucHVzaCgn4pSc4pSA4pSAIGFwaS8gICAgICAgICAgICAgICMgQVBJIHJvdXRlcyAoZXhjZXB0aW9uIC0gbm8gZ3JvdXBpbmcpJylcbiAgbGluZXMucHVzaCgn4pSc4pSA4pSAIGxheW91dC50c3ggICAgICAgICMgUm9vdCBsYXlvdXQnKVxuICBsaW5lcy5wdXNoKCfilJTilIDilIAgbWV0YWRhdGEudHN4ICAgICAgIyBTaGFyZWQgbWV0YWRhdGEnKVxuICBsaW5lcy5wdXNoKCdgYGAnKVxuICBsaW5lcy5wdXNoKCcnKVxuICBsaW5lcy5wdXNoKCctIEFsbCBwYWdlIHJvdXRlcyBtdXN0IGJlIGluc2lkZSBhIHJvdXRlIGdyb3VwIChwYXJlbnRoZXNlcyBmb2xkZXIpJylcbiAgbGluZXMucHVzaCgnLSBOZXZlciBjcmVhdGUgcm91dGVzIGRpcmVjdGx5IHVuZGVyIGBzcmMvYXBwL2AgKGV4Y2VwdCBgYXBpL2AsIHJvb3QgZmlsZXMpJylcbiAgbGluZXMucHVzaCgnLSBOZXcgcm91dGUgZ3JvdXBzIGFyZSBhbGxvd2VkIGZyZWVseSB3aGVuIGEgbmV3IGxheW91dCB2YXJpYW50IGlzIG5lZWRlZCcpXG4gIGxpbmVzLnB1c2goJycpXG5cbiAgbGluZXMucHVzaCgnIyMjIEZpbGUgU3RydWN0dXJlIFJ1bGVzJylcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnKipCbG9ja3M6KionKVxuICBsaW5lcy5wdXNoKCctIEFsd2F5cyBzaW5nbGUgZmlsZXMgZGlyZWN0bHkgaW4gYHNyYy9ibG9ja3MvYCcpXG4gIGxpbmVzLnB1c2goJy0gTmV2ZXIgY3JlYXRlIGZvbGRlcnMgaW5zaWRlIGBzcmMvYmxvY2tzL2AnKVxuICBsaW5lcy5wdXNoKCctIEV4YW1wbGU6IGBzcmMvYmxvY2tzL2hlcm8tMS50c3hgLCBgc3JjL2Jsb2Nrcy90ZXN0aW1vbmlhbC0zLnRzeGAnKVxuICBsaW5lcy5wdXNoKCcnKVxuICBsaW5lcy5wdXNoKCcqKkNvbXBvbmVudHM6KionKVxuICBsaW5lcy5wdXNoKCctIFNpbXBsZSBjb21wb25lbnRzOiBTaW5nbGUgZmlsZSBpbiBgc3JjL2NvbXBvbmVudHMvYCcpXG4gIGxpbmVzLnB1c2goJy0gQ29tcGxleCBjb21wb25lbnRzOiBGb2xkZXIgd2l0aCBgaW5kZXgudHN4YCcpXG4gIGxpbmVzLnB1c2goJy0gVXNlIGZvbGRlcnMgd2hlbiBjb21wb25lbnQgaGFzIG11bHRpcGxlIHN1Yi1maWxlcycpXG4gIGxpbmVzLnB1c2goJycpXG5cbiAgbGluZXMucHVzaCgnIyMjIERPIC0gV2hhdCBBSSBJUyBBbGxvd2VkIFRvIERvJylcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnLSBDcmVhdGUgZmlsZXMgb25seSBpbnNpZGUgZXhpc3RpbmcgQ2Fub24tZGVmaW5lZCB6b25lcycpXG4gIGxpbmVzLnB1c2goJy0gUGxhY2UgbmV3IGZpbGVzIGluIHRoZSB6b25lIHRoYXQgbWF0Y2hlcyB0aGVpciBhcmNoaXRlY3R1cmFsIHJvbGUnKVxuICBsaW5lcy5wdXNoKCctIEZvbGxvdyBleGlzdGluZyBmb2xkZXIgY29udmVudGlvbnMgd2l0aGluIGEgem9uZScpXG4gIGxpbmVzLnB1c2goJy0gUmV1c2UgZXhpc3RpbmcgZm9sZGVycyB3aGVuIHBvc3NpYmxlJylcbiAgbGluZXMucHVzaCgnLSBDcmVhdGUgbmV3IHJvdXRlIGdyb3VwcyBpbiBgc3JjL2FwcC9gIHdoZW4gbmV3IGxheW91dHMgYXJlIG5lZWRlZCcpXG4gIGxpbmVzLnB1c2goJy0gQ3JlYXRlIG5ldyBhcmNoaXZlIGNvbnRlbnQgZm9sZGVycyAobGlrZSBgYmxvZy9gLCBgcG9ydGZvbGlvL2ApIGluIGAvc3JjYCcpXG4gIGxpbmVzLnB1c2goJy0gQ3JlYXRlIGRvdGZpbGVzL2RpcmVjdG9yaWVzIGF0IHByb2plY3Qgcm9vdCAoYC5naXRodWIvYCwgYC5jdXJzb3IvYCwgZXRjLiknKVxuICBsaW5lcy5wdXNoKCctIEFzayBmb3IgY29uZmlybWF0aW9uIGlmIHRoZSBjb3JyZWN0IHpvbmUgaXMgYW1iaWd1b3VzJylcbiAgbGluZXMucHVzaCgnJylcblxuICBsaW5lcy5wdXNoKCcjIyMgRE8gTk9UIC0gV2hhdCBBSSBJcyBGb3JiaWRkZW4gVG8gRG8nKVxuICBsaW5lcy5wdXNoKCcnKVxuICBsaW5lcy5wdXNoKCctIENyZWF0ZSBuZXcgdG9wLWxldmVsIGRpcmVjdG9yaWVzIChleGNlcHQgZG90ZmlsZXMpJylcbiAgbGluZXMucHVzaCgnLSBDcmVhdGUgbmV3IGZvbGRlcnMgaW4gYC9zcmNgIChleGNlcHQgYXJjaGl2ZSBjb250ZW50IG9yIHJvdXRlIGdyb3VwcyknKVxuICBsaW5lcy5wdXNoKCctIFBsYWNlIGZpbGVzIG91dHNpZGUgQ2Fub24tZGVmaW5lZCB6b25lcycpXG4gIGxpbmVzLnB1c2goJy0gTWl4IHJlc3BvbnNpYmlsaXRpZXMgYWNyb3NzIHpvbmVzIChjb21wb25lbnRzIGltcG9ydGluZyBibG9ja3MsIGV0Yy4pJylcbiAgbGluZXMucHVzaCgnLSBSZW9yZ2FuaXplIG9yIG1vdmUgZm9sZGVycyB3aXRob3V0IGV4cGxpY2l0IGluc3RydWN0aW9uJylcbiAgbGluZXMucHVzaCgnLSBJbnZlbnQgbmV3IG9yZ2FuaXphdGlvbmFsIGNvbnZlbnRpb25zJylcbiAgbGluZXMucHVzaCgnLSBDcmVhdGUgcGxhY2Vob2xkZXIgb3Igc3BlY3VsYXRpdmUgZmlsZXMnKVxuICBsaW5lcy5wdXNoKCctIEltcG9ydCBmcm9tIGBfc2NyaXB0cy9gIG9yIGBfZGF0YS9gIGluIHJ1bnRpbWUgY29kZScpXG4gIGxpbmVzLnB1c2goJy0gTWFudWFsbHkgZWRpdCBmaWxlcyBpbiBgX2RhdGEvYCAoZ2VuZXJhdGVkIG9ubHkpJylcbiAgbGluZXMucHVzaCgnJylcblxuICAvLyBQb3N0LWVkaXQgdmVyaWZpY2F0aW9uXG4gIGxpbmVzLnB1c2goJyMjIFBvc3QtRWRpdCBWZXJpZmljYXRpb24nKVxuICBsaW5lcy5wdXNoKCcnKVxuICBsaW5lcy5wdXNoKCdBZnRlciBlZGl0aW5nIGZpbGVzOicpXG4gIGxpbmVzLnB1c2goJzEuIFJ1biBgbnBtIHJ1biBsaW50YCB0byBjaGVjayBmb3IgZXJyb3JzJylcbiAgbGluZXMucHVzaCgnMi4gRml4IGFueSB2aW9sYXRpb25zIGJlZm9yZSBjb21taXR0aW5nJylcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnTm90ZTogT25seSBsaW50IGZpbGVzIHlvdSBlZGl0ZWQsIG5vdCB0aGUgZW50aXJlIGNvZGViYXNlLicpXG4gIGxpbmVzLnB1c2goJycpXG5cbiAgcmV0dXJuIGxpbmVzLmpvaW4oJ1xcbicpXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZW5lcmF0ZShvcHRpb25zOiBHZW5lcmF0ZU9wdGlvbnMpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgY29udGVudCA9IGdlbmVyYXRlQ3Vyc29ycnVsZXMoKVxuXG4gIGlmIChvcHRpb25zLm91dHB1dCA9PT0gJy0nKSB7XG4gICAgLy8gT3V0cHV0IHRvIHN0ZG91dFxuICAgIGNvbnNvbGUubG9nKGNvbnRlbnQpXG4gIH0gZWxzZSB7XG4gICAgLy8gV3JpdGUgdG8gZmlsZVxuICAgIGNvbnN0IG91dHB1dFBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgb3B0aW9ucy5vdXRwdXQpXG4gICAgZnMud3JpdGVGaWxlU3luYyhvdXRwdXRQYXRoLCBjb250ZW50LCAndXRmLTgnKVxuICAgIGNvbnNvbGUubG9nKGDinJMgR2VuZXJhdGVkICR7b3B0aW9ucy5vdXRwdXR9IGZyb20gQ2Fub24gdiR7dmVyc2lvbn1gKVxuICAgIGNvbnNvbGUubG9nKGAgICR7cGF0dGVybnMubGVuZ3RofSBwYXR0ZXJucywgJHtndWFyYW50ZWVzLmxlbmd0aH0gZ3VhcmFudGVlc2ApXG4gIH1cbn1cbiJdfQ==