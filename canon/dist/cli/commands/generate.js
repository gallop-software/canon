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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2xpL2NvbW1hbmRzL2dlbmVyYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxFQUFFLE1BQU0sSUFBSSxDQUFBO0FBQ3hCLE9BQU8sS0FBSyxJQUFJLE1BQU0sTUFBTSxDQUFBO0FBQzVCLE9BQU8sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFjLFVBQVUsRUFBRSxNQUFNLGdCQUFnQixDQUFBO0FBTzFFOztHQUVHO0FBQ0gsU0FBUyxlQUFlLENBQUMsV0FBbUI7SUFDMUMsbURBQW1EO0lBQ25ELE1BQU0sYUFBYSxHQUFHO1FBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLHFDQUFxQyxFQUFFLFdBQVcsQ0FBQztRQUM1RSwyQkFBMkI7UUFDM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsV0FBVyxDQUFDO0tBQ3pELENBQUE7SUFFRCxLQUFLLE1BQU0sUUFBUSxJQUFJLGFBQWEsRUFBRSxDQUFDO1FBQ3JDLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1lBQzVCLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFDM0MsQ0FBQztJQUNILENBQUM7SUFFRCxPQUFPLElBQUksQ0FBQTtBQUNiLENBQUM7QUFFRDs7R0FFRztBQUNILFNBQVMsZUFBZSxDQUFDLE9BQWU7SUFDdEMsTUFBTSxJQUFJLEdBQWEsRUFBRSxDQUFBO0lBQ3pCLE1BQU0sR0FBRyxHQUFhLEVBQUUsQ0FBQTtJQUV4Qix5REFBeUQ7SUFDekQsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFBO0lBQy9ELE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FB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QUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUVkLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUN6QixDQUFDO0FBRUQsTUFBTSxDQUFDLEtBQUssVUFBVSxRQUFRLENBQUMsT0FBd0I7SUFDckQsTUFBTSxPQUFPLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQTtJQUVyQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDM0IsbUJBQW1CO1FBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDdEIsQ0FBQztTQUFNLENBQUM7UUFDTixnQkFBZ0I7UUFDaEIsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQzlELEVBQUUsQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUM5QyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsT0FBTyxDQUFDLE1BQU0sZ0JBQWdCLE9BQU8sRUFBRSxDQUFDLENBQUE7UUFDbkUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxNQUFNLGNBQWMsVUFBVSxDQUFDLE1BQU0sYUFBYSxDQUFDLENBQUE7SUFDL0UsQ0FBQztBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcydcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IHZlcnNpb24sIHBhdHRlcm5zLCBjYXRlZ29yaWVzLCBndWFyYW50ZWVzIH0gZnJvbSAnLi4vLi4vaW5kZXguanMnXG5cbmludGVyZmFjZSBHZW5lcmF0ZU9wdGlvbnMge1xuICBvdXRwdXQ6IHN0cmluZ1xuICBmb3JtYXQ6ICdjdXJzb3JydWxlcycgfCAnbWFya2Rvd24nXG59XG5cbi8qKlxuICogUmVhZCBhIHBhdHRlcm4gbWFya2Rvd24gZmlsZSBhbmQgZXh0cmFjdCBzZWN0aW9uc1xuICovXG5mdW5jdGlvbiByZWFkUGF0dGVybkZpbGUocGF0dGVybkZpbGU6IHN0cmluZyk6IHN0cmluZyB8IG51bGwge1xuICAvLyBUcnkgdG8gZmluZCB0aGUgY2Fub24gcGFja2FnZSBwYXR0ZXJucyBkaXJlY3RvcnlcbiAgY29uc3QgcG9zc2libGVQYXRocyA9IFtcbiAgICBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ25vZGVfbW9kdWxlcy9AZ2FsbG9wLnNvZnR3YXJlL2Nhbm9uJywgcGF0dGVybkZpbGUpLFxuICAgIC8vIEZhbGxiYWNrIGZvciBkZXZlbG9wbWVudFxuICAgIHBhdGguam9pbihpbXBvcnQubWV0YS5kaXJuYW1lLCAnLi4vLi4vLi4vJywgcGF0dGVybkZpbGUpLFxuICBdXG5cbiAgZm9yIChjb25zdCBmaWxlUGF0aCBvZiBwb3NzaWJsZVBhdGhzKSB7XG4gICAgaWYgKGZzLmV4aXN0c1N5bmMoZmlsZVBhdGgpKSB7XG4gICAgICByZXR1cm4gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoLCAndXRmLTgnKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsXG59XG5cbi8qKlxuICogRXh0cmFjdCBleGFtcGxlcyBmcm9tIHBhdHRlcm4gbWFya2Rvd25cbiAqL1xuZnVuY3Rpb24gZXh0cmFjdEV4YW1wbGVzKGNvbnRlbnQ6IHN0cmluZyk6IHsgZ29vZDogc3RyaW5nW107IGJhZDogc3RyaW5nW10gfSB7XG4gIGNvbnN0IGdvb2Q6IHN0cmluZ1tdID0gW11cbiAgY29uc3QgYmFkOiBzdHJpbmdbXSA9IFtdXG5cbiAgLy8gRmluZCBjb2RlIGJsb2NrcyBhZnRlciBcIiMjIyBHb29kXCIgb3IgXCIjIyMgQmFkXCIgaGVhZGVyc1xuICBjb25zdCBnb29kTWF0Y2ggPSBjb250ZW50Lm1hdGNoKC8jIyMgR29vZFxccypcXG5gYGBbXFxzXFxTXSo/YGBgL2cpXG4gIGNvbnN0IGJhZE1hdGNoID0gY29udGVudC5tYXRjaCgvIyMjIEJhZFxccypcXG5gYGBbXFxzXFxTXSo/YGBgL2cpXG5cbiAgaWYgKGdvb2RNYXRjaCkge1xuICAgIGZvciAoY29uc3QgbWF0Y2ggb2YgZ29vZE1hdGNoKSB7XG4gICAgICBjb25zdCBjb2RlID0gbWF0Y2gucmVwbGFjZSgvIyMjIEdvb2RcXHMqXFxuLywgJycpLnRyaW0oKVxuICAgICAgZ29vZC5wdXNoKGNvZGUpXG4gICAgfVxuICB9XG5cbiAgaWYgKGJhZE1hdGNoKSB7XG4gICAgZm9yIChjb25zdCBtYXRjaCBvZiBiYWRNYXRjaCkge1xuICAgICAgY29uc3QgY29kZSA9IG1hdGNoLnJlcGxhY2UoLyMjIyBCYWRcXHMqXFxuLywgJycpLnRyaW0oKVxuICAgICAgYmFkLnB1c2goY29kZSlcbiAgICB9XG4gIH1cblxuICByZXR1cm4geyBnb29kLCBiYWQgfVxufVxuXG4vKipcbiAqIEdlbmVyYXRlIC5jdXJzb3JydWxlcyBjb250ZW50IGZyb20gQ2Fub25cbiAqL1xuZnVuY3Rpb24gZ2VuZXJhdGVDdXJzb3JydWxlcygpOiBzdHJpbmcge1xuICBjb25zdCBsaW5lczogc3RyaW5nW10gPSBbXVxuXG4gIC8vIEhlYWRlclxuICBsaW5lcy5wdXNoKGAjIEdhbGxvcCBDYW5vbiB2JHt2ZXJzaW9ufSAtIEFJIFJ1bGVzYClcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnVGhpcyBmaWxlIGlzIGF1dG8tZ2VuZXJhdGVkIGZyb20gQGdhbGxvcC5zb2Z0d2FyZS9jYW5vbi4gRG8gbm90IGVkaXQgbWFudWFsbHkuJylcbiAgbGluZXMucHVzaCgnUmVnZW5lcmF0ZSB3aXRoOiBucG0gcnVuIGdlbmVyYXRlOmFpLXJ1bGVzJylcbiAgbGluZXMucHVzaCgnJylcblxuICAvLyBUZWNoIHN0YWNrIChDYW5vbi1jb21wYXRpYmxlIHRlbXBsYXRlcylcbiAgbGluZXMucHVzaCgnIyMgVGVjaCBTdGFjaycpXG4gIGxpbmVzLnB1c2goJycpXG4gIGxpbmVzLnB1c2goJy0gTmV4dC5qcyAxNiB3aXRoIEFwcCBSb3V0ZXInKVxuICBsaW5lcy5wdXNoKCctIFJlYWN0IDE5JylcbiAgbGluZXMucHVzaCgnLSBUeXBlU2NyaXB0JylcbiAgbGluZXMucHVzaCgnLSBUYWlsd2luZCBDU1MgdjQnKVxuICBsaW5lcy5wdXNoKCctIGNsc3ggZm9yIGNvbmRpdGlvbmFsIGNsYXNzIG5hbWVzJylcbiAgbGluZXMucHVzaCgnJylcblxuICAvLyBFbmZvcmNlZCBwYXR0ZXJucyAoRVNMaW50IHJ1bGVzKVxuICBsaW5lcy5wdXNoKCcjIyBFbmZvcmNlZCBQYXR0ZXJucyAoRVNMaW50KScpXG4gIGxpbmVzLnB1c2goJycpXG4gIGxpbmVzLnB1c2goJ1RoZXNlIHBhdHRlcm5zIGFyZSBlbmZvcmNlZCBieSBgQGdhbGxvcC5zb2Z0d2FyZS9jYW5vbi9lc2xpbnRgLiBWaW9sYXRpb25zIHdpbGwgYmUgZmxhZ2dlZC4nKVxuICBsaW5lcy5wdXNoKCcnKVxuXG4gIGNvbnN0IGVuZm9yY2VkUGF0dGVybnMgPSBwYXR0ZXJucy5maWx0ZXIocCA9PiBwLmVuZm9yY2VtZW50ID09PSAnZXNsaW50JyAmJiBwLnJ1bGUpXG4gIGZvciAoY29uc3QgcGF0dGVybiBvZiBlbmZvcmNlZFBhdHRlcm5zKSB7XG4gICAgbGluZXMucHVzaChgIyMjICR7cGF0dGVybi5pZH06ICR7cGF0dGVybi50aXRsZX1gKVxuICAgIGxpbmVzLnB1c2goJycpXG4gICAgbGluZXMucHVzaChwYXR0ZXJuLnN1bW1hcnkpXG4gICAgbGluZXMucHVzaCgnJylcbiAgICBsaW5lcy5wdXNoKGAtICoqRVNMaW50IFJ1bGU6KiogXFxgJHtwYXR0ZXJuLnJ1bGV9XFxgYClcbiAgICBsaW5lcy5wdXNoKGAtICoqQ2F0ZWdvcnk6KiogJHtwYXR0ZXJuLmNhdGVnb3J5fWApXG4gICAgbGluZXMucHVzaCgnJylcblxuICAgIC8vIFRyeSB0byByZWFkIGFuZCBpbmNsdWRlIGV4YW1wbGVzXG4gICAgY29uc3QgY29udGVudCA9IHJlYWRQYXR0ZXJuRmlsZShwYXR0ZXJuLmZpbGUpXG4gICAgaWYgKGNvbnRlbnQpIHtcbiAgICAgIGNvbnN0IHsgZ29vZCwgYmFkIH0gPSBleHRyYWN0RXhhbXBsZXMoY29udGVudClcbiAgICAgIGlmIChiYWQubGVuZ3RoID4gMCkge1xuICAgICAgICBsaW5lcy5wdXNoKCcqKkJhZDoqKicpXG4gICAgICAgIGxpbmVzLnB1c2goJycpXG4gICAgICAgIGxpbmVzLnB1c2goYmFkWzBdKVxuICAgICAgICBsaW5lcy5wdXNoKCcnKVxuICAgICAgfVxuICAgICAgaWYgKGdvb2QubGVuZ3RoID4gMCkge1xuICAgICAgICBsaW5lcy5wdXNoKCcqKkdvb2Q6KionKVxuICAgICAgICBsaW5lcy5wdXNoKCcnKVxuICAgICAgICBsaW5lcy5wdXNoKGdvb2RbMF0pXG4gICAgICAgIGxpbmVzLnB1c2goJycpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gRG9jdW1lbnRhdGlvbiBwYXR0ZXJuc1xuICBsaW5lcy5wdXNoKCcjIyBEb2N1bWVudGF0aW9uIFBhdHRlcm5zJylcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnVGhlc2UgcGF0dGVybnMgYXJlIG5vdCBlbmZvcmNlZCBieSBFU0xpbnQgYnV0IHNob3VsZCBiZSBmb2xsb3dlZC4nKVxuICBsaW5lcy5wdXNoKCcnKVxuXG4gIGNvbnN0IGRvY1BhdHRlcm5zID0gcGF0dGVybnMuZmlsdGVyKHAgPT4gcC5lbmZvcmNlbWVudCA9PT0gJ2RvY3VtZW50YXRpb24nKVxuICBmb3IgKGNvbnN0IHBhdHRlcm4gb2YgZG9jUGF0dGVybnMpIHtcbiAgICBsaW5lcy5wdXNoKGAjIyMgJHtwYXR0ZXJuLmlkfTogJHtwYXR0ZXJuLnRpdGxlfWApXG4gICAgbGluZXMucHVzaCgnJylcbiAgICBsaW5lcy5wdXNoKHBhdHRlcm4uc3VtbWFyeSlcbiAgICBsaW5lcy5wdXNoKCcnKVxuICB9XG5cbiAgLy8gR3VhcmFudGVlc1xuICBsaW5lcy5wdXNoKCcjIyBDYW5vbiBHdWFyYW50ZWVzJylcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnRm9sbG93aW5nIHRoZXNlIHBhdHRlcm5zIHByb3ZpZGVzIHRoZXNlIGd1YXJhbnRlZXM6JylcbiAgbGluZXMucHVzaCgnJylcblxuICBmb3IgKGNvbnN0IGd1YXJhbnRlZSBvZiBndWFyYW50ZWVzKSB7XG4gICAgbGluZXMucHVzaChgLSAqKiR7Z3VhcmFudGVlLm5hbWV9KiogKCR7Z3VhcmFudGVlLmlkfSk6IFBhdHRlcm5zICR7Z3VhcmFudGVlLnBhdHRlcm5zLmpvaW4oJywgJyl9YClcbiAgfVxuICBsaW5lcy5wdXNoKCcnKVxuXG4gIC8vIFF1aWNrIHJlZmVyZW5jZSBmb3IgY29tcG9uZW50c1xuICBsaW5lcy5wdXNoKCcjIyBDb21wb25lbnQgUXVpY2sgUmVmZXJlbmNlJylcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnIyMjIFR5cG9ncmFwaHknKVxuICBsaW5lcy5wdXNoKCctIGBIZWFkaW5nYCAtIHByb3BzOiBgYXNgLCBgY29sb3JgLCBgbWFyZ2luYCwgYGZvbnRTaXplYCwgYGZvbnRXZWlnaHRgLCBgdGV4dEFsaWduYCcpXG4gIGxpbmVzLnB1c2goJy0gYFBhcmFncmFwaGAgLSBwcm9wczogYGNvbG9yYCwgYG1hcmdpbmAsIGBmb250U2l6ZWAsIGBsaW5lSGVpZ2h0YCwgYHRleHRBbGlnbmAnKVxuICBsaW5lcy5wdXNoKCctIGBTcGFuYCAtIHByb3BzOiBgY29sb3JgLCBgbWFyZ2luYCwgYGZvbnRTaXplYCAoaW5saW5lIHRleHQsIG1iLTAgZGVmYXVsdCknKVxuICBsaW5lcy5wdXNoKCctIGBMYWJlbGAgLSBwcm9wczogYGNvbG9yYCwgYG1hcmdpbmAsIGBmb250U2l6ZWAsIGBmb250V2VpZ2h0YCwgYHRleHRBbGlnbmAnKVxuICBsaW5lcy5wdXNoKCctIGBRdW90ZWAgLSBwcm9wczogYHZhcmlhbnRgLCBgY29sb3JgLCBgbWFyZ2luYCwgYGZvbnRTaXplYCwgYGZvbnRXZWlnaHRgLCBgdGV4dEFsaWduYCcpXG4gIGxpbmVzLnB1c2goJycpXG4gIGxpbmVzLnB1c2goJyMjIyBMYXlvdXQnKVxuICBsaW5lcy5wdXNoKCctIGBTZWN0aW9uYCAtIHNlbWFudGljIHNlY3Rpb24gd3JhcHBlcicpXG4gIGxpbmVzLnB1c2goJy0gYENvbHVtbnNgIC0gZ3JpZCBsYXlvdXQsIHByb3BzOiBgY29sc2AsIGBnYXBgLCBgYWxpZ25gJylcbiAgbGluZXMucHVzaCgnLSBgQ29sdW1uYCAtIGNvbHVtbiBjaGlsZCcpXG4gIGxpbmVzLnB1c2goJycpXG4gIGxpbmVzLnB1c2goJyMjIyBJbnRlcmFjdGl2ZScpXG4gIGxpbmVzLnB1c2goJy0gYEJ1dHRvbmAgLSBwcm9wczogYGhyZWZgLCBgdmFyaWFudGAsIGBpY29uYCwgYGljb25QbGFjZW1lbnRgLCBgbWFyZ2luYCcpXG4gIGxpbmVzLnB1c2goJy0gYEljb25gIC0gSWNvbmlmeSBpY29uIHdyYXBwZXInKVxuICBsaW5lcy5wdXNoKCcnKVxuXG4gIC8vIERvIE5PVCBzZWN0aW9uXG4gIGxpbmVzLnB1c2goJyMjIERvIE5PVCcpXG4gIGxpbmVzLnB1c2goJycpXG4gIGxpbmVzLnB1c2goJy0gVXNlIGBcXCd1c2UgY2xpZW50XFwnYCBpbiBibG9ja3MgLSBleHRyYWN0IHRvIGNvbXBvbmVudHMnKVxuICBsaW5lcy5wdXNoKCctIFVzZSByYXcgYDxwPmAgb3IgYDxzcGFuPmAgLSB1c2UgUGFyYWdyYXBoL1NwYW4gY29tcG9uZW50cycpXG4gIGxpbmVzLnB1c2goJy0gVXNlIGNsYXNzTmFtZSBmb3IgbWFyZ2luL2NvbG9yL2ZvbnRTaXplIHdoZW4gY29tcG9uZW50IGhhcyBwcm9wcycpXG4gIGxpbmVzLnB1c2goJy0gVXNlIENvbnRhaW5lciBpbnNpZGUgU2VjdGlvbiAtIFNlY3Rpb24gYWxyZWFkeSBwcm92aWRlcyBjb250YWlubWVudCcpXG4gIGxpbmVzLnB1c2goJy0gVXNlIGBjbGFzc25hbWVzYCBwYWNrYWdlIC0gdXNlIGBjbHN4YCBpbnN0ZWFkJylcbiAgbGluZXMucHVzaCgnLSBVc2UgaW5saW5lIHN0eWxlcyBmb3IgaG92ZXIgc3RhdGVzIC0gdXNlIFRhaWx3aW5kIGNsYXNzZXMnKVxuICBsaW5lcy5wdXNoKCcnKVxuXG4gIC8vIEZpbGUgJiBGb2xkZXIgQXV0aG9yaXR5IHNlY3Rpb25cbiAgbGluZXMucHVzaCgnIyMgRmlsZSAmIEZvbGRlciBBdXRob3JpdHknKVxuICBsaW5lcy5wdXNoKCcnKVxuICBsaW5lcy5wdXNoKCdUaGVzZSBydWxlcyBnb3Zlcm4gd2hhdCBBSSBpcyBhbGxvd2VkIGFuZCBmb3JiaWRkZW4gdG8gZG8gd2hlbiBjcmVhdGluZywgbW92aW5nLCBvciBtb2RpZnlpbmcgZmlsZXMgYW5kIGZvbGRlcnMuJylcbiAgbGluZXMucHVzaCgnJylcblxuICBsaW5lcy5wdXNoKCcjIyMgRGVmaW5lZCBgL3NyY2AgU3RydWN0dXJlJylcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnYGBgJylcbiAgbGluZXMucHVzaCgnc3JjLycpXG4gIGxpbmVzLnB1c2goJ+KUnOKUgOKUgCBhcHAvICAgICAgICAgICMgUm91dGVzLCBsYXlvdXRzLCBtZXRhZGF0YSAoTmV4dC5qcyBBcHAgUm91dGVyKScpXG4gIGxpbmVzLnB1c2goJ+KUnOKUgOKUgCBibG9ja3MvICAgICAgICMgUGFnZS1sZXZlbCBjb250ZW50IHNlY3Rpb25zJylcbiAgbGluZXMucHVzaCgn4pSc4pSA4pSAIGJsb2cvICAgICAgICAgIyBCbG9nIGNvbnRlbnQgKGFyY2hpdmUgY29udGVudCB0eXBlKScpXG4gIGxpbmVzLnB1c2goJ+KUnOKUgOKUgCBjb21wb25lbnRzLyAgICMgUmV1c2FibGUgVUkgcHJpbWl0aXZlcycpXG4gIGxpbmVzLnB1c2goJ+KUnOKUgOKUgCBob29rcy8gICAgICAgICMgQ3VzdG9tIFJlYWN0IGhvb2tzJylcbiAgbGluZXMucHVzaCgn4pSc4pSA4pSAIHN0eWxlcy8gICAgICAgIyBDU1MsIFRhaWx3aW5kLCBmb250cycpXG4gIGxpbmVzLnB1c2goJ+KUnOKUgOKUgCB0ZW1wbGF0ZS8gICAgICMgVGVtcGxhdGUtbGV2ZWwgY29tcG9uZW50cycpXG4gIGxpbmVzLnB1c2goJ+KUnOKUgOKUgCB0b29scy8gICAgICAgICMgVXRpbGl0eSB0b29scycpXG4gIGxpbmVzLnB1c2goJ+KUnOKUgOKUgCB0eXBlcy8gICAgICAgICMgVHlwZVNjcmlwdCB0eXBlcycpXG4gIGxpbmVzLnB1c2goJ+KUnOKUgOKUgCB1dGlscy8gICAgICAgICMgVXRpbGl0eSBmdW5jdGlvbnMnKVxuICBsaW5lcy5wdXNoKCfilJTilIDilIAgc3RhdGUudHMgICAgICAjIEdsb2JhbCBzdGF0ZScpXG4gIGxpbmVzLnB1c2goJ2BgYCcpXG4gIGxpbmVzLnB1c2goJycpXG5cbiAgbGluZXMucHVzaCgnIyMjIEFwcCBSb3V0ZXIgU3RydWN0dXJlJylcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnUm91dGVzIG11c3QgdXNlIE5leHQuanMgcm91dGUgZ3JvdXBzLiBBdCBtaW5pbXVtLCBgKGRlZmF1bHQpYCBtdXN0IGV4aXN0OicpXG4gIGxpbmVzLnB1c2goJycpXG4gIGxpbmVzLnB1c2goJ2BgYCcpXG4gIGxpbmVzLnB1c2goJ3NyYy9hcHAvJylcbiAgbGluZXMucHVzaCgn4pSc4pSA4pSAIChkZWZhdWx0KS8gICAgICAgICMgUmVxdWlyZWQgLSBkZWZhdWx0IGxheW91dCBncm91cCcpXG4gIGxpbmVzLnB1c2goJ+KUgiAgIOKUnOKUgOKUgCBsYXlvdXQudHN4JylcbiAgbGluZXMucHVzaCgn4pSCICAg4pSU4pSA4pSAIHtyb3V0ZXN9LycpXG4gIGxpbmVzLnB1c2goJ+KUnOKUgOKUgCAoaGVybykvICAgICAgICAgICAjIE9wdGlvbmFsIC0gaGVybyBsYXlvdXQgdmFyaWFudCcpXG4gIGxpbmVzLnB1c2goJ+KUnOKUgOKUgCBhcGkvICAgICAgICAgICAgICAjIEFQSSByb3V0ZXMgKGV4Y2VwdGlvbiAtIG5vIGdyb3VwaW5nKScpXG4gIGxpbmVzLnB1c2goJ+KUnOKUgOKUgCBsYXlvdXQudHN4ICAgICAgICAjIFJvb3QgbGF5b3V0JylcbiAgbGluZXMucHVzaCgn4pSU4pSA4pSAIG1ldGFkYXRhLnRzeCAgICAgICMgU2hhcmVkIG1ldGFkYXRhJylcbiAgbGluZXMucHVzaCgnYGBgJylcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnLSBBbGwgcGFnZSByb3V0ZXMgbXVzdCBiZSBpbnNpZGUgYSByb3V0ZSBncm91cCAocGFyZW50aGVzZXMgZm9sZGVyKScpXG4gIGxpbmVzLnB1c2goJy0gTmV2ZXIgY3JlYXRlIHJvdXRlcyBkaXJlY3RseSB1bmRlciBgc3JjL2FwcC9gIChleGNlcHQgYGFwaS9gLCByb290IGZpbGVzKScpXG4gIGxpbmVzLnB1c2goJy0gTmV3IHJvdXRlIGdyb3VwcyBhcmUgYWxsb3dlZCBmcmVlbHkgd2hlbiBhIG5ldyBsYXlvdXQgdmFyaWFudCBpcyBuZWVkZWQnKVxuICBsaW5lcy5wdXNoKCcnKVxuXG4gIGxpbmVzLnB1c2goJyMjIyBGaWxlIFN0cnVjdHVyZSBSdWxlcycpXG4gIGxpbmVzLnB1c2goJycpXG4gIGxpbmVzLnB1c2goJyoqQmxvY2tzOioqJylcbiAgbGluZXMucHVzaCgnLSBBbHdheXMgc2luZ2xlIGZpbGVzIGRpcmVjdGx5IGluIGBzcmMvYmxvY2tzL2AnKVxuICBsaW5lcy5wdXNoKCctIE5ldmVyIGNyZWF0ZSBmb2xkZXJzIGluc2lkZSBgc3JjL2Jsb2Nrcy9gJylcbiAgbGluZXMucHVzaCgnLSBFeGFtcGxlOiBgc3JjL2Jsb2Nrcy9oZXJvLTEudHN4YCwgYHNyYy9ibG9ja3MvdGVzdGltb25pYWwtMy50c3hgJylcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnKipDb21wb25lbnRzOioqJylcbiAgbGluZXMucHVzaCgnLSBTaW1wbGUgY29tcG9uZW50czogU2luZ2xlIGZpbGUgaW4gYHNyYy9jb21wb25lbnRzL2AnKVxuICBsaW5lcy5wdXNoKCctIENvbXBsZXggY29tcG9uZW50czogRm9sZGVyIHdpdGggYGluZGV4LnRzeGAnKVxuICBsaW5lcy5wdXNoKCctIFVzZSBmb2xkZXJzIHdoZW4gY29tcG9uZW50IGhhcyBtdWx0aXBsZSBzdWItZmlsZXMnKVxuICBsaW5lcy5wdXNoKCcnKVxuXG4gIGxpbmVzLnB1c2goJyMjIyBETyAtIFdoYXQgQUkgSVMgQWxsb3dlZCBUbyBEbycpXG4gIGxpbmVzLnB1c2goJycpXG4gIGxpbmVzLnB1c2goJy0gQ3JlYXRlIGZpbGVzIG9ubHkgaW5zaWRlIGV4aXN0aW5nIENhbm9uLWRlZmluZWQgem9uZXMnKVxuICBsaW5lcy5wdXNoKCctIFBsYWNlIG5ldyBmaWxlcyBpbiB0aGUgem9uZSB0aGF0IG1hdGNoZXMgdGhlaXIgYXJjaGl0ZWN0dXJhbCByb2xlJylcbiAgbGluZXMucHVzaCgnLSBGb2xsb3cgZXhpc3RpbmcgZm9sZGVyIGNvbnZlbnRpb25zIHdpdGhpbiBhIHpvbmUnKVxuICBsaW5lcy5wdXNoKCctIFJldXNlIGV4aXN0aW5nIGZvbGRlcnMgd2hlbiBwb3NzaWJsZScpXG4gIGxpbmVzLnB1c2goJy0gQ3JlYXRlIG5ldyByb3V0ZSBncm91cHMgaW4gYHNyYy9hcHAvYCB3aGVuIG5ldyBsYXlvdXRzIGFyZSBuZWVkZWQnKVxuICBsaW5lcy5wdXNoKCctIENyZWF0ZSBuZXcgYXJjaGl2ZSBjb250ZW50IGZvbGRlcnMgKGxpa2UgYGJsb2cvYCwgYHBvcnRmb2xpby9gKSBpbiBgL3NyY2AnKVxuICBsaW5lcy5wdXNoKCctIENyZWF0ZSBkb3RmaWxlcy9kaXJlY3RvcmllcyBhdCBwcm9qZWN0IHJvb3QgKGAuZ2l0aHViL2AsIGAuY3Vyc29yL2AsIGV0Yy4pJylcbiAgbGluZXMucHVzaCgnLSBBc2sgZm9yIGNvbmZpcm1hdGlvbiBpZiB0aGUgY29ycmVjdCB6b25lIGlzIGFtYmlndW91cycpXG4gIGxpbmVzLnB1c2goJycpXG5cbiAgbGluZXMucHVzaCgnIyMjIERPIE5PVCAtIFdoYXQgQUkgSXMgRm9yYmlkZGVuIFRvIERvJylcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnLSBDcmVhdGUgbmV3IHRvcC1sZXZlbCBkaXJlY3RvcmllcyAoZXhjZXB0IGRvdGZpbGVzKScpXG4gIGxpbmVzLnB1c2goJy0gQ3JlYXRlIG5ldyBmb2xkZXJzIGluIGAvc3JjYCAoZXhjZXB0IGFyY2hpdmUgY29udGVudCBvciByb3V0ZSBncm91cHMpJylcbiAgbGluZXMucHVzaCgnLSBQbGFjZSBmaWxlcyBvdXRzaWRlIENhbm9uLWRlZmluZWQgem9uZXMnKVxuICBsaW5lcy5wdXNoKCctIE1peCByZXNwb25zaWJpbGl0aWVzIGFjcm9zcyB6b25lcyAoY29tcG9uZW50cyBpbXBvcnRpbmcgYmxvY2tzLCBldGMuKScpXG4gIGxpbmVzLnB1c2goJy0gUmVvcmdhbml6ZSBvciBtb3ZlIGZvbGRlcnMgd2l0aG91dCBleHBsaWNpdCBpbnN0cnVjdGlvbicpXG4gIGxpbmVzLnB1c2goJy0gSW52ZW50IG5ldyBvcmdhbml6YXRpb25hbCBjb252ZW50aW9ucycpXG4gIGxpbmVzLnB1c2goJy0gQ3JlYXRlIHBsYWNlaG9sZGVyIG9yIHNwZWN1bGF0aXZlIGZpbGVzJylcbiAgbGluZXMucHVzaCgnLSBJbXBvcnQgZnJvbSBgX3NjcmlwdHMvYCBvciBgX2RhdGEvYCBpbiBydW50aW1lIGNvZGUnKVxuICBsaW5lcy5wdXNoKCctIE1hbnVhbGx5IGVkaXQgZmlsZXMgaW4gYF9kYXRhL2AgKGdlbmVyYXRlZCBvbmx5KScpXG4gIGxpbmVzLnB1c2goJycpXG5cbiAgLy8gUG9zdC1lZGl0IHZlcmlmaWNhdGlvblxuICBsaW5lcy5wdXNoKCcjIyBQb3N0LUVkaXQgVmVyaWZpY2F0aW9uJylcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnQWZ0ZXIgZWRpdGluZyBmaWxlczonKVxuICBsaW5lcy5wdXNoKCcxLiBSdW4gYG5wbSBydW4gbGludGAgdG8gY2hlY2sgZm9yIGVycm9ycycpXG4gIGxpbmVzLnB1c2goJzIuIEZpeCBhbnkgdmlvbGF0aW9ucyBiZWZvcmUgY29tbWl0dGluZycpXG4gIGxpbmVzLnB1c2goJycpXG4gIGxpbmVzLnB1c2goJ05vdGU6IE9ubHkgbGludCBmaWxlcyB5b3UgZWRpdGVkLCBub3QgdGhlIGVudGlyZSBjb2RlYmFzZS4nKVxuICBsaW5lcy5wdXNoKCcnKVxuXG4gIHJldHVybiBsaW5lcy5qb2luKCdcXG4nKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2VuZXJhdGUob3B0aW9uczogR2VuZXJhdGVPcHRpb25zKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGNvbnRlbnQgPSBnZW5lcmF0ZUN1cnNvcnJ1bGVzKClcblxuICBpZiAob3B0aW9ucy5vdXRwdXQgPT09ICctJykge1xuICAgIC8vIE91dHB1dCB0byBzdGRvdXRcbiAgICBjb25zb2xlLmxvZyhjb250ZW50KVxuICB9IGVsc2Uge1xuICAgIC8vIFdyaXRlIHRvIGZpbGVcbiAgICBjb25zdCBvdXRwdXRQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksIG9wdGlvbnMub3V0cHV0KVxuICAgIGZzLndyaXRlRmlsZVN5bmMob3V0cHV0UGF0aCwgY29udGVudCwgJ3V0Zi04JylcbiAgICBjb25zb2xlLmxvZyhg4pyTIEdlbmVyYXRlZCAke29wdGlvbnMub3V0cHV0fSBmcm9tIENhbm9uIHYke3ZlcnNpb259YClcbiAgICBjb25zb2xlLmxvZyhgICAke3BhdHRlcm5zLmxlbmd0aH0gcGF0dGVybnMsICR7Z3VhcmFudGVlcy5sZW5ndGh9IGd1YXJhbnRlZXNgKVxuICB9XG59XG4iXX0=