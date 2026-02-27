import * as fs from 'fs';
import * as path from 'path';
import { version, patterns, guarantees } from '../../index.js';
import { loadConfig } from '../config.js';
/**
 * Detect output format from filename
 */
function detectFormat(filename) {
    const base = path.basename(filename).toLowerCase();
    if (base === 'claude.md')
        return 'claude';
    if (base === 'copilot-instructions.md')
        return 'copilot';
    return 'cursorrules';
}
/**
 * Get all output targets when generating all files
 */
function getAllTargets() {
    return [
        { output: '.cursorrules', format: 'cursorrules' },
        { output: 'CLAUDE.md', format: 'claude' },
        { output: '.github/copilot-instructions.md', format: 'copilot' },
    ];
}
/**
 * Read a pattern markdown file and extract sections
 */
function readPatternFile(patternFile) {
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
// ─── Shared section generators ────────────────────────────────────────────
function generateHeader(format) {
    const lines = [];
    if (format === 'claude') {
        lines.push(`# CLAUDE.md — Project-Specific Intelligence`);
        lines.push('');
        lines.push(`> Auto-generated from Gallop Canon v${version}. Do not edit manually.`);
        lines.push(`> Regenerate with: npm run generate:ai-rules`);
    }
    else if (format === 'copilot') {
        lines.push(`# Gallop Canon v${version} - Copilot Instructions`);
        lines.push('');
        lines.push('This file is auto-generated from @gallop.software/canon. Do not edit manually.');
        lines.push('Regenerate with: npm run generate:ai-rules');
    }
    else {
        lines.push(`# Gallop Canon v${version} - AI Rules`);
        lines.push('');
        lines.push('This file is auto-generated from @gallop.software/canon. Do not edit manually.');
        lines.push('Regenerate with: npm run generate:ai-rules');
    }
    lines.push('');
    return lines;
}
function generateTechStack() {
    return [
        '## Tech Stack',
        '',
        '- Next.js 16 with App Router',
        '- React 19',
        '- TypeScript',
        '- Tailwind CSS v4',
        '- clsx for conditional class names',
        '',
    ];
}
function generateEnforcedPatterns(format) {
    const lines = [];
    const enforcedPatterns = patterns.filter(p => p.enforcement === 'eslint' && p.rule);
    lines.push('## Enforced Patterns (ESLint)');
    lines.push('');
    lines.push('These patterns are enforced by `@gallop.software/canon/eslint`. Violations will be flagged.');
    lines.push('');
    if (format === 'claude') {
        // Claude can run lint — brief list with rule names
        for (const pattern of enforcedPatterns) {
            lines.push(`- **${pattern.id}: ${pattern.title}** — \`${pattern.rule}\` — ${pattern.summary}`);
        }
        lines.push('');
    }
    else {
        // Cursorrules and Copilot: full examples
        for (const pattern of enforcedPatterns) {
            lines.push(`### ${pattern.id}: ${pattern.title}`);
            lines.push('');
            lines.push(pattern.summary);
            lines.push('');
            lines.push(`- **ESLint Rule:** \`${pattern.rule}\``);
            lines.push(`- **Category:** ${pattern.category}`);
            lines.push('');
            if (format === 'cursorrules') {
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
        }
    }
    return lines;
}
function generateDocPatterns() {
    const lines = [];
    const docPatterns = patterns.filter(p => p.enforcement === 'documentation');
    lines.push('## Documentation Patterns');
    lines.push('');
    lines.push('These patterns are not enforced by ESLint but should be followed.');
    lines.push('');
    for (const pattern of docPatterns) {
        lines.push(`### ${pattern.id}: ${pattern.title}`);
        lines.push('');
        lines.push(pattern.summary);
        lines.push('');
    }
    return lines;
}
function generateGuarantees() {
    const lines = [];
    lines.push('## Canon Guarantees');
    lines.push('');
    lines.push('Following these patterns provides these guarantees:');
    lines.push('');
    for (const guarantee of guarantees) {
        lines.push(`- **${guarantee.name}** (${guarantee.id}): Patterns ${guarantee.patterns.join(', ')}`);
    }
    lines.push('');
    return lines;
}
function generateComponentReference(config) {
    const lines = [];
    lines.push('## Component Quick Reference');
    lines.push('');
    if (config?.components?.length) {
        for (const comp of config.components) {
            const propsStr = comp.props?.length ? ` - props: ${comp.props.map(p => `\`${p}\``).join(', ')}` : '';
            const noteStr = comp.notes ? ` (${comp.notes})` : '';
            lines.push(`- \`${comp.name}\`${propsStr}${noteStr}`);
        }
    }
    else {
        // Fallback: hardcoded component list
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
    }
    lines.push('');
    return lines;
}
function generateDoNotSection(config) {
    const lines = [];
    lines.push('## Do NOT');
    lines.push('');
    // Default rules always present
    lines.push("- Use `'use client'` in blocks - extract to components");
    lines.push('- Use raw `<p>`, `<span>`, or `<h1>`–`<h6>` - use Paragraph/Span/Heading components');
    lines.push('- Use className for margin/color/fontSize when component has props');
    lines.push('- Use Container inside Section - Section already provides containment');
    lines.push('- Use `classnames` package - use `clsx` instead');
    lines.push('- Use inline styles for hover states - use Tailwind classes');
    lines.push('- Use native `IntersectionObserver` - use `react-intersection-observer` package');
    lines.push('- Use inline `<svg>` in blocks - use the Icon component with Iconify icons');
    lines.push('- Use deep relative imports (`../../`) - use `@/` alias imports');
    // Template-specific rules
    if (config?.rules) {
        for (const rule of config.rules) {
            if (rule.type === 'doNot') {
                lines.push(`- ${rule.rule}`);
            }
        }
    }
    lines.push('');
    return lines;
}
function generateFileAuthority() {
    const lines = [];
    lines.push('## File & Folder Authority');
    lines.push('');
    lines.push('These rules govern what AI is allowed and forbidden to do when creating, moving, or modifying files and folders.');
    lines.push('');
    lines.push('### Defined `/src` Structure');
    lines.push('');
    lines.push('```');
    lines.push('src/');
    lines.push('├── app/          # Routes, layouts, metadata (Next.js App Router)');
    lines.push('│   └── {route}/');
    lines.push('│       ├── page.tsx');
    lines.push('│       └── _blocks/  # Co-located page-specific blocks');
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
    lines.push('- Co-located in `_blocks/` subdirectories alongside each page route');
    lines.push('- Singleton naming: `hero.tsx` (one per page), numbered when multiple: `content-2.tsx`, `content-3.tsx`');
    lines.push('- Import with relative paths: `import Hero from \'./_blocks/hero\'`');
    lines.push('- Example: `src/app/(default)/furniture/_blocks/hero.tsx`');
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
    return lines;
}
function generateVerification(config) {
    const lines = [];
    lines.push('## Post-Edit Verification');
    lines.push('');
    lines.push('After editing files:');
    if (config?.verification?.length) {
        let step = 1;
        for (const cmd of config.verification) {
            lines.push(`${step}. Run \`${cmd}\``);
            step++;
        }
        lines.push(`${step}. Fix any violations before committing`);
    }
    else {
        lines.push('1. Run `npm run lint` to check for errors');
        lines.push('2. Fix any violations before committing');
    }
    lines.push('');
    lines.push('Note: Only lint files you edited, not the entire codebase.');
    lines.push('');
    return lines;
}
// ─── Claude-specific sections ─────────────────────────────────────────────
function generateAutoGenFiles(config) {
    if (!config?.generatedFiles?.length)
        return [];
    const lines = [];
    lines.push('## Auto-Generated Files — Never Edit Manually');
    lines.push('');
    lines.push('| File | Regenerate With | Triggered By |');
    lines.push('|---|---|---|');
    for (const file of config.generatedFiles) {
        lines.push(`| \`${file.path}\` | \`${file.command}\` | ${file.trigger} |`);
    }
    lines.push('');
    return lines;
}
function generateBuildCommands(config) {
    if (!config?.buildCommands?.length)
        return [];
    const lines = [];
    lines.push('## Build Commands');
    lines.push('');
    lines.push('| Command | Purpose |');
    lines.push('|---|---|');
    for (const cmd of config.buildCommands) {
        lines.push(`| \`${cmd.script}\` | ${cmd.description} |`);
    }
    lines.push('');
    return lines;
}
function generateColorTokens(config) {
    if (!config?.colorTokens)
        return [];
    const lines = [];
    const ct = config.colorTokens;
    lines.push('## Color Token System');
    lines.push('');
    lines.push('All colors use semantic tokens defined in `src/styles/tailwind.css` `@theme`:');
    lines.push('');
    if (ct.surface?.length) {
        lines.push(`- **Surface**: ${ct.surface.map(s => `\`${s}\``).join(', ')}`);
    }
    if (ct.text?.length) {
        lines.push(`- **Text**: ${ct.text.map(s => `\`${s}\``).join(', ')}`);
    }
    if (ct.overlay?.length) {
        lines.push(`- **Overlay** (fixed — don't flip in dark mode): ${ct.overlay.map(s => `\`${s}\``).join(', ')}`);
    }
    if (ct.accents?.length) {
        lines.push(`- **Accents**: ${ct.accents.map(s => `\`${s}\``).join(', ')}`);
    }
    lines.push('');
    lines.push('**Never use**: `gray-*`, `white`, `black`, `slate-*` — always map to a semantic token.');
    lines.push('');
    return lines;
}
function generateStateManagement(config) {
    if (!config?.state)
        return [];
    const lines = [];
    const st = config.state;
    lines.push('## State Management');
    lines.push('');
    lines.push(`${st.library} store at \`${st.file}\`. Read with \`${st.readPattern}\`, write with \`${st.writePattern}\`.`);
    lines.push('');
    if (st.properties?.length) {
        lines.push(`Available state: ${st.properties.map(p => `\`${p}\``).join(', ')}.`);
        lines.push('');
    }
    return lines;
}
function generateTemplateRules(config) {
    if (!config?.rules?.length)
        return [];
    const doRules = config.rules.filter(r => r.type === 'do');
    if (!doRules.length)
        return [];
    const lines = [];
    lines.push('## Template-Specific Rules');
    lines.push('');
    for (const rule of doRules) {
        lines.push(`- ${rule.rule}`);
    }
    lines.push('');
    return lines;
}
// ─── Format generators ────────────────────────────────────────────────────
function generateCursorrules(config) {
    const lines = [
        ...generateHeader('cursorrules'),
        ...generateTechStack(),
        ...generateEnforcedPatterns('cursorrules'),
        ...generateDocPatterns(),
        ...generateGuarantees(),
        ...generateComponentReference(config),
        ...generateDoNotSection(config),
        ...generateFileAuthority(),
        ...generateVerification(config),
    ];
    return lines.join('\n');
}
function generateClaudeMd(config) {
    const lines = [
        ...generateHeader('claude'),
        ...generateAutoGenFiles(config),
        ...generateBuildCommands(config),
        ...generateEnforcedPatterns('claude'),
        ...generateDocPatterns(),
        ...generateColorTokens(config),
        ...generateComponentReference(config),
        ...generateStateManagement(config),
        ...generateTemplateRules(config),
        ...generateDoNotSection(config),
        ...generateVerification(config),
    ];
    return lines.join('\n');
}
function generateCopilotInstructions(config) {
    const lines = [
        ...generateHeader('copilot'),
        ...generateTechStack(),
        ...generateEnforcedPatterns('copilot'),
        ...generateDocPatterns(),
        ...generateComponentReference(config),
        ...generateDoNotSection(config),
        ...generateVerification(config),
    ];
    return lines.join('\n');
}
function generateContent(format, config) {
    switch (format) {
        case 'claude':
            return generateClaudeMd(config);
        case 'copilot':
            return generateCopilotInstructions(config);
        case 'cursorrules':
        default:
            return generateCursorrules(config);
    }
}
function writeOutput(content, outputPath) {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(outputPath, content, 'utf-8');
}
// ─── Public API ───────────────────────────────────────────────────────────
export async function generate(options) {
    const config = loadConfig();
    if (options.output === 'all') {
        // Generate all targets
        const targets = getAllTargets();
        for (const target of targets) {
            const content = generateContent(target.format, config);
            const outputPath = path.resolve(process.cwd(), target.output);
            writeOutput(content, outputPath);
            console.log(`✓ Generated ${target.output}`);
        }
        console.log(`  Canon v${version} — ${patterns.length} patterns, ${guarantees.length} guarantees`);
        if (config) {
            console.log(`  Template config: ${config.name}`);
        }
    }
    else if (options.output === '-') {
        const content = generateContent(options.format, config);
        console.log(content);
    }
    else {
        const content = generateContent(options.format, config);
        const outputPath = path.resolve(process.cwd(), options.output);
        writeOutput(content, outputPath);
        console.log(`✓ Generated ${options.output} from Canon v${version}`);
        console.log(`  ${patterns.length} patterns, ${guarantees.length} guarantees`);
        if (config) {
            console.log(`  Template config: ${config.name}`);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2xpL2NvbW1hbmRzL2dlbmVyYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxFQUFFLE1BQU0sSUFBSSxDQUFBO0FBQ3hCLE9BQU8sS0FBSyxJQUFJLE1BQU0sTUFBTSxDQUFBO0FBQzVCLE9BQU8sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxNQUFNLGdCQUFnQixDQUFBO0FBQzlELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxjQUFjLENBQUE7QUFVekM7O0dBRUc7QUFDSCxTQUFTLFlBQVksQ0FBQyxRQUFnQjtJQUNwQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO0lBQ2xELElBQUksSUFBSSxLQUFLLFdBQVc7UUFBRSxPQUFPLFFBQVEsQ0FBQTtJQUN6QyxJQUFJLElBQUksS0FBSyx5QkFBeUI7UUFBRSxPQUFPLFNBQVMsQ0FBQTtJQUN4RCxPQUFPLGFBQWEsQ0FBQTtBQUN0QixDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLGFBQWE7SUFDcEIsT0FBTztRQUNMLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFO1FBQ2pELEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO1FBQ3pDLEVBQUUsTUFBTSxFQUFFLGlDQUFpQyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUU7S0FDakUsQ0FBQTtBQUNILENBQUM7QUFFRDs7R0FFRztBQUNILFNBQVMsZUFBZSxDQUFDLFdBQW1CO0lBQzFDLE1BQU0sYUFBYSxHQUFHO1FBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLHFDQUFxQyxFQUFFLFdBQVcsQ0FBQztRQUM1RSwyQkFBMkI7UUFDM0IsSUFB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QUFNLEVBQUUsTUFBTSxDQUFDLENBQUE7UUFDdkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUN0QixDQUFDO1NBQU0sQ0FBQztRQUNOLE1BQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFBO1FBQ3ZELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUM5RCxXQUFXLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFBO1FBQ2hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxPQUFPLENBQUMsTUFBTSxnQkFBZ0IsT0FBTyxFQUFFLENBQUMsQ0FBQTtRQUNuRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssUUFBUSxDQUFDLE1BQU0sY0FBYyxVQUFVLENBQUMsTUFBTSxhQUFhLENBQUMsQ0FBQTtRQUM3RSxJQUFJLE1BQU0sRUFBRSxDQUFDO1lBQ1gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUE7UUFDbEQsQ0FBQztJQUNILENBQUM7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyB2ZXJzaW9uLCBwYXR0ZXJucywgZ3VhcmFudGVlcyB9IGZyb20gJy4uLy4uL2luZGV4LmpzJ1xuaW1wb3J0IHsgbG9hZENvbmZpZyB9IGZyb20gJy4uL2NvbmZpZy5qcydcbmltcG9ydCB0eXBlIHsgQ2Fub25UZW1wbGF0ZUNvbmZpZyB9IGZyb20gJy4uLy4uL3R5cGVzL2NvbmZpZy5qcydcblxudHlwZSBPdXRwdXRGb3JtYXQgPSAnY3Vyc29ycnVsZXMnIHwgJ2NsYXVkZScgfCAnY29waWxvdCdcblxuaW50ZXJmYWNlIEdlbmVyYXRlT3B0aW9ucyB7XG4gIG91dHB1dDogc3RyaW5nXG4gIGZvcm1hdDogT3V0cHV0Rm9ybWF0XG59XG5cbi8qKlxuICogRGV0ZWN0IG91dHB1dCBmb3JtYXQgZnJvbSBmaWxlbmFtZVxuICovXG5mdW5jdGlvbiBkZXRlY3RGb3JtYXQoZmlsZW5hbWU6IHN0cmluZyk6IE91dHB1dEZvcm1hdCB7XG4gIGNvbnN0IGJhc2UgPSBwYXRoLmJhc2VuYW1lKGZpbGVuYW1lKS50b0xvd2VyQ2FzZSgpXG4gIGlmIChiYXNlID09PSAnY2xhdWRlLm1kJykgcmV0dXJuICdjbGF1ZGUnXG4gIGlmIChiYXNlID09PSAnY29waWxvdC1pbnN0cnVjdGlvbnMubWQnKSByZXR1cm4gJ2NvcGlsb3QnXG4gIHJldHVybiAnY3Vyc29ycnVsZXMnXG59XG5cbi8qKlxuICogR2V0IGFsbCBvdXRwdXQgdGFyZ2V0cyB3aGVuIGdlbmVyYXRpbmcgYWxsIGZpbGVzXG4gKi9cbmZ1bmN0aW9uIGdldEFsbFRhcmdldHMoKTogR2VuZXJhdGVPcHRpb25zW10ge1xuICByZXR1cm4gW1xuICAgIHsgb3V0cHV0OiAnLmN1cnNvcnJ1bGVzJywgZm9ybWF0OiAnY3Vyc29ycnVsZXMnIH0sXG4gICAgeyBvdXRwdXQ6ICdDTEFVREUubWQnLCBmb3JtYXQ6ICdjbGF1ZGUnIH0sXG4gICAgeyBvdXRwdXQ6ICcuZ2l0aHViL2NvcGlsb3QtaW5zdHJ1Y3Rpb25zLm1kJywgZm9ybWF0OiAnY29waWxvdCcgfSxcbiAgXVxufVxuXG4vKipcbiAqIFJlYWQgYSBwYXR0ZXJuIG1hcmtkb3duIGZpbGUgYW5kIGV4dHJhY3Qgc2VjdGlvbnNcbiAqL1xuZnVuY3Rpb24gcmVhZFBhdHRlcm5GaWxlKHBhdHRlcm5GaWxlOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3QgcG9zc2libGVQYXRocyA9IFtcbiAgICBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ25vZGVfbW9kdWxlcy9AZ2FsbG9wLnNvZnR3YXJlL2Nhbm9uJywgcGF0dGVybkZpbGUpLFxuICAgIC8vIEZhbGxiYWNrIGZvciBkZXZlbG9wbWVudFxuICAgIHBhdGguam9pbihpbXBvcnQubWV0YS5kaXJuYW1lLCAnLi4vLi4vLi4vJywgcGF0dGVybkZpbGUpLFxuICBdXG5cbiAgZm9yIChjb25zdCBmaWxlUGF0aCBvZiBwb3NzaWJsZVBhdGhzKSB7XG4gICAgaWYgKGZzLmV4aXN0c1N5bmMoZmlsZVBhdGgpKSB7XG4gICAgICByZXR1cm4gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoLCAndXRmLTgnKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsXG59XG5cbi8qKlxuICogRXh0cmFjdCBleGFtcGxlcyBmcm9tIHBhdHRlcm4gbWFya2Rvd25cbiAqL1xuZnVuY3Rpb24gZXh0cmFjdEV4YW1wbGVzKGNvbnRlbnQ6IHN0cmluZyk6IHsgZ29vZDogc3RyaW5nW107IGJhZDogc3RyaW5nW10gfSB7XG4gIGNvbnN0IGdvb2Q6IHN0cmluZ1tdID0gW11cbiAgY29uc3QgYmFkOiBzdHJpbmdbXSA9IFtdXG5cbiAgY29uc3QgZ29vZE1hdGNoID0gY29udGVudC5tYXRjaCgvIyMjIEdvb2RcXHMqXFxuYGBgW1xcc1xcU10qP2BgYC9nKVxuICBjb25zdCBiYWRNYXRjaCA9IGNvbnRlbnQubWF0Y2goLyMjIyBCYWRcXHMqXFxuYGBgW1xcc1xcU10qP2BgYC9nKVxuXG4gIGlmIChnb29kTWF0Y2gpIHtcbiAgICBmb3IgKGNvbnN0IG1hdGNoIG9mIGdvb2RNYXRjaCkge1xuICAgICAgY29uc3QgY29kZSA9IG1hdGNoLnJlcGxhY2UoLyMjIyBHb29kXFxzKlxcbi8sICcnKS50cmltKClcbiAgICAgIGdvb2QucHVzaChjb2RlKVxuICAgIH1cbiAgfVxuXG4gIGlmIChiYWRNYXRjaCkge1xuICAgIGZvciAoY29uc3QgbWF0Y2ggb2YgYmFkTWF0Y2gpIHtcbiAgICAgIGNvbnN0IGNvZGUgPSBtYXRjaC5yZXBsYWNlKC8jIyMgQmFkXFxzKlxcbi8sICcnKS50cmltKClcbiAgICAgIGJhZC5wdXNoKGNvZGUpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHsgZ29vZCwgYmFkIH1cbn1cblxuLy8g4pSA4pSA4pSAIFNoYXJlZCBzZWN0aW9uIGdlbmVyYXRvcnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbmZ1bmN0aW9uIGdlbmVyYXRlSGVhZGVyKGZvcm1hdDogT3V0cHV0Rm9ybWF0KTogc3RyaW5nW10ge1xuICBjb25zdCBsaW5lczogc3RyaW5nW10gPSBbXVxuXG4gIGlmIChmb3JtYXQgPT09ICdjbGF1ZGUnKSB7XG4gICAgbGluZXMucHVzaChgIyBDTEFVREUubWQg4oCUIFByb2plY3QtU3BlY2lmaWMgSW50ZWxsaWdlbmNlYClcbiAgICBsaW5lcy5wdXNoKCcnKVxuICAgIGxpbmVzLnB1c2goYD4gQXV0by1nZW5lcmF0ZWQgZnJvbSBHYWxsb3AgQ2Fub24gdiR7dmVyc2lvbn0uIERvIG5vdCBlZGl0IG1hbnVhbGx5LmApXG4gICAgbGluZXMucHVzaChgPiBSZWdlbmVyYXRlIHdpdGg6IG5wbSBydW4gZ2VuZXJhdGU6YWktcnVsZXNgKVxuICB9IGVsc2UgaWYgKGZvcm1hdCA9PT0gJ2NvcGlsb3QnKSB7XG4gICAgbGluZXMucHVzaChgIyBHYWxsb3AgQ2Fub24gdiR7dmVyc2lvbn0gLSBDb3BpbG90IEluc3RydWN0aW9uc2ApXG4gICAgbGluZXMucHVzaCgnJylcbiAgICBsaW5lcy5wdXNoKCdUaGlzIGZpbGUgaXMgYXV0by1nZW5lcmF0ZWQgZnJvbSBAZ2FsbG9wLnNvZnR3YXJlL2Nhbm9uLiBEbyBub3QgZWRpdCBtYW51YWxseS4nKVxuICAgIGxpbmVzLnB1c2goJ1JlZ2VuZXJhdGUgd2l0aDogbnBtIHJ1biBnZW5lcmF0ZTphaS1ydWxlcycpXG4gIH0gZWxzZSB7XG4gICAgbGluZXMucHVzaChgIyBHYWxsb3AgQ2Fub24gdiR7dmVyc2lvbn0gLSBBSSBSdWxlc2ApXG4gICAgbGluZXMucHVzaCgnJylcbiAgICBsaW5lcy5wdXNoKCdUaGlzIGZpbGUgaXMgYXV0by1nZW5lcmF0ZWQgZnJvbSBAZ2FsbG9wLnNvZnR3YXJlL2Nhbm9uLiBEbyBub3QgZWRpdCBtYW51YWxseS4nKVxuICAgIGxpbmVzLnB1c2goJ1JlZ2VuZXJhdGUgd2l0aDogbnBtIHJ1biBnZW5lcmF0ZTphaS1ydWxlcycpXG4gIH1cblxuICBsaW5lcy5wdXNoKCcnKVxuICByZXR1cm4gbGluZXNcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVUZWNoU3RhY2soKTogc3RyaW5nW10ge1xuICByZXR1cm4gW1xuICAgICcjIyBUZWNoIFN0YWNrJyxcbiAgICAnJyxcbiAgICAnLSBOZXh0LmpzIDE2IHdpdGggQXBwIFJvdXRlcicsXG4gICAgJy0gUmVhY3QgMTknLFxuICAgICctIFR5cGVTY3JpcHQnLFxuICAgICctIFRhaWx3aW5kIENTUyB2NCcsXG4gICAgJy0gY2xzeCBmb3IgY29uZGl0aW9uYWwgY2xhc3MgbmFtZXMnLFxuICAgICcnLFxuICBdXG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlRW5mb3JjZWRQYXR0ZXJucyhmb3JtYXQ6IE91dHB1dEZvcm1hdCk6IHN0cmluZ1tdIHtcbiAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gW11cbiAgY29uc3QgZW5mb3JjZWRQYXR0ZXJucyA9IHBhdHRlcm5zLmZpbHRlcihwID0+IHAuZW5mb3JjZW1lbnQgPT09ICdlc2xpbnQnICYmIHAucnVsZSlcblxuICBsaW5lcy5wdXNoKCcjIyBFbmZvcmNlZCBQYXR0ZXJucyAoRVNMaW50KScpXG4gIGxpbmVzLnB1c2goJycpXG4gIGxpbmVzLnB1c2goJ1RoZXNlIHBhdHRlcm5zIGFyZSBlbmZvcmNlZCBieSBgQGdhbGxvcC5zb2Z0d2FyZS9jYW5vbi9lc2xpbnRgLiBWaW9sYXRpb25zIHdpbGwgYmUgZmxhZ2dlZC4nKVxuICBsaW5lcy5wdXNoKCcnKVxuXG4gIGlmIChmb3JtYXQgPT09ICdjbGF1ZGUnKSB7XG4gICAgLy8gQ2xhdWRlIGNhbiBydW4gbGludCDigJQgYnJpZWYgbGlzdCB3aXRoIHJ1bGUgbmFtZXNcbiAgICBmb3IgKGNvbnN0IHBhdHRlcm4gb2YgZW5mb3JjZWRQYXR0ZXJucykge1xuICAgICAgbGluZXMucHVzaChgLSAqKiR7cGF0dGVybi5pZH06ICR7cGF0dGVybi50aXRsZX0qKiDigJQgXFxgJHtwYXR0ZXJuLnJ1bGV9XFxgIOKAlCAke3BhdHRlcm4uc3VtbWFyeX1gKVxuICAgIH1cbiAgICBsaW5lcy5wdXNoKCcnKVxuICB9IGVsc2Uge1xuICAgIC8vIEN1cnNvcnJ1bGVzIGFuZCBDb3BpbG90OiBmdWxsIGV4YW1wbGVzXG4gICAgZm9yIChjb25zdCBwYXR0ZXJuIG9mIGVuZm9yY2VkUGF0dGVybnMpIHtcbiAgICAgIGxpbmVzLnB1c2goYCMjIyAke3BhdHRlcm4uaWR9OiAke3BhdHRlcm4udGl0bGV9YClcbiAgICAgIGxpbmVzLnB1c2goJycpXG4gICAgICBsaW5lcy5wdXNoKHBhdHRlcm4uc3VtbWFyeSlcbiAgICAgIGxpbmVzLnB1c2goJycpXG4gICAgICBsaW5lcy5wdXNoKGAtICoqRVNMaW50IFJ1bGU6KiogXFxgJHtwYXR0ZXJuLnJ1bGV9XFxgYClcbiAgICAgIGxpbmVzLnB1c2goYC0gKipDYXRlZ29yeToqKiAke3BhdHRlcm4uY2F0ZWdvcnl9YClcbiAgICAgIGxpbmVzLnB1c2goJycpXG5cbiAgICAgIGlmIChmb3JtYXQgPT09ICdjdXJzb3JydWxlcycpIHtcbiAgICAgICAgY29uc3QgY29udGVudCA9IHJlYWRQYXR0ZXJuRmlsZShwYXR0ZXJuLmZpbGUpXG4gICAgICAgIGlmIChjb250ZW50KSB7XG4gICAgICAgICAgY29uc3QgeyBnb29kLCBiYWQgfSA9IGV4dHJhY3RFeGFtcGxlcyhjb250ZW50KVxuICAgICAgICAgIGlmIChiYWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbGluZXMucHVzaCgnKipCYWQ6KionKVxuICAgICAgICAgICAgbGluZXMucHVzaCgnJylcbiAgICAgICAgICAgIGxpbmVzLnB1c2goYmFkWzBdKVxuICAgICAgICAgICAgbGluZXMucHVzaCgnJylcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGdvb2QubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbGluZXMucHVzaCgnKipHb29kOioqJylcbiAgICAgICAgICAgIGxpbmVzLnB1c2goJycpXG4gICAgICAgICAgICBsaW5lcy5wdXNoKGdvb2RbMF0pXG4gICAgICAgICAgICBsaW5lcy5wdXNoKCcnKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBsaW5lc1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZURvY1BhdHRlcm5zKCk6IHN0cmluZ1tdIHtcbiAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gW11cbiAgY29uc3QgZG9jUGF0dGVybnMgPSBwYXR0ZXJucy5maWx0ZXIocCA9PiBwLmVuZm9yY2VtZW50ID09PSAnZG9jdW1lbnRhdGlvbicpXG5cbiAgbGluZXMucHVzaCgnIyMgRG9jdW1lbnRhdGlvbiBQYXR0ZXJucycpXG4gIGxpbmVzLnB1c2goJycpXG4gIGxpbmVzLnB1c2goJ1RoZXNlIHBhdHRlcm5zIGFyZSBub3QgZW5mb3JjZWQgYnkgRVNMaW50IGJ1dCBzaG91bGQgYmUgZm9sbG93ZWQuJylcbiAgbGluZXMucHVzaCgnJylcblxuICBmb3IgKGNvbnN0IHBhdHRlcm4gb2YgZG9jUGF0dGVybnMpIHtcbiAgICBsaW5lcy5wdXNoKGAjIyMgJHtwYXR0ZXJuLmlkfTogJHtwYXR0ZXJuLnRpdGxlfWApXG4gICAgbGluZXMucHVzaCgnJylcbiAgICBsaW5lcy5wdXNoKHBhdHRlcm4uc3VtbWFyeSlcbiAgICBsaW5lcy5wdXNoKCcnKVxuICB9XG5cbiAgcmV0dXJuIGxpbmVzXG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlR3VhcmFudGVlcygpOiBzdHJpbmdbXSB7XG4gIGNvbnN0IGxpbmVzOiBzdHJpbmdbXSA9IFtdXG5cbiAgbGluZXMucHVzaCgnIyMgQ2Fub24gR3VhcmFudGVlcycpXG4gIGxpbmVzLnB1c2goJycpXG4gIGxpbmVzLnB1c2goJ0ZvbGxvd2luZyB0aGVzZSBwYXR0ZXJucyBwcm92aWRlcyB0aGVzZSBndWFyYW50ZWVzOicpXG4gIGxpbmVzLnB1c2goJycpXG5cbiAgZm9yIChjb25zdCBndWFyYW50ZWUgb2YgZ3VhcmFudGVlcykge1xuICAgIGxpbmVzLnB1c2goYC0gKioke2d1YXJhbnRlZS5uYW1lfSoqICgke2d1YXJhbnRlZS5pZH0pOiBQYXR0ZXJucyAke2d1YXJhbnRlZS5wYXR0ZXJucy5qb2luKCcsICcpfWApXG4gIH1cbiAgbGluZXMucHVzaCgnJylcblxuICByZXR1cm4gbGluZXNcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVDb21wb25lbnRSZWZlcmVuY2UoY29uZmlnOiBDYW5vblRlbXBsYXRlQ29uZmlnIHwgbnVsbCk6IHN0cmluZ1tdIHtcbiAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gW11cblxuICBsaW5lcy5wdXNoKCcjIyBDb21wb25lbnQgUXVpY2sgUmVmZXJlbmNlJylcbiAgbGluZXMucHVzaCgnJylcblxuICBpZiAoY29uZmlnPy5jb21wb25lbnRzPy5sZW5ndGgpIHtcbiAgICBmb3IgKGNvbnN0IGNvbXAgb2YgY29uZmlnLmNvbXBvbmVudHMpIHtcbiAgICAgIGNvbnN0IHByb3BzU3RyID0gY29tcC5wcm9wcz8ubGVuZ3RoID8gYCAtIHByb3BzOiAke2NvbXAucHJvcHMubWFwKHAgPT4gYFxcYCR7cH1cXGBgKS5qb2luKCcsICcpfWAgOiAnJ1xuICAgICAgY29uc3Qgbm90ZVN0ciA9IGNvbXAubm90ZXMgPyBgICgke2NvbXAubm90ZXN9KWAgOiAnJ1xuICAgICAgbGluZXMucHVzaChgLSBcXGAke2NvbXAubmFtZX1cXGAke3Byb3BzU3RyfSR7bm90ZVN0cn1gKVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogaGFyZGNvZGVkIGNvbXBvbmVudCBsaXN0XG4gICAgbGluZXMucHVzaCgnIyMjIFR5cG9ncmFwaHknKVxuICAgIGxpbmVzLnB1c2goJy0gYEhlYWRpbmdgIC0gcHJvcHM6IGBhc2AsIGBjb2xvcmAsIGBtYXJnaW5gLCBgZm9udFNpemVgLCBgZm9udFdlaWdodGAsIGB0ZXh0QWxpZ25gJylcbiAgICBsaW5lcy5wdXNoKCctIGBQYXJhZ3JhcGhgIC0gcHJvcHM6IGBjb2xvcmAsIGBtYXJnaW5gLCBgZm9udFNpemVgLCBgbGluZUhlaWdodGAsIGB0ZXh0QWxpZ25gJylcbiAgICBsaW5lcy5wdXNoKCctIGBTcGFuYCAtIHByb3BzOiBgY29sb3JgLCBgbWFyZ2luYCwgYGZvbnRTaXplYCAoaW5saW5lIHRleHQsIG1iLTAgZGVmYXVsdCknKVxuICAgIGxpbmVzLnB1c2goJy0gYExhYmVsYCAtIHByb3BzOiBgY29sb3JgLCBgbWFyZ2luYCwgYGZvbnRTaXplYCwgYGZvbnRXZWlnaHRgLCBgdGV4dEFsaWduYCcpXG4gICAgbGluZXMucHVzaCgnLSBgUXVvdGVgIC0gcHJvcHM6IGB2YXJpYW50YCwgYGNvbG9yYCwgYG1hcmdpbmAsIGBmb250U2l6ZWAsIGBmb250V2VpZ2h0YCwgYHRleHRBbGlnbmAnKVxuICAgIGxpbmVzLnB1c2goJycpXG4gICAgbGluZXMucHVzaCgnIyMjIExheW91dCcpXG4gICAgbGluZXMucHVzaCgnLSBgU2VjdGlvbmAgLSBzZW1hbnRpYyBzZWN0aW9uIHdyYXBwZXInKVxuICAgIGxpbmVzLnB1c2goJy0gYENvbHVtbnNgIC0gZ3JpZCBsYXlvdXQsIHByb3BzOiBgY29sc2AsIGBnYXBgLCBgYWxpZ25gJylcbiAgICBsaW5lcy5wdXNoKCctIGBDb2x1bW5gIC0gY29sdW1uIGNoaWxkJylcbiAgICBsaW5lcy5wdXNoKCcnKVxuICAgIGxpbmVzLnB1c2goJyMjIyBJbnRlcmFjdGl2ZScpXG4gICAgbGluZXMucHVzaCgnLSBgQnV0dG9uYCAtIHByb3BzOiBgaHJlZmAsIGB2YXJpYW50YCwgYGljb25gLCBgaWNvblBsYWNlbWVudGAsIGBtYXJnaW5gJylcbiAgICBsaW5lcy5wdXNoKCctIGBJY29uYCAtIEljb25pZnkgaWNvbiB3cmFwcGVyJylcbiAgfVxuXG4gIGxpbmVzLnB1c2goJycpXG4gIHJldHVybiBsaW5lc1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZURvTm90U2VjdGlvbihjb25maWc6IENhbm9uVGVtcGxhdGVDb25maWcgfCBudWxsKTogc3RyaW5nW10ge1xuICBjb25zdCBsaW5lczogc3RyaW5nW10gPSBbXVxuXG4gIGxpbmVzLnB1c2goJyMjIERvIE5PVCcpXG4gIGxpbmVzLnB1c2goJycpXG5cbiAgLy8gRGVmYXVsdCBydWxlcyBhbHdheXMgcHJlc2VudFxuICBsaW5lcy5wdXNoKFwiLSBVc2UgYCd1c2UgY2xpZW50J2AgaW4gYmxvY2tzIC0gZXh0cmFjdCB0byBjb21wb25lbnRzXCIpXG4gIGxpbmVzLnB1c2goJy0gVXNlIHJhdyBgPHA+YCwgYDxzcGFuPmAsIG9yIGA8aDE+YOKAk2A8aDY+YCAtIHVzZSBQYXJhZ3JhcGgvU3Bhbi9IZWFkaW5nIGNvbXBvbmVudHMnKVxuICBsaW5lcy5wdXNoKCctIFVzZSBjbGFzc05hbWUgZm9yIG1hcmdpbi9jb2xvci9mb250U2l6ZSB3aGVuIGNvbXBvbmVudCBoYXMgcHJvcHMnKVxuICBsaW5lcy5wdXNoKCctIFVzZSBDb250YWluZXIgaW5zaWRlIFNlY3Rpb24gLSBTZWN0aW9uIGFscmVhZHkgcHJvdmlkZXMgY29udGFpbm1lbnQnKVxuICBsaW5lcy5wdXNoKCctIFVzZSBgY2xhc3NuYW1lc2AgcGFja2FnZSAtIHVzZSBgY2xzeGAgaW5zdGVhZCcpXG4gIGxpbmVzLnB1c2goJy0gVXNlIGlubGluZSBzdHlsZXMgZm9yIGhvdmVyIHN0YXRlcyAtIHVzZSBUYWlsd2luZCBjbGFzc2VzJylcbiAgbGluZXMucHVzaCgnLSBVc2UgbmF0aXZlIGBJbnRlcnNlY3Rpb25PYnNlcnZlcmAgLSB1c2UgYHJlYWN0LWludGVyc2VjdGlvbi1vYnNlcnZlcmAgcGFja2FnZScpXG4gIGxpbmVzLnB1c2goJy0gVXNlIGlubGluZSBgPHN2Zz5gIGluIGJsb2NrcyAtIHVzZSB0aGUgSWNvbiBjb21wb25lbnQgd2l0aCBJY29uaWZ5IGljb25zJylcbiAgbGluZXMucHVzaCgnLSBVc2UgZGVlcCByZWxhdGl2ZSBpbXBvcnRzIChgLi4vLi4vYCkgLSB1c2UgYEAvYCBhbGlhcyBpbXBvcnRzJylcblxuICAvLyBUZW1wbGF0ZS1zcGVjaWZpYyBydWxlc1xuICBpZiAoY29uZmlnPy5ydWxlcykge1xuICAgIGZvciAoY29uc3QgcnVsZSBvZiBjb25maWcucnVsZXMpIHtcbiAgICAgIGlmIChydWxlLnR5cGUgPT09ICdkb05vdCcpIHtcbiAgICAgICAgbGluZXMucHVzaChgLSAke3J1bGUucnVsZX1gKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGxpbmVzLnB1c2goJycpXG4gIHJldHVybiBsaW5lc1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZUZpbGVBdXRob3JpdHkoKTogc3RyaW5nW10ge1xuICBjb25zdCBsaW5lczogc3RyaW5nW10gPSBbXVxuXG4gIGxpbmVzLnB1c2goJyMjIEZpbGUgJiBGb2xkZXIgQXV0aG9yaXR5JylcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnVGhlc2UgcnVsZXMgZ292ZXJuIHdoYXQgQUkgaXMgYWxsb3dlZCBhbmQgZm9yYmlkZGVuIHRvIGRvIHdoZW4gY3JlYXRpbmcsIG1vdmluZywgb3IgbW9kaWZ5aW5nIGZpbGVzIGFuZCBmb2xkZXJzLicpXG4gIGxpbmVzLnB1c2goJycpXG5cbiAgbGluZXMucHVzaCgnIyMjIERlZmluZWQgYC9zcmNgIFN0cnVjdHVyZScpXG4gIGxpbmVzLnB1c2goJycpXG4gIGxpbmVzLnB1c2goJ2BgYCcpXG4gIGxpbmVzLnB1c2goJ3NyYy8nKVxuICBsaW5lcy5wdXNoKCfilJzilIDilIAgYXBwLyAgICAgICAgICAjIFJvdXRlcywgbGF5b3V0cywgbWV0YWRhdGEgKE5leHQuanMgQXBwIFJvdXRlciknKVxuICBsaW5lcy5wdXNoKCfilIIgICDilJTilIDilIAge3JvdXRlfS8nKVxuICBsaW5lcy5wdXNoKCfilIIgICAgICAg4pSc4pSA4pSAIHBhZ2UudHN4JylcbiAgbGluZXMucHVzaCgn4pSCICAgICAgIOKUlOKUgOKUgCBfYmxvY2tzLyAgIyBDby1sb2NhdGVkIHBhZ2Utc3BlY2lmaWMgYmxvY2tzJylcbiAgbGluZXMucHVzaCgn4pSc4pSA4pSAIGJsb2cvICAgICAgICAgIyBCbG9nIGNvbnRlbnQgKGFyY2hpdmUgY29udGVudCB0eXBlKScpXG4gIGxpbmVzLnB1c2goJ+KUnOKUgOKUgCBjb21wb25lbnRzLyAgICMgUmV1c2FibGUgVUkgcHJpbWl0aXZlcycpXG4gIGxpbmVzLnB1c2goJ+KUnOKUgOKUgCBob29rcy8gICAgICAgICMgQ3VzdG9tIFJlYWN0IGhvb2tzJylcbiAgbGluZXMucHVzaCgn4pSc4pSA4pSAIHN0eWxlcy8gICAgICAgIyBDU1MsIFRhaWx3aW5kLCBmb250cycpXG4gIGxpbmVzLnB1c2goJ+KUnOKUgOKUgCB0ZW1wbGF0ZS8gICAgICMgVGVtcGxhdGUtbGV2ZWwgY29tcG9uZW50cycpXG4gIGxpbmVzLnB1c2goJ+KUnOKUgOKUgCB0b29scy8gICAgICAgICMgVXRpbGl0eSB0b29scycpXG4gIGxpbmVzLnB1c2goJ+KUnOKUgOKUgCB0eXBlcy8gICAgICAgICMgVHlwZVNjcmlwdCB0eXBlcycpXG4gIGxpbmVzLnB1c2goJ+KUnOKUgOKUgCB1dGlscy8gICAgICAgICMgVXRpbGl0eSBmdW5jdGlvbnMnKVxuICBsaW5lcy5wdXNoKCfilJTilIDilIAgc3RhdGUudHMgICAgICAjIEdsb2JhbCBzdGF0ZScpXG4gIGxpbmVzLnB1c2goJ2BgYCcpXG4gIGxpbmVzLnB1c2goJycpXG5cbiAgbGluZXMucHVzaCgnIyMjIEFwcCBSb3V0ZXIgU3RydWN0dXJlJylcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnUm91dGVzIG11c3QgdXNlIE5leHQuanMgcm91dGUgZ3JvdXBzLiBBdCBtaW5pbXVtLCBgKGRlZmF1bHQpYCBtdXN0IGV4aXN0OicpXG4gIGxpbmVzLnB1c2goJycpXG4gIGxpbmVzLnB1c2goJ2BgYCcpXG4gIGxpbmVzLnB1c2goJ3NyYy9hcHAvJylcbiAgbGluZXMucHVzaCgn4pSc4pSA4pSAIChkZWZhdWx0KS8gICAgICAgICMgUmVxdWlyZWQgLSBkZWZhdWx0IGxheW91dCBncm91cCcpXG4gIGxpbmVzLnB1c2goJ+KUgiAgIOKUnOKUgOKUgCBsYXlvdXQudHN4JylcbiAgbGluZXMucHVzaCgn4pSCICAg4pSU4pSA4pSAIHtyb3V0ZXN9LycpXG4gIGxpbmVzLnB1c2goJ+KUnOKUgOKUgCAoaGVybykvICAgICAgICAgICAjIE9wdGlvbmFsIC0gaGVybyBsYXlvdXQgdmFyaWFudCcpXG4gIGxpbmVzLnB1c2goJ+KUnOKUgOKUgCBhcGkvICAgICAgICAgICAgICAjIEFQSSByb3V0ZXMgKGV4Y2VwdGlvbiAtIG5vIGdyb3VwaW5nKScpXG4gIGxpbmVzLnB1c2goJ+KUnOKUgOKUgCBsYXlvdXQudHN4ICAgICAgICAjIFJvb3QgbGF5b3V0JylcbiAgbGluZXMucHVzaCgn4pSU4pSA4pSAIG1ldGFkYXRhLnRzeCAgICAgICMgU2hhcmVkIG1ldGFkYXRhJylcbiAgbGluZXMucHVzaCgnYGBgJylcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnLSBBbGwgcGFnZSByb3V0ZXMgbXVzdCBiZSBpbnNpZGUgYSByb3V0ZSBncm91cCAocGFyZW50aGVzZXMgZm9sZGVyKScpXG4gIGxpbmVzLnB1c2goJy0gTmV2ZXIgY3JlYXRlIHJvdXRlcyBkaXJlY3RseSB1bmRlciBgc3JjL2FwcC9gIChleGNlcHQgYGFwaS9gLCByb290IGZpbGVzKScpXG4gIGxpbmVzLnB1c2goJy0gTmV3IHJvdXRlIGdyb3VwcyBhcmUgYWxsb3dlZCBmcmVlbHkgd2hlbiBhIG5ldyBsYXlvdXQgdmFyaWFudCBpcyBuZWVkZWQnKVxuICBsaW5lcy5wdXNoKCcnKVxuXG4gIGxpbmVzLnB1c2goJyMjIyBGaWxlIFN0cnVjdHVyZSBSdWxlcycpXG4gIGxpbmVzLnB1c2goJycpXG4gIGxpbmVzLnB1c2goJyoqQmxvY2tzOioqJylcbiAgbGluZXMucHVzaCgnLSBDby1sb2NhdGVkIGluIGBfYmxvY2tzL2Agc3ViZGlyZWN0b3JpZXMgYWxvbmdzaWRlIGVhY2ggcGFnZSByb3V0ZScpXG4gIGxpbmVzLnB1c2goJy0gU2luZ2xldG9uIG5hbWluZzogYGhlcm8udHN4YCAob25lIHBlciBwYWdlKSwgbnVtYmVyZWQgd2hlbiBtdWx0aXBsZTogYGNvbnRlbnQtMi50c3hgLCBgY29udGVudC0zLnRzeGAnKVxuICBsaW5lcy5wdXNoKCctIEltcG9ydCB3aXRoIHJlbGF0aXZlIHBhdGhzOiBgaW1wb3J0IEhlcm8gZnJvbSBcXCcuL19ibG9ja3MvaGVyb1xcJ2AnKVxuICBsaW5lcy5wdXNoKCctIEV4YW1wbGU6IGBzcmMvYXBwLyhkZWZhdWx0KS9mdXJuaXR1cmUvX2Jsb2Nrcy9oZXJvLnRzeGAnKVxuICBsaW5lcy5wdXNoKCcnKVxuICBsaW5lcy5wdXNoKCcqKkNvbXBvbmVudHM6KionKVxuICBsaW5lcy5wdXNoKCctIFNpbXBsZSBjb21wb25lbnRzOiBTaW5nbGUgZmlsZSBpbiBgc3JjL2NvbXBvbmVudHMvYCcpXG4gIGxpbmVzLnB1c2goJy0gQ29tcGxleCBjb21wb25lbnRzOiBGb2xkZXIgd2l0aCBgaW5kZXgudHN4YCcpXG4gIGxpbmVzLnB1c2goJy0gVXNlIGZvbGRlcnMgd2hlbiBjb21wb25lbnQgaGFzIG11bHRpcGxlIHN1Yi1maWxlcycpXG4gIGxpbmVzLnB1c2goJycpXG5cbiAgbGluZXMucHVzaCgnIyMjIERPIC0gV2hhdCBBSSBJUyBBbGxvd2VkIFRvIERvJylcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnLSBDcmVhdGUgZmlsZXMgb25seSBpbnNpZGUgZXhpc3RpbmcgQ2Fub24tZGVmaW5lZCB6b25lcycpXG4gIGxpbmVzLnB1c2goJy0gUGxhY2UgbmV3IGZpbGVzIGluIHRoZSB6b25lIHRoYXQgbWF0Y2hlcyB0aGVpciBhcmNoaXRlY3R1cmFsIHJvbGUnKVxuICBsaW5lcy5wdXNoKCctIEZvbGxvdyBleGlzdGluZyBmb2xkZXIgY29udmVudGlvbnMgd2l0aGluIGEgem9uZScpXG4gIGxpbmVzLnB1c2goJy0gUmV1c2UgZXhpc3RpbmcgZm9sZGVycyB3aGVuIHBvc3NpYmxlJylcbiAgbGluZXMucHVzaCgnLSBDcmVhdGUgbmV3IHJvdXRlIGdyb3VwcyBpbiBgc3JjL2FwcC9gIHdoZW4gbmV3IGxheW91dHMgYXJlIG5lZWRlZCcpXG4gIGxpbmVzLnB1c2goJy0gQ3JlYXRlIG5ldyBhcmNoaXZlIGNvbnRlbnQgZm9sZGVycyAobGlrZSBgYmxvZy9gLCBgcG9ydGZvbGlvL2ApIGluIGAvc3JjYCcpXG4gIGxpbmVzLnB1c2goJy0gQ3JlYXRlIGRvdGZpbGVzL2RpcmVjdG9yaWVzIGF0IHByb2plY3Qgcm9vdCAoYC5naXRodWIvYCwgYC5jdXJzb3IvYCwgZXRjLiknKVxuICBsaW5lcy5wdXNoKCctIEFzayBmb3IgY29uZmlybWF0aW9uIGlmIHRoZSBjb3JyZWN0IHpvbmUgaXMgYW1iaWd1b3VzJylcbiAgbGluZXMucHVzaCgnJylcblxuICBsaW5lcy5wdXNoKCcjIyMgRE8gTk9UIC0gV2hhdCBBSSBJcyBGb3JiaWRkZW4gVG8gRG8nKVxuICBsaW5lcy5wdXNoKCcnKVxuICBsaW5lcy5wdXNoKCctIENyZWF0ZSBuZXcgdG9wLWxldmVsIGRpcmVjdG9yaWVzIChleGNlcHQgZG90ZmlsZXMpJylcbiAgbGluZXMucHVzaCgnLSBDcmVhdGUgbmV3IGZvbGRlcnMgaW4gYC9zcmNgIChleGNlcHQgYXJjaGl2ZSBjb250ZW50IG9yIHJvdXRlIGdyb3VwcyknKVxuICBsaW5lcy5wdXNoKCctIFBsYWNlIGZpbGVzIG91dHNpZGUgQ2Fub24tZGVmaW5lZCB6b25lcycpXG4gIGxpbmVzLnB1c2goJy0gTWl4IHJlc3BvbnNpYmlsaXRpZXMgYWNyb3NzIHpvbmVzIChjb21wb25lbnRzIGltcG9ydGluZyBibG9ja3MsIGV0Yy4pJylcbiAgbGluZXMucHVzaCgnLSBSZW9yZ2FuaXplIG9yIG1vdmUgZm9sZGVycyB3aXRob3V0IGV4cGxpY2l0IGluc3RydWN0aW9uJylcbiAgbGluZXMucHVzaCgnLSBJbnZlbnQgbmV3IG9yZ2FuaXphdGlvbmFsIGNvbnZlbnRpb25zJylcbiAgbGluZXMucHVzaCgnLSBDcmVhdGUgcGxhY2Vob2xkZXIgb3Igc3BlY3VsYXRpdmUgZmlsZXMnKVxuICBsaW5lcy5wdXNoKCctIEltcG9ydCBmcm9tIGBfc2NyaXB0cy9gIG9yIGBfZGF0YS9gIGluIHJ1bnRpbWUgY29kZScpXG4gIGxpbmVzLnB1c2goJy0gTWFudWFsbHkgZWRpdCBmaWxlcyBpbiBgX2RhdGEvYCAoZ2VuZXJhdGVkIG9ubHkpJylcbiAgbGluZXMucHVzaCgnJylcblxuICByZXR1cm4gbGluZXNcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVWZXJpZmljYXRpb24oY29uZmlnOiBDYW5vblRlbXBsYXRlQ29uZmlnIHwgbnVsbCk6IHN0cmluZ1tdIHtcbiAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gW11cblxuICBsaW5lcy5wdXNoKCcjIyBQb3N0LUVkaXQgVmVyaWZpY2F0aW9uJylcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnQWZ0ZXIgZWRpdGluZyBmaWxlczonKVxuXG4gIGlmIChjb25maWc/LnZlcmlmaWNhdGlvbj8ubGVuZ3RoKSB7XG4gICAgbGV0IHN0ZXAgPSAxXG4gICAgZm9yIChjb25zdCBjbWQgb2YgY29uZmlnLnZlcmlmaWNhdGlvbikge1xuICAgICAgbGluZXMucHVzaChgJHtzdGVwfS4gUnVuIFxcYCR7Y21kfVxcYGApXG4gICAgICBzdGVwKytcbiAgICB9XG4gICAgbGluZXMucHVzaChgJHtzdGVwfS4gRml4IGFueSB2aW9sYXRpb25zIGJlZm9yZSBjb21taXR0aW5nYClcbiAgfSBlbHNlIHtcbiAgICBsaW5lcy5wdXNoKCcxLiBSdW4gYG5wbSBydW4gbGludGAgdG8gY2hlY2sgZm9yIGVycm9ycycpXG4gICAgbGluZXMucHVzaCgnMi4gRml4IGFueSB2aW9sYXRpb25zIGJlZm9yZSBjb21taXR0aW5nJylcbiAgfVxuXG4gIGxpbmVzLnB1c2goJycpXG4gIGxpbmVzLnB1c2goJ05vdGU6IE9ubHkgbGludCBmaWxlcyB5b3UgZWRpdGVkLCBub3QgdGhlIGVudGlyZSBjb2RlYmFzZS4nKVxuICBsaW5lcy5wdXNoKCcnKVxuXG4gIHJldHVybiBsaW5lc1xufVxuXG4vLyDilIDilIDilIAgQ2xhdWRlLXNwZWNpZmljIHNlY3Rpb25zIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5mdW5jdGlvbiBnZW5lcmF0ZUF1dG9HZW5GaWxlcyhjb25maWc6IENhbm9uVGVtcGxhdGVDb25maWcgfCBudWxsKTogc3RyaW5nW10ge1xuICBpZiAoIWNvbmZpZz8uZ2VuZXJhdGVkRmlsZXM/Lmxlbmd0aCkgcmV0dXJuIFtdXG5cbiAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gW11cblxuICBsaW5lcy5wdXNoKCcjIyBBdXRvLUdlbmVyYXRlZCBGaWxlcyDigJQgTmV2ZXIgRWRpdCBNYW51YWxseScpXG4gIGxpbmVzLnB1c2goJycpXG4gIGxpbmVzLnB1c2goJ3wgRmlsZSB8IFJlZ2VuZXJhdGUgV2l0aCB8IFRyaWdnZXJlZCBCeSB8JylcbiAgbGluZXMucHVzaCgnfC0tLXwtLS18LS0tfCcpXG5cbiAgZm9yIChjb25zdCBmaWxlIG9mIGNvbmZpZy5nZW5lcmF0ZWRGaWxlcykge1xuICAgIGxpbmVzLnB1c2goYHwgXFxgJHtmaWxlLnBhdGh9XFxgIHwgXFxgJHtmaWxlLmNvbW1hbmR9XFxgIHwgJHtmaWxlLnRyaWdnZXJ9IHxgKVxuICB9XG5cbiAgbGluZXMucHVzaCgnJylcbiAgcmV0dXJuIGxpbmVzXG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlQnVpbGRDb21tYW5kcyhjb25maWc6IENhbm9uVGVtcGxhdGVDb25maWcgfCBudWxsKTogc3RyaW5nW10ge1xuICBpZiAoIWNvbmZpZz8uYnVpbGRDb21tYW5kcz8ubGVuZ3RoKSByZXR1cm4gW11cblxuICBjb25zdCBsaW5lczogc3RyaW5nW10gPSBbXVxuXG4gIGxpbmVzLnB1c2goJyMjIEJ1aWxkIENvbW1hbmRzJylcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnfCBDb21tYW5kIHwgUHVycG9zZSB8JylcbiAgbGluZXMucHVzaCgnfC0tLXwtLS18JylcblxuICBmb3IgKGNvbnN0IGNtZCBvZiBjb25maWcuYnVpbGRDb21tYW5kcykge1xuICAgIGxpbmVzLnB1c2goYHwgXFxgJHtjbWQuc2NyaXB0fVxcYCB8ICR7Y21kLmRlc2NyaXB0aW9ufSB8YClcbiAgfVxuXG4gIGxpbmVzLnB1c2goJycpXG4gIHJldHVybiBsaW5lc1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZUNvbG9yVG9rZW5zKGNvbmZpZzogQ2Fub25UZW1wbGF0ZUNvbmZpZyB8IG51bGwpOiBzdHJpbmdbXSB7XG4gIGlmICghY29uZmlnPy5jb2xvclRva2VucykgcmV0dXJuIFtdXG5cbiAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gW11cbiAgY29uc3QgY3QgPSBjb25maWcuY29sb3JUb2tlbnNcblxuICBsaW5lcy5wdXNoKCcjIyBDb2xvciBUb2tlbiBTeXN0ZW0nKVxuICBsaW5lcy5wdXNoKCcnKVxuICBsaW5lcy5wdXNoKCdBbGwgY29sb3JzIHVzZSBzZW1hbnRpYyB0b2tlbnMgZGVmaW5lZCBpbiBgc3JjL3N0eWxlcy90YWlsd2luZC5jc3NgIGBAdGhlbWVgOicpXG4gIGxpbmVzLnB1c2goJycpXG5cbiAgaWYgKGN0LnN1cmZhY2U/Lmxlbmd0aCkge1xuICAgIGxpbmVzLnB1c2goYC0gKipTdXJmYWNlKio6ICR7Y3Quc3VyZmFjZS5tYXAocyA9PiBgXFxgJHtzfVxcYGApLmpvaW4oJywgJyl9YClcbiAgfVxuICBpZiAoY3QudGV4dD8ubGVuZ3RoKSB7XG4gICAgbGluZXMucHVzaChgLSAqKlRleHQqKjogJHtjdC50ZXh0Lm1hcChzID0+IGBcXGAke3N9XFxgYCkuam9pbignLCAnKX1gKVxuICB9XG4gIGlmIChjdC5vdmVybGF5Py5sZW5ndGgpIHtcbiAgICBsaW5lcy5wdXNoKGAtICoqT3ZlcmxheSoqIChmaXhlZCDigJQgZG9uJ3QgZmxpcCBpbiBkYXJrIG1vZGUpOiAke2N0Lm92ZXJsYXkubWFwKHMgPT4gYFxcYCR7c31cXGBgKS5qb2luKCcsICcpfWApXG4gIH1cbiAgaWYgKGN0LmFjY2VudHM/Lmxlbmd0aCkge1xuICAgIGxpbmVzLnB1c2goYC0gKipBY2NlbnRzKio6ICR7Y3QuYWNjZW50cy5tYXAocyA9PiBgXFxgJHtzfVxcYGApLmpvaW4oJywgJyl9YClcbiAgfVxuXG4gIGxpbmVzLnB1c2goJycpXG5cbiAgbGluZXMucHVzaCgnKipOZXZlciB1c2UqKjogYGdyYXktKmAsIGB3aGl0ZWAsIGBibGFja2AsIGBzbGF0ZS0qYCDigJQgYWx3YXlzIG1hcCB0byBhIHNlbWFudGljIHRva2VuLicpXG4gIGxpbmVzLnB1c2goJycpXG5cbiAgcmV0dXJuIGxpbmVzXG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlU3RhdGVNYW5hZ2VtZW50KGNvbmZpZzogQ2Fub25UZW1wbGF0ZUNvbmZpZyB8IG51bGwpOiBzdHJpbmdbXSB7XG4gIGlmICghY29uZmlnPy5zdGF0ZSkgcmV0dXJuIFtdXG5cbiAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gW11cbiAgY29uc3Qgc3QgPSBjb25maWcuc3RhdGVcblxuICBsaW5lcy5wdXNoKCcjIyBTdGF0ZSBNYW5hZ2VtZW50JylcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaChgJHtzdC5saWJyYXJ5fSBzdG9yZSBhdCBcXGAke3N0LmZpbGV9XFxgLiBSZWFkIHdpdGggXFxgJHtzdC5yZWFkUGF0dGVybn1cXGAsIHdyaXRlIHdpdGggXFxgJHtzdC53cml0ZVBhdHRlcm59XFxgLmApXG4gIGxpbmVzLnB1c2goJycpXG5cbiAgaWYgKHN0LnByb3BlcnRpZXM/Lmxlbmd0aCkge1xuICAgIGxpbmVzLnB1c2goYEF2YWlsYWJsZSBzdGF0ZTogJHtzdC5wcm9wZXJ0aWVzLm1hcChwID0+IGBcXGAke3B9XFxgYCkuam9pbignLCAnKX0uYClcbiAgICBsaW5lcy5wdXNoKCcnKVxuICB9XG5cbiAgcmV0dXJuIGxpbmVzXG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlVGVtcGxhdGVSdWxlcyhjb25maWc6IENhbm9uVGVtcGxhdGVDb25maWcgfCBudWxsKTogc3RyaW5nW10ge1xuICBpZiAoIWNvbmZpZz8ucnVsZXM/Lmxlbmd0aCkgcmV0dXJuIFtdXG5cbiAgY29uc3QgZG9SdWxlcyA9IGNvbmZpZy5ydWxlcy5maWx0ZXIociA9PiByLnR5cGUgPT09ICdkbycpXG4gIGlmICghZG9SdWxlcy5sZW5ndGgpIHJldHVybiBbXVxuXG4gIGNvbnN0IGxpbmVzOiBzdHJpbmdbXSA9IFtdXG5cbiAgbGluZXMucHVzaCgnIyMgVGVtcGxhdGUtU3BlY2lmaWMgUnVsZXMnKVxuICBsaW5lcy5wdXNoKCcnKVxuXG4gIGZvciAoY29uc3QgcnVsZSBvZiBkb1J1bGVzKSB7XG4gICAgbGluZXMucHVzaChgLSAke3J1bGUucnVsZX1gKVxuICB9XG5cbiAgbGluZXMucHVzaCgnJylcbiAgcmV0dXJuIGxpbmVzXG59XG5cbi8vIOKUgOKUgOKUgCBGb3JtYXQgZ2VuZXJhdG9ycyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuZnVuY3Rpb24gZ2VuZXJhdGVDdXJzb3JydWxlcyhjb25maWc6IENhbm9uVGVtcGxhdGVDb25maWcgfCBudWxsKTogc3RyaW5nIHtcbiAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gW1xuICAgIC4uLmdlbmVyYXRlSGVhZGVyKCdjdXJzb3JydWxlcycpLFxuICAgIC4uLmdlbmVyYXRlVGVjaFN0YWNrKCksXG4gICAgLi4uZ2VuZXJhdGVFbmZvcmNlZFBhdHRlcm5zKCdjdXJzb3JydWxlcycpLFxuICAgIC4uLmdlbmVyYXRlRG9jUGF0dGVybnMoKSxcbiAgICAuLi5nZW5lcmF0ZUd1YXJhbnRlZXMoKSxcbiAgICAuLi5nZW5lcmF0ZUNvbXBvbmVudFJlZmVyZW5jZShjb25maWcpLFxuICAgIC4uLmdlbmVyYXRlRG9Ob3RTZWN0aW9uKGNvbmZpZyksXG4gICAgLi4uZ2VuZXJhdGVGaWxlQXV0aG9yaXR5KCksXG4gICAgLi4uZ2VuZXJhdGVWZXJpZmljYXRpb24oY29uZmlnKSxcbiAgXVxuXG4gIHJldHVybiBsaW5lcy5qb2luKCdcXG4nKVxufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZUNsYXVkZU1kKGNvbmZpZzogQ2Fub25UZW1wbGF0ZUNvbmZpZyB8IG51bGwpOiBzdHJpbmcge1xuICBjb25zdCBsaW5lczogc3RyaW5nW10gPSBbXG4gICAgLi4uZ2VuZXJhdGVIZWFkZXIoJ2NsYXVkZScpLFxuICAgIC4uLmdlbmVyYXRlQXV0b0dlbkZpbGVzKGNvbmZpZyksXG4gICAgLi4uZ2VuZXJhdGVCdWlsZENvbW1hbmRzKGNvbmZpZyksXG4gICAgLi4uZ2VuZXJhdGVFbmZvcmNlZFBhdHRlcm5zKCdjbGF1ZGUnKSxcbiAgICAuLi5nZW5lcmF0ZURvY1BhdHRlcm5zKCksXG4gICAgLi4uZ2VuZXJhdGVDb2xvclRva2Vucyhjb25maWcpLFxuICAgIC4uLmdlbmVyYXRlQ29tcG9uZW50UmVmZXJlbmNlKGNvbmZpZyksXG4gICAgLi4uZ2VuZXJhdGVTdGF0ZU1hbmFnZW1lbnQoY29uZmlnKSxcbiAgICAuLi5nZW5lcmF0ZVRlbXBsYXRlUnVsZXMoY29uZmlnKSxcbiAgICAuLi5nZW5lcmF0ZURvTm90U2VjdGlvbihjb25maWcpLFxuICAgIC4uLmdlbmVyYXRlVmVyaWZpY2F0aW9uKGNvbmZpZyksXG4gIF1cblxuICByZXR1cm4gbGluZXMuam9pbignXFxuJylcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVDb3BpbG90SW5zdHJ1Y3Rpb25zKGNvbmZpZzogQ2Fub25UZW1wbGF0ZUNvbmZpZyB8IG51bGwpOiBzdHJpbmcge1xuICBjb25zdCBsaW5lczogc3RyaW5nW10gPSBbXG4gICAgLi4uZ2VuZXJhdGVIZWFkZXIoJ2NvcGlsb3QnKSxcbiAgICAuLi5nZW5lcmF0ZVRlY2hTdGFjaygpLFxuICAgIC4uLmdlbmVyYXRlRW5mb3JjZWRQYXR0ZXJucygnY29waWxvdCcpLFxuICAgIC4uLmdlbmVyYXRlRG9jUGF0dGVybnMoKSxcbiAgICAuLi5nZW5lcmF0ZUNvbXBvbmVudFJlZmVyZW5jZShjb25maWcpLFxuICAgIC4uLmdlbmVyYXRlRG9Ob3RTZWN0aW9uKGNvbmZpZyksXG4gICAgLi4uZ2VuZXJhdGVWZXJpZmljYXRpb24oY29uZmlnKSxcbiAgXVxuXG4gIHJldHVybiBsaW5lcy5qb2luKCdcXG4nKVxufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZUNvbnRlbnQoZm9ybWF0OiBPdXRwdXRGb3JtYXQsIGNvbmZpZzogQ2Fub25UZW1wbGF0ZUNvbmZpZyB8IG51bGwpOiBzdHJpbmcge1xuICBzd2l0Y2ggKGZvcm1hdCkge1xuICAgIGNhc2UgJ2NsYXVkZSc6XG4gICAgICByZXR1cm4gZ2VuZXJhdGVDbGF1ZGVNZChjb25maWcpXG4gICAgY2FzZSAnY29waWxvdCc6XG4gICAgICByZXR1cm4gZ2VuZXJhdGVDb3BpbG90SW5zdHJ1Y3Rpb25zKGNvbmZpZylcbiAgICBjYXNlICdjdXJzb3JydWxlcyc6XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBnZW5lcmF0ZUN1cnNvcnJ1bGVzKGNvbmZpZylcbiAgfVxufVxuXG5mdW5jdGlvbiB3cml0ZU91dHB1dChjb250ZW50OiBzdHJpbmcsIG91dHB1dFBhdGg6IHN0cmluZyk6IHZvaWQge1xuICBjb25zdCBkaXIgPSBwYXRoLmRpcm5hbWUob3V0cHV0UGF0aClcbiAgaWYgKCFmcy5leGlzdHNTeW5jKGRpcikpIHtcbiAgICBmcy5ta2RpclN5bmMoZGlyLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KVxuICB9XG4gIGZzLndyaXRlRmlsZVN5bmMob3V0cHV0UGF0aCwgY29udGVudCwgJ3V0Zi04Jylcbn1cblxuLy8g4pSA4pSA4pSAIFB1YmxpYyBBUEkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZW5lcmF0ZShvcHRpb25zOiBHZW5lcmF0ZU9wdGlvbnMpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgY29uZmlnID0gbG9hZENvbmZpZygpXG5cbiAgaWYgKG9wdGlvbnMub3V0cHV0ID09PSAnYWxsJykge1xuICAgIC8vIEdlbmVyYXRlIGFsbCB0YXJnZXRzXG4gICAgY29uc3QgdGFyZ2V0cyA9IGdldEFsbFRhcmdldHMoKVxuICAgIGZvciAoY29uc3QgdGFyZ2V0IG9mIHRhcmdldHMpIHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBnZW5lcmF0ZUNvbnRlbnQodGFyZ2V0LmZvcm1hdCwgY29uZmlnKVxuICAgICAgY29uc3Qgb3V0cHV0UGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCB0YXJnZXQub3V0cHV0KVxuICAgICAgd3JpdGVPdXRwdXQoY29udGVudCwgb3V0cHV0UGF0aClcbiAgICAgIGNvbnNvbGUubG9nKGDinJMgR2VuZXJhdGVkICR7dGFyZ2V0Lm91dHB1dH1gKVxuICAgIH1cbiAgICBjb25zb2xlLmxvZyhgICBDYW5vbiB2JHt2ZXJzaW9ufSDigJQgJHtwYXR0ZXJucy5sZW5ndGh9IHBhdHRlcm5zLCAke2d1YXJhbnRlZXMubGVuZ3RofSBndWFyYW50ZWVzYClcbiAgICBpZiAoY29uZmlnKSB7XG4gICAgICBjb25zb2xlLmxvZyhgICBUZW1wbGF0ZSBjb25maWc6ICR7Y29uZmlnLm5hbWV9YClcbiAgICB9XG4gIH0gZWxzZSBpZiAob3B0aW9ucy5vdXRwdXQgPT09ICctJykge1xuICAgIGNvbnN0IGNvbnRlbnQgPSBnZW5lcmF0ZUNvbnRlbnQob3B0aW9ucy5mb3JtYXQsIGNvbmZpZylcbiAgICBjb25zb2xlLmxvZyhjb250ZW50KVxuICB9IGVsc2Uge1xuICAgIGNvbnN0IGNvbnRlbnQgPSBnZW5lcmF0ZUNvbnRlbnQob3B0aW9ucy5mb3JtYXQsIGNvbmZpZylcbiAgICBjb25zdCBvdXRwdXRQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksIG9wdGlvbnMub3V0cHV0KVxuICAgIHdyaXRlT3V0cHV0KGNvbnRlbnQsIG91dHB1dFBhdGgpXG4gICAgY29uc29sZS5sb2coYOKckyBHZW5lcmF0ZWQgJHtvcHRpb25zLm91dHB1dH0gZnJvbSBDYW5vbiB2JHt2ZXJzaW9ufWApXG4gICAgY29uc29sZS5sb2coYCAgJHtwYXR0ZXJucy5sZW5ndGh9IHBhdHRlcm5zLCAke2d1YXJhbnRlZXMubGVuZ3RofSBndWFyYW50ZWVzYClcbiAgICBpZiAoY29uZmlnKSB7XG4gICAgICBjb25zb2xlLmxvZyhgICBUZW1wbGF0ZSBjb25maWc6ICR7Y29uZmlnLm5hbWV9YClcbiAgICB9XG4gIH1cbn1cbiJdfQ==