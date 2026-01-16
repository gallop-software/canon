import * as fs from 'fs';
import * as path from 'path';
// Allowed top-level directories (non-dotfiles)
const ALLOWED_TOP_LEVEL = [
    'src',
    'public',
    '_scripts',
    '_data',
    '_docs',
    'node_modules',
];
// Allowed folders directly under /src
const ALLOWED_SRC_FOLDERS = [
    'app',
    'blocks',
    'blog',
    'components',
    'hooks',
    'styles',
    'template',
    'tools',
    'types',
    'utils',
];
// Files allowed at top level
const ALLOWED_TOP_LEVEL_FILES = [
    'package.json',
    'package-lock.json',
    'tsconfig.json',
    'tsconfig.tsbuildinfo',
    'next.config.mjs',
    'next.config.js',
    'next-env.d.ts',
    'eslint.config.mjs',
    'eslint.config.js',
    '.eslintrc.js',
    '.eslintrc.json',
    'postcss.config.js',
    'tailwind.config.js',
    'tailwind.config.ts',
    'README.md',
    'LICENSE',
    'CHANGELOG.md',
    '.gitignore',
    '.cursorrules',
];
/**
 * Check if a path is a dotfile or dotfolder
 */
function isDotfile(name) {
    return name.startsWith('.');
}
/**
 * Check if a path is an archive content folder (allowed new folders in /src)
 */
function isArchiveContentFolder(name) {
    // Archive folders typically have plural names for content collections
    // We allow any folder that could reasonably be archive content
    // This is a heuristic - we check if it looks like a content collection
    return !ALLOWED_SRC_FOLDERS.includes(name);
}
/**
 * Validate project structure
 */
export async function validate(projectPath, options) {
    const violations = [];
    const absolutePath = path.resolve(process.cwd(), projectPath);
    if (!fs.existsSync(absolutePath)) {
        console.error(`Path does not exist: ${projectPath}`);
        process.exit(1);
    }
    // Check top-level directories
    const topLevelItems = fs.readdirSync(absolutePath);
    for (const item of topLevelItems) {
        const itemPath = path.join(absolutePath, item);
        const stat = fs.statSync(itemPath);
        if (stat.isDirectory()) {
            // Dotfolders are exempt
            if (isDotfile(item)) {
                continue;
            }
            // Check if it's an allowed top-level directory
            if (!ALLOWED_TOP_LEVEL.includes(item)) {
                violations.push({
                    type: 'invalid-top-level',
                    path: item,
                    message: `Invalid top-level directory: ${item}. Allowed: ${ALLOWED_TOP_LEVEL.join(', ')} (dotfolders exempt)`,
                });
            }
        }
        else {
            // It's a file - check if it's allowed at top level
            if (!isDotfile(item) && !ALLOWED_TOP_LEVEL_FILES.includes(item)) {
                // Allow common config file patterns
                const isConfigFile = item.endsWith('.config.js') ||
                    item.endsWith('.config.mjs') ||
                    item.endsWith('.config.ts') ||
                    item.endsWith('.json') ||
                    item.endsWith('.md') ||
                    item.endsWith('.sh');
                if (!isConfigFile) {
                    violations.push({
                        type: 'orphan-file',
                        path: item,
                        message: `Orphan file at project root: ${item}. Files should be in defined zones.`,
                    });
                }
            }
        }
    }
    // Check /src folder structure
    const srcPath = path.join(absolutePath, 'src');
    if (fs.existsSync(srcPath)) {
        const srcItems = fs.readdirSync(srcPath);
        for (const item of srcItems) {
            const itemPath = path.join(srcPath, item);
            const stat = fs.statSync(itemPath);
            if (stat.isDirectory()) {
                // Check if it's an allowed /src folder
                if (!ALLOWED_SRC_FOLDERS.includes(item) &&
                    !isArchiveContentFolder(item)) {
                    violations.push({
                        type: 'invalid-src-folder',
                        path: `src/${item}`,
                        message: `Invalid folder in /src: ${item}. Allowed: ${ALLOWED_SRC_FOLDERS.join(', ')} or archive content folders`,
                    });
                }
            }
        }
        // Check that src/app has route groups
        const appPath = path.join(srcPath, 'app');
        if (fs.existsSync(appPath)) {
            const appItems = fs.readdirSync(appPath);
            const hasDefaultGroup = appItems.some((item) => item === '(default)' || item.startsWith('('));
            if (!hasDefaultGroup) {
                violations.push({
                    type: 'invalid-src-folder',
                    path: 'src/app',
                    message: 'src/app should have at least one route group folder (e.g., (default)/)',
                });
            }
        }
    }
    // Output results
    if (options.json) {
        console.log(JSON.stringify({
            valid: violations.length === 0,
            violations,
        }, null, 2));
    }
    else {
        if (violations.length === 0) {
            console.log('✓ Project structure is valid');
        }
        else {
            console.log(`Found ${violations.length} violation(s):\n`);
            for (const v of violations) {
                console.log(`  ✗ ${v.message}`);
            }
            console.log('');
        }
    }
    // Exit with error code if strict mode and violations found
    if (options.strict && violations.length > 0) {
        process.exit(1);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2xpL2NvbW1hbmRzL3ZhbGlkYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxFQUFFLE1BQU0sSUFBSSxDQUFBO0FBQ3hCLE9BQU8sS0FBSyxJQUFJLE1BQU0sTUFBTSxDQUFBO0FBYTVCLCtDQUErQztBQUMvQyxNQUFNLGlCQUFpQixHQUFHO0lBQ3hCLEtBQUs7SUFDTCxRQUFRO0lBQ1IsVUFBVTtJQUNWLE9BQU87SUFDUCxPQUFPO0lBQ1AsY0FBYztDQUNmLENBQUE7QUFFRCxzQ0FBc0M7QUFDdEMsTUFBTSxtQkFBbUIsR0FBRztJQUMxQixLQUFLO0lBQ0wsUUFBUTtJQUNSLE1BQU07SUFDTixZQUFZO0lBQ1osT0FBTztJQUNQLFFBQVE7SUFDUixVQUFVO0lBQ1YsT0FBTztJQUNQLE9BQU87SUFDUCxPQUFPO0NBQ1IsQ0FBQTtBQUVELDZCQUE2QjtBQUM3QixNQUFNLHVCQUF1QixHQUFHO0lBQzlCLGNBQWM7SUFDZCxtQkFBbUI7SUFDbkIsZUFBZTtJQUNmLHNCQUFzQjtJQUN0QixpQkFBaUI7SUFDakIsZ0JBQWdCO0lBQ2hCLGVBQWU7SUFDZixtQkFBbUI7SUFDbkIsa0JBQWtCO0lBQ2xCLGNBQWM7SUFDZCxnQkFBZ0I7SUFDaEIsbUJBQW1CO0lBQ25CLG9CQUFvQjtJQUNwQixvQkFBb0I7SUFDcEIsV0FBVztJQUNYLFNBQVM7SUFDVCxjQUFjO0lBQ2QsWUFBWTtJQUNaLGNBQWM7Q0FDZixDQUFBO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLFNBQVMsQ0FBQyxJQUFZO0lBQzdCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUM3QixDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLHNCQUFzQixDQUFDLElBQVk7SUFDMUMsc0VBQXNFO0lBQ3RFLCtEQUErRDtJQUMvRCx1RUFBdUU7SUFDdkUsT0FBTyxDQUFD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QUE7WUFDSixDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFFRCxpQkFBaUI7SUFDakIsSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDakIsT0FBTyxDQUFDLEdBQUcsQ0FDVCxJQUFJLENBQUMsU0FBUyxDQUNaO1lBQ0UsS0FBSyxFQUFFLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQztZQUM5QixVQUFVO1NBQ1gsRUFDRCxJQUFJLEVBQ0osQ0FBQyxDQUNGLENBQ0YsQ0FBQTtJQUNILENBQUM7U0FBTSxDQUFDO1FBQ04sSUFBSSxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQzVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLENBQUMsQ0FBQTtRQUM3QyxDQUFDO2FBQU0sQ0FBQztZQUNOLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxVQUFVLENBQUMsTUFBTSxrQkFBa0IsQ0FBQyxDQUFBO1lBQ3pELEtBQUssTUFBTSxDQUFDLElBQUksVUFBVSxFQUFFLENBQUM7Z0JBQzNCLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQTtZQUNqQyxDQUFDO1lBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUNqQixDQUFDO0lBQ0gsQ0FBQztJQUVELDJEQUEyRDtJQUMzRCxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUM1QyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ2pCLENBQUM7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnXG5cbmludGVyZmFjZSBWYWxpZGF0ZU9wdGlvbnMge1xuICBzdHJpY3Q6IGJvb2xlYW5cbiAganNvbjogYm9vbGVhblxufVxuXG5pbnRlcmZhY2UgVmlvbGF0aW9uIHtcbiAgdHlwZTogJ29ycGhhbi1maWxlJyB8ICdpbnZhbGlkLXRvcC1sZXZlbCcgfCAnaW52YWxpZC1zcmMtZm9sZGVyJ1xuICBwYXRoOiBzdHJpbmdcbiAgbWVzc2FnZTogc3RyaW5nXG59XG5cbi8vIEFsbG93ZWQgdG9wLWxldmVsIGRpcmVjdG9yaWVzIChub24tZG90ZmlsZXMpXG5jb25zdCBBTExPV0VEX1RPUF9MRVZFTCA9IFtcbiAgJ3NyYycsXG4gICdwdWJsaWMnLFxuICAnX3NjcmlwdHMnLFxuICAnX2RhdGEnLFxuICAnX2RvY3MnLFxuICAnbm9kZV9tb2R1bGVzJyxcbl1cblxuLy8gQWxsb3dlZCBmb2xkZXJzIGRpcmVjdGx5IHVuZGVyIC9zcmNcbmNvbnN0IEFMTE9XRURfU1JDX0ZPTERFUlMgPSBbXG4gICdhcHAnLFxuICAnYmxvY2tzJyxcbiAgJ2Jsb2cnLFxuICAnY29tcG9uZW50cycsXG4gICdob29rcycsXG4gICdzdHlsZXMnLFxuICAndGVtcGxhdGUnLFxuICAndG9vbHMnLFxuICAndHlwZXMnLFxuICAndXRpbHMnLFxuXVxuXG4vLyBGaWxlcyBhbGxvd2VkIGF0IHRvcCBsZXZlbFxuY29uc3QgQUxMT1dFRF9UT1BfTEVWRUxfRklMRVMgPSBbXG4gICdwYWNrYWdlLmpzb24nLFxuICAncGFja2FnZS1sb2NrLmpzb24nLFxuICAndHNjb25maWcuanNvbicsXG4gICd0c2NvbmZpZy50c2J1aWxkaW5mbycsXG4gICduZXh0LmNvbmZpZy5tanMnLFxuICAnbmV4dC5jb25maWcuanMnLFxuICAnbmV4dC1lbnYuZC50cycsXG4gICdlc2xpbnQuY29uZmlnLm1qcycsXG4gICdlc2xpbnQuY29uZmlnLmpzJyxcbiAgJy5lc2xpbnRyYy5qcycsXG4gICcuZXNsaW50cmMuanNvbicsXG4gICdwb3N0Y3NzLmNvbmZpZy5qcycsXG4gICd0YWlsd2luZC5jb25maWcuanMnLFxuICAndGFpbHdpbmQuY29uZmlnLnRzJyxcbiAgJ1JFQURNRS5tZCcsXG4gICdMSUNFTlNFJyxcbiAgJ0NIQU5HRUxPRy5tZCcsXG4gICcuZ2l0aWdub3JlJyxcbiAgJy5jdXJzb3JydWxlcycsXG5dXG5cbi8qKlxuICogQ2hlY2sgaWYgYSBwYXRoIGlzIGEgZG90ZmlsZSBvciBkb3Rmb2xkZXJcbiAqL1xuZnVuY3Rpb24gaXNEb3RmaWxlKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gbmFtZS5zdGFydHNXaXRoKCcuJylcbn1cblxuLyoqXG4gKiBDaGVjayBpZiBhIHBhdGggaXMgYW4gYXJjaGl2ZSBjb250ZW50IGZvbGRlciAoYWxsb3dlZCBuZXcgZm9sZGVycyBpbiAvc3JjKVxuICovXG5mdW5jdGlvbiBpc0FyY2hpdmVDb250ZW50Rm9sZGVyKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAvLyBBcmNoaXZlIGZvbGRlcnMgdHlwaWNhbGx5IGhhdmUgcGx1cmFsIG5hbWVzIGZvciBjb250ZW50IGNvbGxlY3Rpb25zXG4gIC8vIFdlIGFsbG93IGFueSBmb2xkZXIgdGhhdCBjb3VsZCByZWFzb25hYmx5IGJlIGFyY2hpdmUgY29udGVudFxuICAvLyBUaGlzIGlzIGEgaGV1cmlzdGljIC0gd2UgY2hlY2sgaWYgaXQgbG9va3MgbGlrZSBhIGNvbnRlbnQgY29sbGVjdGlvblxuICByZXR1cm4gIUFMTE9XRURfU1JDX0ZPTERFUlMuaW5jbHVkZXMobmFtZSlcbn1cblxuLyoqXG4gKiBWYWxpZGF0ZSBwcm9qZWN0IHN0cnVjdHVyZVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdmFsaWRhdGUoXG4gIHByb2plY3RQYXRoOiBzdHJpbmcsXG4gIG9wdGlvbnM6IFZhbGlkYXRlT3B0aW9uc1xuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHZpb2xhdGlvbnM6IFZpb2xhdGlvbltdID0gW11cbiAgY29uc3QgYWJzb2x1dGVQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksIHByb2plY3RQYXRoKVxuXG4gIGlmICghZnMuZXhpc3RzU3luYyhhYnNvbHV0ZVBhdGgpKSB7XG4gICAgY29uc29sZS5lcnJvcihgUGF0aCBkb2VzIG5vdCBleGlzdDogJHtwcm9qZWN0UGF0aH1gKVxuICAgIHByb2Nlc3MuZXhpdCgxKVxuICB9XG5cbiAgLy8gQ2hlY2sgdG9wLWxldmVsIGRpcmVjdG9yaWVzXG4gIGNvbnN0IHRvcExldmVsSXRlbXMgPSBmcy5yZWFkZGlyU3luYyhhYnNvbHV0ZVBhdGgpXG4gIGZvciAoY29uc3QgaXRlbSBvZiB0b3BMZXZlbEl0ZW1zKSB7XG4gICAgY29uc3QgaXRlbVBhdGggPSBwYXRoLmpvaW4oYWJzb2x1dGVQYXRoLCBpdGVtKVxuICAgIGNvbnN0IHN0YXQgPSBmcy5zdGF0U3luYyhpdGVtUGF0aClcblxuICAgIGlmIChzdGF0LmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgIC8vIERvdGZvbGRlcnMgYXJlIGV4ZW1wdFxuICAgICAgaWYgKGlzRG90ZmlsZShpdGVtKSkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyBDaGVjayBpZiBpdCdzIGFuIGFsbG93ZWQgdG9wLWxldmVsIGRpcmVjdG9yeVxuICAgICAgaWYgKCFBTExPV0VEX1RPUF9MRVZFTC5pbmNsdWRlcyhpdGVtKSkge1xuICAgICAgICB2aW9sYXRpb25zLnB1c2goe1xuICAgICAgICAgIHR5cGU6ICdpbnZhbGlkLXRvcC1sZXZlbCcsXG4gICAgICAgICAgcGF0aDogaXRlbSxcbiAgICAgICAgICBtZXNzYWdlOiBgSW52YWxpZCB0b3AtbGV2ZWwgZGlyZWN0b3J5OiAke2l0ZW19LiBBbGxvd2VkOiAke0FMTE9XRURfVE9QX0xFVkVMLmpvaW4oJywgJyl9IChkb3Rmb2xkZXJzIGV4ZW1wdClgLFxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJdCdzIGEgZmlsZSAtIGNoZWNrIGlmIGl0J3MgYWxsb3dlZCBhdCB0b3AgbGV2ZWxcbiAgICAgIGlmICghaXNEb3RmaWxlKGl0ZW0pICYmICFBTExPV0VEX1RPUF9MRVZFTF9GSUxFUy5pbmNsdWRlcyhpdGVtKSkge1xuICAgICAgICAvLyBBbGxvdyBjb21tb24gY29uZmlnIGZpbGUgcGF0dGVybnNcbiAgICAgICAgY29uc3QgaXNDb25maWdGaWxlID1cbiAgICAgICAgICBpdGVtLmVuZHNXaXRoKCcuY29uZmlnLmpzJykgfHxcbiAgICAgICAgICBpdGVtLmVuZHNXaXRoKCcuY29uZmlnLm1qcycpIHx8XG4gICAgICAgICAgaXRlbS5lbmRzV2l0aCgnLmNvbmZpZy50cycpIHx8XG4gICAgICAgICAgaXRlbS5lbmRzV2l0aCgnLmpzb24nKSB8fFxuICAgICAgICAgIGl0ZW0uZW5kc1dpdGgoJy5tZCcpIHx8XG4gICAgICAgICAgaXRlbS5lbmRzV2l0aCgnLnNoJylcblxuICAgICAgICBpZiAoIWlzQ29uZmlnRmlsZSkge1xuICAgICAgICAgIHZpb2xhdGlvbnMucHVzaCh7XG4gICAgICAgICAgICB0eXBlOiAnb3JwaGFuLWZpbGUnLFxuICAgICAgICAgICAgcGF0aDogaXRlbSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGBPcnBoYW4gZmlsZSBhdCBwcm9qZWN0IHJvb3Q6ICR7aXRlbX0uIEZpbGVzIHNob3VsZCBiZSBpbiBkZWZpbmVkIHpvbmVzLmAsXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIENoZWNrIC9zcmMgZm9sZGVyIHN0cnVjdHVyZVxuICBjb25zdCBzcmNQYXRoID0gcGF0aC5qb2luKGFic29sdXRlUGF0aCwgJ3NyYycpXG4gIGlmIChmcy5leGlzdHNTeW5jKHNyY1BhdGgpKSB7XG4gICAgY29uc3Qgc3JjSXRlbXMgPSBmcy5yZWFkZGlyU3luYyhzcmNQYXRoKVxuICAgIGZvciAoY29uc3QgaXRlbSBvZiBzcmNJdGVtcykge1xuICAgICAgY29uc3QgaXRlbVBhdGggPSBwYXRoLmpvaW4oc3JjUGF0aCwgaXRlbSlcbiAgICAgIGNvbnN0IHN0YXQgPSBmcy5zdGF0U3luYyhpdGVtUGF0aClcblxuICAgICAgaWYgKHN0YXQuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAvLyBDaGVjayBpZiBpdCdzIGFuIGFsbG93ZWQgL3NyYyBmb2xkZXJcbiAgICAgICAgaWYgKFxuICAgICAgICAgICFBTExPV0VEX1NSQ19GT0xERVJTLmluY2x1ZGVzKGl0ZW0pICYmXG4gICAgICAgICAgIWlzQXJjaGl2ZUNvbnRlbnRGb2xkZXIoaXRlbSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgdmlvbGF0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6ICdpbnZhbGlkLXNyYy1mb2xkZXInLFxuICAgICAgICAgICAgcGF0aDogYHNyYy8ke2l0ZW19YCxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGBJbnZhbGlkIGZvbGRlciBpbiAvc3JjOiAke2l0ZW19LiBBbGxvd2VkOiAke0FMTE9XRURfU1JDX0ZPTERFUlMuam9pbignLCAnKX0gb3IgYXJjaGl2ZSBjb250ZW50IGZvbGRlcnNgLFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDaGVjayB0aGF0IHNyYy9hcHAgaGFzIHJvdXRlIGdyb3Vwc1xuICAgIGNvbnN0IGFwcFBhdGggPSBwYXRoLmpvaW4oc3JjUGF0aCwgJ2FwcCcpXG4gICAgaWYgKGZzLmV4aXN0c1N5bmMoYXBwUGF0aCkpIHtcbiAgICAgIGNvbnN0IGFwcEl0ZW1zID0gZnMucmVhZGRpclN5bmMoYXBwUGF0aClcbiAgICAgIGNvbnN0IGhhc0RlZmF1bHRHcm91cCA9IGFwcEl0ZW1zLnNvbWUoXG4gICAgICAgIChpdGVtKSA9PiBpdGVtID09PSAnKGRlZmF1bHQpJyB8fCBpdGVtLnN0YXJ0c1dpdGgoJygnKVxuICAgICAgKVxuXG4gICAgICBpZiAoIWhhc0RlZmF1bHRHcm91cCkge1xuICAgICAgICB2aW9sYXRpb25zLnB1c2goe1xuICAgICAgICAgIHR5cGU6ICdpbnZhbGlkLXNyYy1mb2xkZXInLFxuICAgICAgICAgIHBhdGg6ICdzcmMvYXBwJyxcbiAgICAgICAgICBtZXNzYWdlOlxuICAgICAgICAgICAgJ3NyYy9hcHAgc2hvdWxkIGhhdmUgYXQgbGVhc3Qgb25lIHJvdXRlIGdyb3VwIGZvbGRlciAoZS5nLiwgKGRlZmF1bHQpLyknLFxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIE91dHB1dCByZXN1bHRzXG4gIGlmIChvcHRpb25zLmpzb24pIHtcbiAgICBjb25zb2xlLmxvZyhcbiAgICAgIEpTT04uc3RyaW5naWZ5KFxuICAgICAgICB7XG4gICAgICAgICAgdmFsaWQ6IHZpb2xhdGlvbnMubGVuZ3RoID09PSAwLFxuICAgICAgICAgIHZpb2xhdGlvbnMsXG4gICAgICAgIH0sXG4gICAgICAgIG51bGwsXG4gICAgICAgIDJcbiAgICAgIClcbiAgICApXG4gIH0gZWxzZSB7XG4gICAgaWYgKHZpb2xhdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb25zb2xlLmxvZygn4pyTIFByb2plY3Qgc3RydWN0dXJlIGlzIHZhbGlkJylcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coYEZvdW5kICR7dmlvbGF0aW9ucy5sZW5ndGh9IHZpb2xhdGlvbihzKTpcXG5gKVxuICAgICAgZm9yIChjb25zdCB2IG9mIHZpb2xhdGlvbnMpIHtcbiAgICAgICAgY29uc29sZS5sb2coYCAg4pyXICR7di5tZXNzYWdlfWApXG4gICAgICB9XG4gICAgICBjb25zb2xlLmxvZygnJylcbiAgICB9XG4gIH1cblxuICAvLyBFeGl0IHdpdGggZXJyb3IgY29kZSBpZiBzdHJpY3QgbW9kZSBhbmQgdmlvbGF0aW9ucyBmb3VuZFxuICBpZiAob3B0aW9ucy5zdHJpY3QgJiYgdmlvbGF0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgcHJvY2Vzcy5leGl0KDEpXG4gIH1cbn1cbiJdfQ==