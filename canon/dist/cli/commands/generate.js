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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2xpL2NvbW1hbmRzL2dlbmVyYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxFQUFFLE1BQU0sSUFBSSxDQUFBO0FBQ3hCLE9BQU8sS0FBSyxJQUFJLE1BQU0sTUFBTSxDQUFBO0FBQzVCLE9BQU8sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFjLFVBQVUsRUFBRSxNQUFNLGdCQUFnQixDQUFBO0FBTzFFOztHQUVHO0FBQ0gsU0FBUyxlQUFlLENBQUMsV0FBbUI7SUFDMUMsbURBQW1EO0lBQ25ELE1BQU0sYUFBYSxHQUFHO1FBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLHFDQUFxQyxFQUFFLFdBQVcsQ0FBQztRQUM1RSwyQkFBMkI7UUFDM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsV0FBVyxDQUFDO0tBQ3pELENBQUE7SUFFRCxLQUFLLE1BQU0sUUFBUSxJQUFJLGFBQWEsRUFBRSxDQUFDO1FBQ3JDLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1lBQzVCLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFDM0MsQ0FBQztJQUNILENBQUM7SUFFRCxPQUFPLElBQUksQ0FBQTtBQUNiLENBQUM7QUFFRDs7R0FFRztBQUNILFNBQVMsZUFBZSxDQUFDLE9BQWU7SUFDdEMsTUFBTSxJQUFJLEdBQWEsRUFBRSxDQUFBO0lBQ3pCLE1BQU0sR0FBRyxHQUFhLEVBQUUsQ0FBQTtJQUV4Qix5REFBeUQ7SUFDekQsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFBO0lBQy9ELE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FB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LENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3pCLENBQUM7QUFFRCxNQUFNLENBQUMsS0FBSyxVQUFVLFFBQVEsQ0FBQyxPQUF3QjtJQUNyRCxNQUFNLE9BQU8sR0FBRyxtQkFBbUIsRUFBRSxDQUFBO0lBRXJDLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUMzQixtQkFBbUI7UUFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUN0QixDQUFDO1NBQU0sQ0FBQztRQUNOLGdCQUFnQjtRQUNoQixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDOUQsRUFBRSxDQUFDLGFBQWEsQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBQzlDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxPQUFPLENBQUMsTUFBTSxnQkFBZ0IsT0FBTyxFQUFFLENBQUMsQ0FBQTtRQUNuRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssUUFBUSxDQUFDLE1BQU0sY0FBYyxVQUFVLENBQUMsTUFBTSxhQUFhLENBQUMsQ0FBQTtJQUMvRSxDQUFDO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJ1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgdmVyc2lvbiwgcGF0dGVybnMsIGNhdGVnb3JpZXMsIGd1YXJhbnRlZXMgfSBmcm9tICcuLi8uLi9pbmRleC5qcydcblxuaW50ZXJmYWNlIEdlbmVyYXRlT3B0aW9ucyB7XG4gIG91dHB1dDogc3RyaW5nXG4gIGZvcm1hdDogJ2N1cnNvcnJ1bGVzJyB8ICdtYXJrZG93bidcbn1cblxuLyoqXG4gKiBSZWFkIGEgcGF0dGVybiBtYXJrZG93biBmaWxlIGFuZCBleHRyYWN0IHNlY3Rpb25zXG4gKi9cbmZ1bmN0aW9uIHJlYWRQYXR0ZXJuRmlsZShwYXR0ZXJuRmlsZTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gIC8vIFRyeSB0byBmaW5kIHRoZSBjYW5vbiBwYWNrYWdlIHBhdHRlcm5zIGRpcmVjdG9yeVxuICBjb25zdCBwb3NzaWJsZVBhdGhzID0gW1xuICAgIHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnbm9kZV9tb2R1bGVzL0BnYWxsb3Auc29mdHdhcmUvY2Fub24nLCBwYXR0ZXJuRmlsZSksXG4gICAgLy8gRmFsbGJhY2sgZm9yIGRldmVsb3BtZW50XG4gICAgcGF0aC5qb2luKGltcG9ydC5tZXRhLmRpcm5hbWUsICcuLi8uLi8uLi8nLCBwYXR0ZXJuRmlsZSksXG4gIF1cblxuICBmb3IgKGNvbnN0IGZpbGVQYXRoIG9mIHBvc3NpYmxlUGF0aHMpIHtcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhmaWxlUGF0aCkpIHtcbiAgICAgIHJldHVybiBmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgsICd1dGYtOCcpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGxcbn1cblxuLyoqXG4gKiBFeHRyYWN0IGV4YW1wbGVzIGZyb20gcGF0dGVybiBtYXJrZG93blxuICovXG5mdW5jdGlvbiBleHRyYWN0RXhhbXBsZXMoY29udGVudDogc3RyaW5nKTogeyBnb29kOiBzdHJpbmdbXTsgYmFkOiBzdHJpbmdbXSB9IHtcbiAgY29uc3QgZ29vZDogc3RyaW5nW10gPSBbXVxuICBjb25zdCBiYWQ6IHN0cmluZ1tdID0gW11cblxuICAvLyBGaW5kIGNvZGUgYmxvY2tzIGFmdGVyIFwiIyMjIEdvb2RcIiBvciBcIiMjIyBCYWRcIiBoZWFkZXJzXG4gIGNvbnN0IGdvb2RNYXRjaCA9IGNvbnRlbnQubWF0Y2goLyMjIyBHb29kXFxzKlxcbmBgYFtcXHNcXFNdKj9gYGAvZylcbiAgY29uc3QgYmFkTWF0Y2ggPSBjb250ZW50Lm1hdGNoKC8jIyMgQmFkXFxzKlxcbmBgYFtcXHNcXFNdKj9gYGAvZylcblxuICBpZiAoZ29vZE1hdGNoKSB7XG4gICAgZm9yIChjb25zdCBtYXRjaCBvZiBnb29kTWF0Y2gpIHtcbiAgICAgIGNvbnN0IGNvZGUgPSBtYXRjaC5yZXBsYWNlKC8jIyMgR29vZFxccypcXG4vLCAnJykudHJpbSgpXG4gICAgICBnb29kLnB1c2goY29kZSlcbiAgICB9XG4gIH1cblxuICBpZiAoYmFkTWF0Y2gpIHtcbiAgICBmb3IgKGNvbnN0IG1hdGNoIG9mIGJhZE1hdGNoKSB7XG4gICAgICBjb25zdCBjb2RlID0gbWF0Y2gucmVwbGFjZSgvIyMjIEJhZFxccypcXG4vLCAnJykudHJpbSgpXG4gICAgICBiYWQucHVzaChjb2RlKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7IGdvb2QsIGJhZCB9XG59XG5cbi8qKlxuICogR2VuZXJhdGUgLmN1cnNvcnJ1bGVzIGNvbnRlbnQgZnJvbSBDYW5vblxuICovXG5mdW5jdGlvbiBnZW5lcmF0ZUN1cnNvcnJ1bGVzKCk6IHN0cmluZyB7XG4gIGNvbnN0IGxpbmVzOiBzdHJpbmdbXSA9IFtdXG5cbiAgLy8gSGVhZGVyXG4gIGxpbmVzLnB1c2goYCMgR2FsbG9wIENhbm9uIHYke3ZlcnNpb259IC0gQUkgUnVsZXNgKVxuICBsaW5lcy5wdXNoKCcnKVxuICBsaW5lcy5wdXNoKCdUaGlzIGZpbGUgaXMgYXV0by1nZW5lcmF0ZWQgZnJvbSBAZ2FsbG9wLnNvZnR3YXJlL2Nhbm9uLiBEbyBub3QgZWRpdCBtYW51YWxseS4nKVxuICBsaW5lcy5wdXNoKCdSZWdlbmVyYXRlIHdpdGg6IG5wbSBydW4gZ2VuZXJhdGU6YWktcnVsZXMnKVxuICBsaW5lcy5wdXNoKCcnKVxuXG4gIC8vIFRlY2ggc3RhY2sgKENhbm9uLWNvbXBhdGlibGUgdGVtcGxhdGVzKVxuICBsaW5lcy5wdXNoKCcjIyBUZWNoIFN0YWNrJylcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnLSBOZXh0LmpzIDE2IHdpdGggQXBwIFJvdXRlcicpXG4gIGxpbmVzLnB1c2goJy0gUmVhY3QgMTknKVxuICBsaW5lcy5wdXNoKCctIFR5cGVTY3JpcHQnKVxuICBsaW5lcy5wdXNoKCctIFRhaWx3aW5kIENTUyB2NCcpXG4gIGxpbmVzLnB1c2goJy0gY2xzeCBmb3IgY29uZGl0aW9uYWwgY2xhc3MgbmFtZXMnKVxuICBsaW5lcy5wdXNoKCcnKVxuXG4gIC8vIEVuZm9yY2VkIHBhdHRlcm5zIChFU0xpbnQgcnVsZXMpXG4gIGxpbmVzLnB1c2goJyMjIEVuZm9yY2VkIFBhdHRlcm5zIChFU0xpbnQpJylcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnVGhlc2UgcGF0dGVybnMgYXJlIGVuZm9yY2VkIGJ5IGBAZ2FsbG9wLnNvZnR3YXJlL2Nhbm9uL2VzbGludGAuIFZpb2xhdGlvbnMgd2lsbCBiZSBmbGFnZ2VkLicpXG4gIGxpbmVzLnB1c2goJycpXG5cbiAgY29uc3QgZW5mb3JjZWRQYXR0ZXJucyA9IHBhdHRlcm5zLmZpbHRlcihwID0+IHAuZW5mb3JjZW1lbnQgPT09ICdlc2xpbnQnICYmIHAucnVsZSlcbiAgZm9yIChjb25zdCBwYXR0ZXJuIG9mIGVuZm9yY2VkUGF0dGVybnMpIHtcbiAgICBsaW5lcy5wdXNoKGAjIyMgJHtwYXR0ZXJuLmlkfTogJHtwYXR0ZXJuLnRpdGxlfWApXG4gICAgbGluZXMucHVzaCgnJylcbiAgICBsaW5lcy5wdXNoKHBhdHRlcm4uc3VtbWFyeSlcbiAgICBsaW5lcy5wdXNoKCcnKVxuICAgIGxpbmVzLnB1c2goYC0gKipFU0xpbnQgUnVsZToqKiBcXGAke3BhdHRlcm4ucnVsZX1cXGBgKVxuICAgIGxpbmVzLnB1c2goYC0gKipDYXRlZ29yeToqKiAke3BhdHRlcm4uY2F0ZWdvcnl9YClcbiAgICBsaW5lcy5wdXNoKCcnKVxuXG4gICAgLy8gVHJ5IHRvIHJlYWQgYW5kIGluY2x1ZGUgZXhhbXBsZXNcbiAgICBjb25zdCBjb250ZW50ID0gcmVhZFBhdHRlcm5GaWxlKHBhdHRlcm4uZmlsZSlcbiAgICBpZiAoY29udGVudCkge1xuICAgICAgY29uc3QgeyBnb29kLCBiYWQgfSA9IGV4dHJhY3RFeGFtcGxlcyhjb250ZW50KVxuICAgICAgaWYgKGJhZC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGxpbmVzLnB1c2goJyoqQmFkOioqJylcbiAgICAgICAgbGluZXMucHVzaCgnJylcbiAgICAgICAgbGluZXMucHVzaChiYWRbMF0pXG4gICAgICAgIGxpbmVzLnB1c2goJycpXG4gICAgICB9XG4gICAgICBpZiAoZ29vZC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGxpbmVzLnB1c2goJyoqR29vZDoqKicpXG4gICAgICAgIGxpbmVzLnB1c2goJycpXG4gICAgICAgIGxpbmVzLnB1c2goZ29vZFswXSlcbiAgICAgICAgbGluZXMucHVzaCgnJylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBEb2N1bWVudGF0aW9uIHBhdHRlcm5zXG4gIGxpbmVzLnB1c2goJyMjIERvY3VtZW50YXRpb24gUGF0dGVybnMnKVxuICBsaW5lcy5wdXNoKCcnKVxuICBsaW5lcy5wdXNoKCdUaGVzZSBwYXR0ZXJucyBhcmUgbm90IGVuZm9yY2VkIGJ5IEVTTGludCBidXQgc2hvdWxkIGJlIGZvbGxvd2VkLicpXG4gIGxpbmVzLnB1c2goJycpXG5cbiAgY29uc3QgZG9jUGF0dGVybnMgPSBwYXR0ZXJucy5maWx0ZXIocCA9PiBwLmVuZm9yY2VtZW50ID09PSAnZG9jdW1lbnRhdGlvbicpXG4gIGZvciAoY29uc3QgcGF0dGVybiBvZiBkb2NQYXR0ZXJucykge1xuICAgIGxpbmVzLnB1c2goYCMjIyAke3BhdHRlcm4uaWR9OiAke3BhdHRlcm4udGl0bGV9YClcbiAgICBsaW5lcy5wdXNoKCcnKVxuICAgIGxpbmVzLnB1c2gocGF0dGVybi5zdW1tYXJ5KVxuICAgIGxpbmVzLnB1c2goJycpXG4gIH1cblxuICAvLyBHdWFyYW50ZWVzXG4gIGxpbmVzLnB1c2goJyMjIENhbm9uIEd1YXJhbnRlZXMnKVxuICBsaW5lcy5wdXNoKCcnKVxuICBsaW5lcy5wdXNoKCdGb2xsb3dpbmcgdGhlc2UgcGF0dGVybnMgcHJvdmlkZXMgdGhlc2UgZ3VhcmFudGVlczonKVxuICBsaW5lcy5wdXNoKCcnKVxuXG4gIGZvciAoY29uc3QgZ3VhcmFudGVlIG9mIGd1YXJhbnRlZXMpIHtcbiAgICBsaW5lcy5wdXNoKGAtICoqJHtndWFyYW50ZWUubmFtZX0qKiAoJHtndWFyYW50ZWUuaWR9KTogUGF0dGVybnMgJHtndWFyYW50ZWUucGF0dGVybnMuam9pbignLCAnKX1gKVxuICB9XG4gIGxpbmVzLnB1c2goJycpXG5cbiAgLy8gUXVpY2sgcmVmZXJlbmNlIGZvciBjb21wb25lbnRzXG4gIGxpbmVzLnB1c2goJyMjIENvbXBvbmVudCBRdWljayBSZWZlcmVuY2UnKVxuICBsaW5lcy5wdXNoKCcnKVxuICBsaW5lcy5wdXNoKCcjIyMgVHlwb2dyYXBoeScpXG4gIGxpbmVzLnB1c2goJy0gYEhlYWRpbmdgIC0gcHJvcHM6IGBhc2AsIGBjb2xvcmAsIGBtYXJnaW5gLCBgZm9udFNpemVgLCBgZm9udFdlaWdodGAsIGB0ZXh0QWxpZ25gJylcbiAgbGluZXMucHVzaCgnLSBgUGFyYWdyYXBoYCAtIHByb3BzOiBgY29sb3JgLCBgbWFyZ2luYCwgYGZvbnRTaXplYCwgYGxpbmVIZWlnaHRgLCBgdGV4dEFsaWduYCcpXG4gIGxpbmVzLnB1c2goJy0gYFNwYW5gIC0gcHJvcHM6IGBjb2xvcmAsIGBtYXJnaW5gLCBgZm9udFNpemVgIChpbmxpbmUgdGV4dCwgbWItMCBkZWZhdWx0KScpXG4gIGxpbmVzLnB1c2goJy0gYExhYmVsYCAtIHByb3BzOiBgY29sb3JgLCBgbWFyZ2luYCwgYGZvbnRTaXplYCwgYGZvbnRXZWlnaHRgLCBgdGV4dEFsaWduYCcpXG4gIGxpbmVzLnB1c2goJycpXG4gIGxpbmVzLnB1c2goJyMjIyBMYXlvdXQnKVxuICBsaW5lcy5wdXNoKCctIGBTZWN0aW9uYCAtIHNlbWFudGljIHNlY3Rpb24gd3JhcHBlcicpXG4gIGxpbmVzLnB1c2goJy0gYENvbHVtbnNgIC0gZ3JpZCBsYXlvdXQsIHByb3BzOiBgY29sc2AsIGBnYXBgLCBgYWxpZ25gJylcbiAgbGluZXMucHVzaCgnLSBgQ29sdW1uYCAtIGNvbHVtbiBjaGlsZCcpXG4gIGxpbmVzLnB1c2goJycpXG4gIGxpbmVzLnB1c2goJyMjIyBJbnRlcmFjdGl2ZScpXG4gIGxpbmVzLnB1c2goJy0gYEJ1dHRvbmAgLSBwcm9wczogYGhyZWZgLCBgdmFyaWFudGAsIGBpY29uYCwgYGljb25QbGFjZW1lbnRgLCBgbWFyZ2luYCcpXG4gIGxpbmVzLnB1c2goJy0gYEljb25gIC0gSWNvbmlmeSBpY29uIHdyYXBwZXInKVxuICBsaW5lcy5wdXNoKCcnKVxuXG4gIC8vIERvIE5PVCBzZWN0aW9uXG4gIGxpbmVzLnB1c2goJyMjIERvIE5PVCcpXG4gIGxpbmVzLnB1c2goJycpXG4gIGxpbmVzLnB1c2goJy0gVXNlIGBcXCd1c2UgY2xpZW50XFwnYCBpbiBibG9ja3MgLSBleHRyYWN0IHRvIGNvbXBvbmVudHMnKVxuICBsaW5lcy5wdXNoKCctIFVzZSByYXcgYDxwPmAgb3IgYDxzcGFuPmAgLSB1c2UgUGFyYWdyYXBoL1NwYW4gY29tcG9uZW50cycpXG4gIGxpbmVzLnB1c2goJy0gVXNlIGNsYXNzTmFtZSBmb3IgbWFyZ2luL2NvbG9yL2ZvbnRTaXplIHdoZW4gY29tcG9uZW50IGhhcyBwcm9wcycpXG4gIGxpbmVzLnB1c2goJy0gVXNlIENvbnRhaW5lciBpbnNpZGUgU2VjdGlvbiAtIFNlY3Rpb24gYWxyZWFkeSBwcm92aWRlcyBjb250YWlubWVudCcpXG4gIGxpbmVzLnB1c2goJy0gVXNlIGBjbGFzc25hbWVzYCBwYWNrYWdlIC0gdXNlIGBjbHN4YCBpbnN0ZWFkJylcbiAgbGluZXMucHVzaCgnLSBVc2UgaW5saW5lIHN0eWxlcyBmb3IgaG92ZXIgc3RhdGVzIC0gdXNlIFRhaWx3aW5kIGNsYXNzZXMnKVxuICBsaW5lcy5wdXNoKCcnKVxuXG4gIC8vIEZpbGUgJiBGb2xkZXIgQXV0aG9yaXR5IHNlY3Rpb25cbiAgbGluZXMucHVzaCgnIyMgRmlsZSAmIEZvbGRlciBBdXRob3JpdHknKVxuICBsaW5lcy5wdXNoKCcnKVxuICBsaW5lcy5wdXNoKCdUaGVzZSBydWxlcyBnb3Zlcm4gd2hhdCBBSSBpcyBhbGxvd2VkIGFuZCBmb3JiaWRkZW4gdG8gZG8gd2hlbiBjcmVhdGluZywgbW92aW5nLCBvciBtb2RpZnlpbmcgZmlsZXMgYW5kIGZvbGRlcnMuJylcbiAgbGluZXMucHVzaCgnJylcblxuICBsaW5lcy5wdXNoKCcjIyMgRGVmaW5lZCBgL3NyY2AgU3RydWN0dXJlJylcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnYGBgJylcbiAgbGluZXMucHVzaCgnc3JjLycpXG4gIGxpbmVzLnB1c2goJ+KUnOKUgOKUgCBhcHAvICAgICAgICAgICMgUm91dGVzLCBsYXlvdXRzLCBtZXRhZGF0YSAoTmV4dC5qcyBBcHAgUm91dGVyKScpXG4gIGxpbmVzLnB1c2goJ+KUnOKUgOKUgCBibG9ja3MvICAgICAgICMgUGFnZS1sZXZlbCBjb250ZW50IHNlY3Rpb25zJylcbiAgbGluZXMucHVzaCgn4pSc4pSA4pSAIGJsb2cvICAgICAgICAgIyBCbG9nIGNvbnRlbnQgKGFyY2hpdmUgY29udGVudCB0eXBlKScpXG4gIGxpbmVzLnB1c2goJ+KUnOKUgOKUgCBjb21wb25lbnRzLyAgICMgUmV1c2FibGUgVUkgcHJpbWl0aXZlcycpXG4gIGxpbmVzLnB1c2goJ+KUnOKUgOKUgCBob29rcy8gICAgICAgICMgQ3VzdG9tIFJlYWN0IGhvb2tzJylcbiAgbGluZXMucHVzaCgn4pSc4pSA4pSAIHN0eWxlcy8gICAgICAgIyBDU1MsIFRhaWx3aW5kLCBmb250cycpXG4gIGxpbmVzLnB1c2goJ+KUnOKUgOKUgCB0ZW1wbGF0ZS8gICAgICMgVGVtcGxhdGUtbGV2ZWwgY29tcG9uZW50cycpXG4gIGxpbmVzLnB1c2goJ+KUnOKUgOKUgCB0b29scy8gICAgICAgICMgVXRpbGl0eSB0b29scycpXG4gIGxpbmVzLnB1c2goJ+KUnOKUgOKUgCB0eXBlcy8gICAgICAgICMgVHlwZVNjcmlwdCB0eXBlcycpXG4gIGxpbmVzLnB1c2goJ+KUnOKUgOKUgCB1dGlscy8gICAgICAgICMgVXRpbGl0eSBmdW5jdGlvbnMnKVxuICBsaW5lcy5wdXNoKCfilJTilIDilIAgc3RhdGUudHMgICAgICAjIEdsb2JhbCBzdGF0ZScpXG4gIGxpbmVzLnB1c2goJ2BgYCcpXG4gIGxpbmVzLnB1c2goJycpXG5cbiAgbGluZXMucHVzaCgnIyMjIEFwcCBSb3V0ZXIgU3RydWN0dXJlJylcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnUm91dGVzIG11c3QgdXNlIE5leHQuanMgcm91dGUgZ3JvdXBzLiBBdCBtaW5pbXVtLCBgKGRlZmF1bHQpYCBtdXN0IGV4aXN0OicpXG4gIGxpbmVzLnB1c2goJycpXG4gIGxpbmVzLnB1c2goJ2BgYCcpXG4gIGxpbmVzLnB1c2goJ3NyYy9hcHAvJylcbiAgbGluZXMucHVzaCgn4pSc4pSA4pSAIChkZWZhdWx0KS8gICAgICAgICMgUmVxdWlyZWQgLSBkZWZhdWx0IGxheW91dCBncm91cCcpXG4gIGxpbmVzLnB1c2goJ+KUgiAgIOKUnOKUgOKUgCBsYXlvdXQudHN4JylcbiAgbGluZXMucHVzaCgn4pSCICAg4pSU4pSA4pSAIHtyb3V0ZXN9LycpXG4gIGxpbmVzLnB1c2goJ+KUnOKUgOKUgCAoaGVybykvICAgICAgICAgICAjIE9wdGlvbmFsIC0gaGVybyBsYXlvdXQgdmFyaWFudCcpXG4gIGxpbmVzLnB1c2goJ+KUnOKUgOKUgCBhcGkvICAgICAgICAgICAgICAjIEFQSSByb3V0ZXMgKGV4Y2VwdGlvbiAtIG5vIGdyb3VwaW5nKScpXG4gIGxpbmVzLnB1c2goJ+KUnOKUgOKUgCBsYXlvdXQudHN4ICAgICAgICAjIFJvb3QgbGF5b3V0JylcbiAgbGluZXMucHVzaCgn4pSU4pSA4pSAIG1ldGFkYXRhLnRzeCAgICAgICMgU2hhcmVkIG1ldGFkYXRhJylcbiAgbGluZXMucHVzaCgnYGBgJylcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnLSBBbGwgcGFnZSByb3V0ZXMgbXVzdCBiZSBpbnNpZGUgYSByb3V0ZSBncm91cCAocGFyZW50aGVzZXMgZm9sZGVyKScpXG4gIGxpbmVzLnB1c2goJy0gTmV2ZXIgY3JlYXRlIHJvdXRlcyBkaXJlY3RseSB1bmRlciBgc3JjL2FwcC9gIChleGNlcHQgYGFwaS9gLCByb290IGZpbGVzKScpXG4gIGxpbmVzLnB1c2goJy0gTmV3IHJvdXRlIGdyb3VwcyBhcmUgYWxsb3dlZCBmcmVlbHkgd2hlbiBhIG5ldyBsYXlvdXQgdmFyaWFudCBpcyBuZWVkZWQnKVxuICBsaW5lcy5wdXNoKCcnKVxuXG4gIGxpbmVzLnB1c2goJyMjIyBGaWxlIFN0cnVjdHVyZSBSdWxlcycpXG4gIGxpbmVzLnB1c2goJycpXG4gIGxpbmVzLnB1c2goJyoqQmxvY2tzOioqJylcbiAgbGluZXMucHVzaCgnLSBBbHdheXMgc2luZ2xlIGZpbGVzIGRpcmVjdGx5IGluIGBzcmMvYmxvY2tzL2AnKVxuICBsaW5lcy5wdXNoKCctIE5ldmVyIGNyZWF0ZSBmb2xkZXJzIGluc2lkZSBgc3JjL2Jsb2Nrcy9gJylcbiAgbGluZXMucHVzaCgnLSBFeGFtcGxlOiBgc3JjL2Jsb2Nrcy9oZXJvLTEudHN4YCwgYHNyYy9ibG9ja3MvdGVzdGltb25pYWwtMy50c3hgJylcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnKipDb21wb25lbnRzOioqJylcbiAgbGluZXMucHVzaCgnLSBTaW1wbGUgY29tcG9uZW50czogU2luZ2xlIGZpbGUgaW4gYHNyYy9jb21wb25lbnRzL2AnKVxuICBsaW5lcy5wdXNoKCctIENvbXBsZXggY29tcG9uZW50czogRm9sZGVyIHdpdGggYGluZGV4LnRzeGAnKVxuICBsaW5lcy5wdXNoKCctIFVzZSBmb2xkZXJzIHdoZW4gY29tcG9uZW50IGhhcyBtdWx0aXBsZSBzdWItZmlsZXMnKVxuICBsaW5lcy5wdXNoKCcnKVxuXG4gIGxpbmVzLnB1c2goJyMjIyBETyAtIFdoYXQgQUkgSVMgQWxsb3dlZCBUbyBEbycpXG4gIGxpbmVzLnB1c2goJycpXG4gIGxpbmVzLnB1c2goJy0gQ3JlYXRlIGZpbGVzIG9ubHkgaW5zaWRlIGV4aXN0aW5nIENhbm9uLWRlZmluZWQgem9uZXMnKVxuICBsaW5lcy5wdXNoKCctIFBsYWNlIG5ldyBmaWxlcyBpbiB0aGUgem9uZSB0aGF0IG1hdGNoZXMgdGhlaXIgYXJjaGl0ZWN0dXJhbCByb2xlJylcbiAgbGluZXMucHVzaCgnLSBGb2xsb3cgZXhpc3RpbmcgZm9sZGVyIGNvbnZlbnRpb25zIHdpdGhpbiBhIHpvbmUnKVxuICBsaW5lcy5wdXNoKCctIFJldXNlIGV4aXN0aW5nIGZvbGRlcnMgd2hlbiBwb3NzaWJsZScpXG4gIGxpbmVzLnB1c2goJy0gQ3JlYXRlIG5ldyByb3V0ZSBncm91cHMgaW4gYHNyYy9hcHAvYCB3aGVuIG5ldyBsYXlvdXRzIGFyZSBuZWVkZWQnKVxuICBsaW5lcy5wdXNoKCctIENyZWF0ZSBuZXcgYXJjaGl2ZSBjb250ZW50IGZvbGRlcnMgKGxpa2UgYGJsb2cvYCwgYHBvcnRmb2xpby9gKSBpbiBgL3NyY2AnKVxuICBsaW5lcy5wdXNoKCctIENyZWF0ZSBkb3RmaWxlcy9kaXJlY3RvcmllcyBhdCBwcm9qZWN0IHJvb3QgKGAuZ2l0aHViL2AsIGAuY3Vyc29yL2AsIGV0Yy4pJylcbiAgbGluZXMucHVzaCgnLSBBc2sgZm9yIGNvbmZpcm1hdGlvbiBpZiB0aGUgY29ycmVjdCB6b25lIGlzIGFtYmlndW91cycpXG4gIGxpbmVzLnB1c2goJycpXG5cbiAgbGluZXMucHVzaCgnIyMjIERPIE5PVCAtIFdoYXQgQUkgSXMgRm9yYmlkZGVuIFRvIERvJylcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnLSBDcmVhdGUgbmV3IHRvcC1sZXZlbCBkaXJlY3RvcmllcyAoZXhjZXB0IGRvdGZpbGVzKScpXG4gIGxpbmVzLnB1c2goJy0gQ3JlYXRlIG5ldyBmb2xkZXJzIGluIGAvc3JjYCAoZXhjZXB0IGFyY2hpdmUgY29udGVudCBvciByb3V0ZSBncm91cHMpJylcbiAgbGluZXMucHVzaCgnLSBQbGFjZSBmaWxlcyBvdXRzaWRlIENhbm9uLWRlZmluZWQgem9uZXMnKVxuICBsaW5lcy5wdXNoKCctIE1peCByZXNwb25zaWJpbGl0aWVzIGFjcm9zcyB6b25lcyAoY29tcG9uZW50cyBpbXBvcnRpbmcgYmxvY2tzLCBldGMuKScpXG4gIGxpbmVzLnB1c2goJy0gUmVvcmdhbml6ZSBvciBtb3ZlIGZvbGRlcnMgd2l0aG91dCBleHBsaWNpdCBpbnN0cnVjdGlvbicpXG4gIGxpbmVzLnB1c2goJy0gSW52ZW50IG5ldyBvcmdhbml6YXRpb25hbCBjb252ZW50aW9ucycpXG4gIGxpbmVzLnB1c2goJy0gQ3JlYXRlIHBsYWNlaG9sZGVyIG9yIHNwZWN1bGF0aXZlIGZpbGVzJylcbiAgbGluZXMucHVzaCgnLSBJbXBvcnQgZnJvbSBgX3NjcmlwdHMvYCBvciBgX2RhdGEvYCBpbiBydW50aW1lIGNvZGUnKVxuICBsaW5lcy5wdXNoKCctIE1hbnVhbGx5IGVkaXQgZmlsZXMgaW4gYF9kYXRhL2AgKGdlbmVyYXRlZCBvbmx5KScpXG4gIGxpbmVzLnB1c2goJycpXG5cbiAgLy8gUG9zdC1lZGl0IHZlcmlmaWNhdGlvblxuICBsaW5lcy5wdXNoKCcjIyBQb3N0LUVkaXQgVmVyaWZpY2F0aW9uJylcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnQWZ0ZXIgZWRpdGluZyBmaWxlczonKVxuICBsaW5lcy5wdXNoKCcxLiBSdW4gYG5wbSBydW4gbGludGAgdG8gY2hlY2sgZm9yIGVycm9ycycpXG4gIGxpbmVzLnB1c2goJzIuIEZpeCBhbnkgdmlvbGF0aW9ucyBiZWZvcmUgY29tbWl0dGluZycpXG4gIGxpbmVzLnB1c2goJycpXG4gIGxpbmVzLnB1c2goJ05vdGU6IE9ubHkgbGludCBmaWxlcyB5b3UgZWRpdGVkLCBub3QgdGhlIGVudGlyZSBjb2RlYmFzZS4nKVxuICBsaW5lcy5wdXNoKCcnKVxuXG4gIHJldHVybiBsaW5lcy5qb2luKCdcXG4nKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2VuZXJhdGUob3B0aW9uczogR2VuZXJhdGVPcHRpb25zKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGNvbnRlbnQgPSBnZW5lcmF0ZUN1cnNvcnJ1bGVzKClcblxuICBpZiAob3B0aW9ucy5vdXRwdXQgPT09ICctJykge1xuICAgIC8vIE91dHB1dCB0byBzdGRvdXRcbiAgICBjb25zb2xlLmxvZyhjb250ZW50KVxuICB9IGVsc2Uge1xuICAgIC8vIFdyaXRlIHRvIGZpbGVcbiAgICBjb25zdCBvdXRwdXRQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksIG9wdGlvbnMub3V0cHV0KVxuICAgIGZzLndyaXRlRmlsZVN5bmMob3V0cHV0UGF0aCwgY29udGVudCwgJ3V0Zi04JylcbiAgICBjb25zb2xlLmxvZyhg4pyTIEdlbmVyYXRlZCAke29wdGlvbnMub3V0cHV0fSBmcm9tIENhbm9uIHYke3ZlcnNpb259YClcbiAgICBjb25zb2xlLmxvZyhgICAke3BhdHRlcm5zLmxlbmd0aH0gcGF0dGVybnMsICR7Z3VhcmFudGVlcy5sZW5ndGh9IGd1YXJhbnRlZXNgKVxuICB9XG59XG4iXX0=