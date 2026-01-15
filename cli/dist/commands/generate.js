"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = generate;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const canon_1 = require("@gallop/canon");
/**
 * Read a pattern markdown file and extract sections
 */
function readPatternFile(patternFile) {
    // Try to find the canon package patterns directory
    const possiblePaths = [
        path.join(process.cwd(), 'packages/canon', patternFile),
        path.join(process.cwd(), 'node_modules/@gallop/canon', patternFile),
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
    lines.push(`# Gallop Canon v${canon_1.version} - AI Rules`);
    lines.push('');
    lines.push('This file is auto-generated from @gallop/canon. Do not edit manually.');
    lines.push('Regenerate with: npm run generate:ai-rules');
    lines.push('');
    // Tech stack (from speedwell context)
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
    lines.push('These patterns are enforced by `@gallop/eslint-plugin`. Violations will be flagged.');
    lines.push('');
    const enforcedPatterns = canon_1.patterns.filter(p => p.enforcement === 'eslint' && p.rule);
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
    const docPatterns = canon_1.patterns.filter(p => p.enforcement === 'documentation');
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
    for (const guarantee of canon_1.guarantees) {
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
async function generate(options) {
    const content = generateCursorrules();
    if (options.output === '-') {
        // Output to stdout
        console.log(content);
    }
    else {
        // Write to file
        const outputPath = path.resolve(process.cwd(), options.output);
        fs.writeFileSync(outputPath, content, 'utf-8');
        console.log(`✓ Generated ${options.output} from Canon v${canon_1.version}`);
        console.log(`  ${canon_1.patterns.length} patterns, ${canon_1.guarantees.length} guarantees`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvZ2VuZXJhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzTEEsNEJBYUM7QUFuTUQsdUNBQXdCO0FBQ3hCLDJDQUE0QjtBQUM1Qix5Q0FBeUU7QUFPekU7O0dBRUc7QUFDSCxTQUFTLGVBQWUsQ0FBQyxXQUFtQjtJQUMxQyxtREFBbUQ7SUFDbkQsTUFBTSxhQUFhLEdBQUc7UUFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDO1FBQ3ZELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLDRCQUE0QixFQUFFLFdBQVcsQ0FBQztLQUNwRSxDQUFBO0lBRUQsS0FBSyxNQUFNLFFBQVEsSUFBSSxhQUFhLEVBQUUsQ0FBQztRQUNyQyxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztZQUM1QixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBQzNDLENBQUM7SUFDSCxDQUFDO0lBRUQsT0FBTyxJQUFJLENBQUE7QUFDYixDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLGVBQWUsQ0FBQyxPQUFlO0lBQ3RDLE1BQU0sSUFBSSxHQUFhLEVBQUUsQ0FBQTtJQUN6QixNQUFNLEdBQUcsR0FBYSxFQUFFLENBQUE7SUFFeEIseURBQXlEO0lBQ3pELE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQTtJQUMvRCxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUE7SUFFN0QsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUNkLEtBQUssTUFBTSxLQUFLLElBQUksU0FBUyxFQUFFLENBQUM7WUFDOUIsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUE7WUFDdEQsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNqQixDQUFDO0lBQ0gsQ0FBQztJQUVELElBQUksUUFBUSxFQUFFLENBQUM7UUFDYixLQUFLLE1BQU0sS0FBSyxJQUFJLFFBQVEsRUFBRSxDQUFDO1lBQzdCLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBO1lBQ3JELEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDaEIsQ0FBQztJQUNILENBQUM7SUFFRCxPQUFPLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFBO0FBQ3RCLENBQUM7QUFFRDs7R0FFRztBQUNILFNBQVMsbUJBQW1CO0lBQzFCLE1BQU0sS0FBSyxHQUFhLEVBQUUsQ0FBQTtJQUUxQixTQUFTO0lBQ1QsS0FBSyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsZUFBTyxhQUFhLENBQUMsQ0FBQTtJQUNuRCxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQ2QsS0FBSyxDQUFDLElBQUksQ0FBQyx1RUFBdUUsQ0FBQyxDQUFBO0lBQ25GLEtBQUssQ0FBQyxJQUFJLENBQUMsNENBQTRDLENBQUMsQ0FBQTtJQUN4RCxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBRWQsc0NBQXNDO0lBQ3RDLEtBQUssQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUE7SUFDM0IsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUNkLEtBQUssQ0FBQyxJQUFJLENBQUMsOEJBQThCLENBQUMsQ0FBQTtJQUMxQyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBO0lBQ3hCLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUE7SUFDMUIsS0FBSyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0lBQy9CLEtBQUssQ0FBQyxJQUFJLENBQUMsb0NBQW9DLENBQUMsQ0FBQTtJQUNoRCxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBRWQsbUNBQW1DO0lBQ25DLEtBQUssQ0FBQyxJQUFJLENBQUMsK0JBQStCLENBQUMsQ0FBQTtJQUMzQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQ2QsS0FBSyxDQUFDLElBQUksQ0FBQyxxRkFBcUYsQ0FBQyxDQUFBO0lBQ2pHLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7SUFFZCxNQUFNLGdCQUFnQixHQUFHLGdCQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsS0FBSyxRQUFRLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ25GLEtBQUssTUFBTSxPQUFPLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztRQUN2QyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sT0FBTyxDQUFDLEVBQUUsS0FBSyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQTtRQUNqRCxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ2QsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDM0IsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUNkLEtBQUssQ0FBQyxJQUFJLENBQUMsd0JBQXdCLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFBO1FBQ3BELEtBQUssQ0FBQyxJQUFJLENBQUMsbUJBQW1CLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1FBQ2pELEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7UUFFZCxtQ0FBbUM7UUFDbkMsTUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUM3QyxJQUFJLE9BQU8sRUFBRSxDQUFDO1lBQ1osTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDOUMsSUFBSSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDO2dCQUNuQixLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO2dCQUN0QixLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO2dCQUNkLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0JBQ2xCLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDaEIsQ0FBQztZQUNELElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztnQkFDcEIsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtnQkFDdkIsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtnQkFDZCxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUNuQixLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQ2hCLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUVELHlCQUF5QjtJQUN6QixLQUFLLENBQUMsSUFBSSxDQUFDLDJCQUEyQixDQUFDLENBQUE7SUFDdkMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUNkLEtBQUssQ0FBQyxJQUFJLENBQUMsbUVBQW1FLENBQUMsQ0FBQTtJQUMvRSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBRWQsTUFBTSxXQUFXLEdBQUcsZ0JBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxLQUFLLGVBQWUsQ0FBQyxDQUFBO0lBQzNFLEtBQUssTUFBTSxPQUFPLElBQUksV0FBVyxFQUFFLENBQUM7UUFDbEMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLE9BQU8sQ0FBQyxFQUFFLEtBQUssT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUE7UUFDakQsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUNkLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQzNCLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDaEIsQ0FBQztJQUVELGFBQWE7SUFDYixLQUFLLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUE7SUFDakMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUNkLEtBQUssQ0FBQyxJQUFJLENBQUMscURBQXFELENBQUMsQ0FBQTtJQUNqRSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBRWQsS0FBSyxNQUFNLFNBQVMsSUFBSSxrQkFBVSxFQUFFLENBQUM7UUFDbkMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLFNBQVMsQ0FBQyxJQUFJLE9BQU8sU0FBUyxDQUFDLEVBQUUsZUFBZSxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDcEcsQ0FBQztJQUNELEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7SUFFZCxpQ0FBaUM7SUFDakMsS0FBSyxDQUFDLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxDQUFBO0lBQzFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDZCxLQUFLLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUE7SUFDNUIsS0FBSyxDQUFDLElBQUksQ0FBQyxxRkFBcUYsQ0FBQyxDQUFBO0lBQ2pHLEtBQUssQ0FBQyxJQUFJLENBQUMsaUZBQWlGLENBQUMsQ0FBQTtJQUM3RixLQUFLLENBQUMsSUFBSSxDQUFDLDZFQUE2RSxDQUFDLENBQUE7SUFDekYsS0FBSyxDQUFDLElBQUksQ0FBQyw2RUFBNkUsQ0FBQyxDQUFBO0lBQ3pGLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDZCxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBO0lBQ3hCLEtBQUssQ0FBQyxJQUFJLENBQUMsd0NBQXdDLENBQUMsQ0FBQTtJQUNwRCxLQUFLLENBQUMsSUFBSSxDQUFDLDBEQUEwRCxDQUFDLENBQUE7SUFDdEUsS0FBSyxDQUFDLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxDQUFBO0lBQ3ZDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDZCxLQUFLLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUE7SUFDN0IsS0FBSyxDQUFDLElBQUksQ0FBQywwRUFBMEUsQ0FBQyxDQUFBO0lBQ3RGLEtBQUssQ0FBQyxJQUFJLENBQUMsaUNBQWlDLENBQUMsQ0FBQTtJQUM3QyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBRWQsaUJBQWlCO0lBQ2pCLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7SUFDdkIsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUNkLEtBQUssQ0FBQyxJQUFJLENBQUMsMERBQTBELENBQUMsQ0FBQTtJQUN0RSxLQUFLLENBQUMsSUFBSSxDQUFDLDZEQUE2RCxDQUFDLENBQUE7SUFDekUsS0FBSyxDQUFDLElBQUksQ0FBQyxvRUFBb0UsQ0FBQyxDQUFBO0lBQ2hGLEtBQUssQ0FBQyxJQUFJLENBQUMsdUVBQXVFLENBQUMsQ0FBQTtJQUNuRixLQUFLLENBQUMsSUFBSSxDQUFDLGlEQUFpRCxDQUFDLENBQUE7SUFDN0QsS0FBSyxDQUFDLElBQUksQ0FBQyw2REFBNkQsQ0FBQyxDQUFBO0lBQ3pFLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7SUFFZCx5QkFBeUI7SUFDekIsS0FBSyxDQUFDLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxDQUFBO0lBQ3ZDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDZCxLQUFLLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUE7SUFDbEMsS0FBSyxDQUFDLElBQUksQ0FBQywyQ0FBMkMsQ0FBQyxDQUFBO0lBQ3ZELEtBQUssQ0FBQyxJQUFJLENBQUMseUNBQXlDLENBQUMsQ0FBQTtJQUNyRCxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQ2QsS0FBSyxDQUFDLElBQUksQ0FBQyw0REFBNEQsQ0FBQyxDQUFBO0lBQ3hFLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7SUFFZCxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDekIsQ0FBQztBQUVNLEtBQUssVUFBVSxRQUFRLENBQUMsT0FBd0I7SUFDckQsTUFBTSxPQUFPLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQTtJQUVyQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDM0IsbUJBQW1CO1FBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDdEIsQ0FBQztTQUFNLENBQUM7UUFDTixnQkFBZ0I7UUFDaEIsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQzlELEVBQUUsQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUM5QyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsT0FBTyxDQUFDLE1BQU0sZ0JBQWdCLGVBQU8sRUFBRSxDQUFDLENBQUE7UUFDbkUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLGdCQUFRLENBQUMsTUFBTSxjQUFjLGtCQUFVLENBQUMsTUFBTSxhQUFhLENBQUMsQ0FBQTtJQUMvRSxDQUFDO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJ1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgdmVyc2lvbiwgcGF0dGVybnMsIGNhdGVnb3JpZXMsIGd1YXJhbnRlZXMgfSBmcm9tICdAZ2FsbG9wL2Nhbm9uJ1xuXG5pbnRlcmZhY2UgR2VuZXJhdGVPcHRpb25zIHtcbiAgb3V0cHV0OiBzdHJpbmdcbiAgZm9ybWF0OiAnY3Vyc29ycnVsZXMnIHwgJ21hcmtkb3duJ1xufVxuXG4vKipcbiAqIFJlYWQgYSBwYXR0ZXJuIG1hcmtkb3duIGZpbGUgYW5kIGV4dHJhY3Qgc2VjdGlvbnNcbiAqL1xuZnVuY3Rpb24gcmVhZFBhdHRlcm5GaWxlKHBhdHRlcm5GaWxlOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgLy8gVHJ5IHRvIGZpbmQgdGhlIGNhbm9uIHBhY2thZ2UgcGF0dGVybnMgZGlyZWN0b3J5XG4gIGNvbnN0IHBvc3NpYmxlUGF0aHMgPSBbXG4gICAgcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdwYWNrYWdlcy9jYW5vbicsIHBhdHRlcm5GaWxlKSxcbiAgICBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ25vZGVfbW9kdWxlcy9AZ2FsbG9wL2Nhbm9uJywgcGF0dGVybkZpbGUpLFxuICBdXG5cbiAgZm9yIChjb25zdCBmaWxlUGF0aCBvZiBwb3NzaWJsZVBhdGhzKSB7XG4gICAgaWYgKGZzLmV4aXN0c1N5bmMoZmlsZVBhdGgpKSB7XG4gICAgICByZXR1cm4gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoLCAndXRmLTgnKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsXG59XG5cbi8qKlxuICogRXh0cmFjdCBleGFtcGxlcyBmcm9tIHBhdHRlcm4gbWFya2Rvd25cbiAqL1xuZnVuY3Rpb24gZXh0cmFjdEV4YW1wbGVzKGNvbnRlbnQ6IHN0cmluZyk6IHsgZ29vZDogc3RyaW5nW107IGJhZDogc3RyaW5nW10gfSB7XG4gIGNvbnN0IGdvb2Q6IHN0cmluZ1tdID0gW11cbiAgY29uc3QgYmFkOiBzdHJpbmdbXSA9IFtdXG5cbiAgLy8gRmluZCBjb2RlIGJsb2NrcyBhZnRlciBcIiMjIyBHb29kXCIgb3IgXCIjIyMgQmFkXCIgaGVhZGVyc1xuICBjb25zdCBnb29kTWF0Y2ggPSBjb250ZW50Lm1hdGNoKC8jIyMgR29vZFxccypcXG5gYGBbXFxzXFxTXSo/YGBgL2cpXG4gIGNvbnN0IGJhZE1hdGNoID0gY29udGVudC5tYXRjaCgvIyMjIEJhZFxccypcXG5gYGBbXFxzXFxTXSo/YGBgL2cpXG5cbiAgaWYgKGdvb2RNYXRjaCkge1xuICAgIGZvciAoY29uc3QgbWF0Y2ggb2YgZ29vZE1hdGNoKSB7XG4gICAgICBjb25zdCBjb2RlID0gbWF0Y2gucmVwbGFjZSgvIyMjIEdvb2RcXHMqXFxuLywgJycpLnRyaW0oKVxuICAgICAgZ29vZC5wdXNoKGNvZGUpXG4gICAgfVxuICB9XG5cbiAgaWYgKGJhZE1hdGNoKSB7XG4gICAgZm9yIChjb25zdCBtYXRjaCBvZiBiYWRNYXRjaCkge1xuICAgICAgY29uc3QgY29kZSA9IG1hdGNoLnJlcGxhY2UoLyMjIyBCYWRcXHMqXFxuLywgJycpLnRyaW0oKVxuICAgICAgYmFkLnB1c2goY29kZSlcbiAgICB9XG4gIH1cblxuICByZXR1cm4geyBnb29kLCBiYWQgfVxufVxuXG4vKipcbiAqIEdlbmVyYXRlIC5jdXJzb3JydWxlcyBjb250ZW50IGZyb20gQ2Fub25cbiAqL1xuZnVuY3Rpb24gZ2VuZXJhdGVDdXJzb3JydWxlcygpOiBzdHJpbmcge1xuICBjb25zdCBsaW5lczogc3RyaW5nW10gPSBbXVxuXG4gIC8vIEhlYWRlclxuICBsaW5lcy5wdXNoKGAjIEdhbGxvcCBDYW5vbiB2JHt2ZXJzaW9ufSAtIEFJIFJ1bGVzYClcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnVGhpcyBmaWxlIGlzIGF1dG8tZ2VuZXJhdGVkIGZyb20gQGdhbGxvcC9jYW5vbi4gRG8gbm90IGVkaXQgbWFudWFsbHkuJylcbiAgbGluZXMucHVzaCgnUmVnZW5lcmF0ZSB3aXRoOiBucG0gcnVuIGdlbmVyYXRlOmFpLXJ1bGVzJylcbiAgbGluZXMucHVzaCgnJylcblxuICAvLyBUZWNoIHN0YWNrIChmcm9tIHNwZWVkd2VsbCBjb250ZXh0KVxuICBsaW5lcy5wdXNoKCcjIyBUZWNoIFN0YWNrJylcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnLSBOZXh0LmpzIDE2IHdpdGggQXBwIFJvdXRlcicpXG4gIGxpbmVzLnB1c2goJy0gUmVhY3QgMTknKVxuICBsaW5lcy5wdXNoKCctIFR5cGVTY3JpcHQnKVxuICBsaW5lcy5wdXNoKCctIFRhaWx3aW5kIENTUyB2NCcpXG4gIGxpbmVzLnB1c2goJy0gY2xzeCBmb3IgY29uZGl0aW9uYWwgY2xhc3MgbmFtZXMnKVxuICBsaW5lcy5wdXNoKCcnKVxuXG4gIC8vIEVuZm9yY2VkIHBhdHRlcm5zIChFU0xpbnQgcnVsZXMpXG4gIGxpbmVzLnB1c2goJyMjIEVuZm9yY2VkIFBhdHRlcm5zIChFU0xpbnQpJylcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnVGhlc2UgcGF0dGVybnMgYXJlIGVuZm9yY2VkIGJ5IGBAZ2FsbG9wL2VzbGludC1wbHVnaW5gLiBWaW9sYXRpb25zIHdpbGwgYmUgZmxhZ2dlZC4nKVxuICBsaW5lcy5wdXNoKCcnKVxuXG4gIGNvbnN0IGVuZm9yY2VkUGF0dGVybnMgPSBwYXR0ZXJucy5maWx0ZXIocCA9PiBwLmVuZm9yY2VtZW50ID09PSAnZXNsaW50JyAmJiBwLnJ1bGUpXG4gIGZvciAoY29uc3QgcGF0dGVybiBvZiBlbmZvcmNlZFBhdHRlcm5zKSB7XG4gICAgbGluZXMucHVzaChgIyMjICR7cGF0dGVybi5pZH06ICR7cGF0dGVybi50aXRsZX1gKVxuICAgIGxpbmVzLnB1c2goJycpXG4gICAgbGluZXMucHVzaChwYXR0ZXJuLnN1bW1hcnkpXG4gICAgbGluZXMucHVzaCgnJylcbiAgICBsaW5lcy5wdXNoKGAtICoqRVNMaW50IFJ1bGU6KiogXFxgJHtwYXR0ZXJuLnJ1bGV9XFxgYClcbiAgICBsaW5lcy5wdXNoKGAtICoqQ2F0ZWdvcnk6KiogJHtwYXR0ZXJuLmNhdGVnb3J5fWApXG4gICAgbGluZXMucHVzaCgnJylcblxuICAgIC8vIFRyeSB0byByZWFkIGFuZCBpbmNsdWRlIGV4YW1wbGVzXG4gICAgY29uc3QgY29udGVudCA9IHJlYWRQYXR0ZXJuRmlsZShwYXR0ZXJuLmZpbGUpXG4gICAgaWYgKGNvbnRlbnQpIHtcbiAgICAgIGNvbnN0IHsgZ29vZCwgYmFkIH0gPSBleHRyYWN0RXhhbXBsZXMoY29udGVudClcbiAgICAgIGlmIChiYWQubGVuZ3RoID4gMCkge1xuICAgICAgICBsaW5lcy5wdXNoKCcqKkJhZDoqKicpXG4gICAgICAgIGxpbmVzLnB1c2goJycpXG4gICAgICAgIGxpbmVzLnB1c2goYmFkWzBdKVxuICAgICAgICBsaW5lcy5wdXNoKCcnKVxuICAgICAgfVxuICAgICAgaWYgKGdvb2QubGVuZ3RoID4gMCkge1xuICAgICAgICBsaW5lcy5wdXNoKCcqKkdvb2Q6KionKVxuICAgICAgICBsaW5lcy5wdXNoKCcnKVxuICAgICAgICBsaW5lcy5wdXNoKGdvb2RbMF0pXG4gICAgICAgIGxpbmVzLnB1c2goJycpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gRG9jdW1lbnRhdGlvbiBwYXR0ZXJuc1xuICBsaW5lcy5wdXNoKCcjIyBEb2N1bWVudGF0aW9uIFBhdHRlcm5zJylcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnVGhlc2UgcGF0dGVybnMgYXJlIG5vdCBlbmZvcmNlZCBieSBFU0xpbnQgYnV0IHNob3VsZCBiZSBmb2xsb3dlZC4nKVxuICBsaW5lcy5wdXNoKCcnKVxuXG4gIGNvbnN0IGRvY1BhdHRlcm5zID0gcGF0dGVybnMuZmlsdGVyKHAgPT4gcC5lbmZvcmNlbWVudCA9PT0gJ2RvY3VtZW50YXRpb24nKVxuICBmb3IgKGNvbnN0IHBhdHRlcm4gb2YgZG9jUGF0dGVybnMpIHtcbiAgICBsaW5lcy5wdXNoKGAjIyMgJHtwYXR0ZXJuLmlkfTogJHtwYXR0ZXJuLnRpdGxlfWApXG4gICAgbGluZXMucHVzaCgnJylcbiAgICBsaW5lcy5wdXNoKHBhdHRlcm4uc3VtbWFyeSlcbiAgICBsaW5lcy5wdXNoKCcnKVxuICB9XG5cbiAgLy8gR3VhcmFudGVlc1xuICBsaW5lcy5wdXNoKCcjIyBDYW5vbiBHdWFyYW50ZWVzJylcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnRm9sbG93aW5nIHRoZXNlIHBhdHRlcm5zIHByb3ZpZGVzIHRoZXNlIGd1YXJhbnRlZXM6JylcbiAgbGluZXMucHVzaCgnJylcblxuICBmb3IgKGNvbnN0IGd1YXJhbnRlZSBvZiBndWFyYW50ZWVzKSB7XG4gICAgbGluZXMucHVzaChgLSAqKiR7Z3VhcmFudGVlLm5hbWV9KiogKCR7Z3VhcmFudGVlLmlkfSk6IFBhdHRlcm5zICR7Z3VhcmFudGVlLnBhdHRlcm5zLmpvaW4oJywgJyl9YClcbiAgfVxuICBsaW5lcy5wdXNoKCcnKVxuXG4gIC8vIFF1aWNrIHJlZmVyZW5jZSBmb3IgY29tcG9uZW50c1xuICBsaW5lcy5wdXNoKCcjIyBDb21wb25lbnQgUXVpY2sgUmVmZXJlbmNlJylcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnIyMjIFR5cG9ncmFwaHknKVxuICBsaW5lcy5wdXNoKCctIGBIZWFkaW5nYCAtIHByb3BzOiBgYXNgLCBgY29sb3JgLCBgbWFyZ2luYCwgYGZvbnRTaXplYCwgYGZvbnRXZWlnaHRgLCBgdGV4dEFsaWduYCcpXG4gIGxpbmVzLnB1c2goJy0gYFBhcmFncmFwaGAgLSBwcm9wczogYGNvbG9yYCwgYG1hcmdpbmAsIGBmb250U2l6ZWAsIGBsaW5lSGVpZ2h0YCwgYHRleHRBbGlnbmAnKVxuICBsaW5lcy5wdXNoKCctIGBTcGFuYCAtIHByb3BzOiBgY29sb3JgLCBgbWFyZ2luYCwgYGZvbnRTaXplYCAoaW5saW5lIHRleHQsIG1iLTAgZGVmYXVsdCknKVxuICBsaW5lcy5wdXNoKCctIGBMYWJlbGAgLSBwcm9wczogYGNvbG9yYCwgYG1hcmdpbmAsIGBmb250U2l6ZWAsIGBmb250V2VpZ2h0YCwgYHRleHRBbGlnbmAnKVxuICBsaW5lcy5wdXNoKCcnKVxuICBsaW5lcy5wdXNoKCcjIyMgTGF5b3V0JylcbiAgbGluZXMucHVzaCgnLSBgU2VjdGlvbmAgLSBzZW1hbnRpYyBzZWN0aW9uIHdyYXBwZXInKVxuICBsaW5lcy5wdXNoKCctIGBDb2x1bW5zYCAtIGdyaWQgbGF5b3V0LCBwcm9wczogYGNvbHNgLCBgZ2FwYCwgYGFsaWduYCcpXG4gIGxpbmVzLnB1c2goJy0gYENvbHVtbmAgLSBjb2x1bW4gY2hpbGQnKVxuICBsaW5lcy5wdXNoKCcnKVxuICBsaW5lcy5wdXNoKCcjIyMgSW50ZXJhY3RpdmUnKVxuICBsaW5lcy5wdXNoKCctIGBCdXR0b25gIC0gcHJvcHM6IGBocmVmYCwgYHZhcmlhbnRgLCBgaWNvbmAsIGBpY29uUGxhY2VtZW50YCwgYG1hcmdpbmAnKVxuICBsaW5lcy5wdXNoKCctIGBJY29uYCAtIEljb25pZnkgaWNvbiB3cmFwcGVyJylcbiAgbGluZXMucHVzaCgnJylcblxuICAvLyBEbyBOT1Qgc2VjdGlvblxuICBsaW5lcy5wdXNoKCcjIyBEbyBOT1QnKVxuICBsaW5lcy5wdXNoKCcnKVxuICBsaW5lcy5wdXNoKCctIFVzZSBgXFwndXNlIGNsaWVudFxcJ2AgaW4gYmxvY2tzIC0gZXh0cmFjdCB0byBjb21wb25lbnRzJylcbiAgbGluZXMucHVzaCgnLSBVc2UgcmF3IGA8cD5gIG9yIGA8c3Bhbj5gIC0gdXNlIFBhcmFncmFwaC9TcGFuIGNvbXBvbmVudHMnKVxuICBsaW5lcy5wdXNoKCctIFVzZSBjbGFzc05hbWUgZm9yIG1hcmdpbi9jb2xvci9mb250U2l6ZSB3aGVuIGNvbXBvbmVudCBoYXMgcHJvcHMnKVxuICBsaW5lcy5wdXNoKCctIFVzZSBDb250YWluZXIgaW5zaWRlIFNlY3Rpb24gLSBTZWN0aW9uIGFscmVhZHkgcHJvdmlkZXMgY29udGFpbm1lbnQnKVxuICBsaW5lcy5wdXNoKCctIFVzZSBgY2xhc3NuYW1lc2AgcGFja2FnZSAtIHVzZSBgY2xzeGAgaW5zdGVhZCcpXG4gIGxpbmVzLnB1c2goJy0gVXNlIGlubGluZSBzdHlsZXMgZm9yIGhvdmVyIHN0YXRlcyAtIHVzZSBUYWlsd2luZCBjbGFzc2VzJylcbiAgbGluZXMucHVzaCgnJylcblxuICAvLyBQb3N0LWVkaXQgdmVyaWZpY2F0aW9uXG4gIGxpbmVzLnB1c2goJyMjIFBvc3QtRWRpdCBWZXJpZmljYXRpb24nKVxuICBsaW5lcy5wdXNoKCcnKVxuICBsaW5lcy5wdXNoKCdBZnRlciBlZGl0aW5nIGZpbGVzOicpXG4gIGxpbmVzLnB1c2goJzEuIFJ1biBgbnBtIHJ1biBsaW50YCB0byBjaGVjayBmb3IgZXJyb3JzJylcbiAgbGluZXMucHVzaCgnMi4gRml4IGFueSB2aW9sYXRpb25zIGJlZm9yZSBjb21taXR0aW5nJylcbiAgbGluZXMucHVzaCgnJylcbiAgbGluZXMucHVzaCgnTm90ZTogT25seSBsaW50IGZpbGVzIHlvdSBlZGl0ZWQsIG5vdCB0aGUgZW50aXJlIGNvZGViYXNlLicpXG4gIGxpbmVzLnB1c2goJycpXG5cbiAgcmV0dXJuIGxpbmVzLmpvaW4oJ1xcbicpXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZW5lcmF0ZShvcHRpb25zOiBHZW5lcmF0ZU9wdGlvbnMpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgY29udGVudCA9IGdlbmVyYXRlQ3Vyc29ycnVsZXMoKVxuXG4gIGlmIChvcHRpb25zLm91dHB1dCA9PT0gJy0nKSB7XG4gICAgLy8gT3V0cHV0IHRvIHN0ZG91dFxuICAgIGNvbnNvbGUubG9nKGNvbnRlbnQpXG4gIH0gZWxzZSB7XG4gICAgLy8gV3JpdGUgdG8gZmlsZVxuICAgIGNvbnN0IG91dHB1dFBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgb3B0aW9ucy5vdXRwdXQpXG4gICAgZnMud3JpdGVGaWxlU3luYyhvdXRwdXRQYXRoLCBjb250ZW50LCAndXRmLTgnKVxuICAgIGNvbnNvbGUubG9nKGDinJMgR2VuZXJhdGVkICR7b3B0aW9ucy5vdXRwdXR9IGZyb20gQ2Fub24gdiR7dmVyc2lvbn1gKVxuICAgIGNvbnNvbGUubG9nKGAgICR7cGF0dGVybnMubGVuZ3RofSBwYXR0ZXJucywgJHtndWFyYW50ZWVzLmxlbmd0aH0gZ3VhcmFudGVlc2ApXG4gIH1cbn1cbiJdfQ==