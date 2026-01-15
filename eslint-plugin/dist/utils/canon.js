"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCanonPattern = getCanonPattern;
exports.formatCanonMessage = formatCanonMessage;
exports.getCanonDocs = getCanonDocs;
exports.getCanonUrl = getCanonUrl;
const canon_1 = require("@gallop/canon");
// Build a lookup map from rule name to pattern
const ruleToPatternMap = new Map();
for (const pattern of canon_1.patterns) {
    if (pattern.rule) {
        ruleToPatternMap.set(pattern.rule, pattern);
    }
}
/**
 * Get Canon pattern info for an ESLint rule
 */
function getCanonPattern(ruleName) {
    return ruleToPatternMap.get(`gallop/${ruleName}`);
}
/**
 * Format a message with Canon pattern prefix
 */
function formatCanonMessage(ruleName, message) {
    const pattern = getCanonPattern(ruleName);
    if (pattern) {
        return `[Canon ${pattern.id}] ${message}`;
    }
    return message;
}
/**
 * Get Canon docs metadata for a rule
 */
function getCanonDocs(ruleName) {
    const pattern = getCanonPattern(ruleName);
    if (!pattern)
        return {};
    return {
        canon: {
            pattern: pattern.id,
            title: pattern.title,
            url: `https://github.com/gallop-software/canon/blob/main/${pattern.file}`,
        },
    };
}
/**
 * Create a URL for the Canon pattern docs
 */
function getCanonUrl(ruleName) {
    const pattern = getCanonPattern(ruleName);
    if (pattern) {
        return `https://github.com/gallop-software/canon/blob/main/${pattern.file}`;
    }
    return `https://github.com/gallop-software/canon`;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2Fub24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvY2Fub24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFhQSwwQ0FFQztBQUtELGdEQU1DO0FBS0Qsb0NBV0M7QUFLRCxrQ0FNQztBQXJERCx5Q0FBc0Q7QUFFdEQsK0NBQStDO0FBQy9DLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxHQUFHLEVBQW1CLENBQUE7QUFDbkQsS0FBSyxNQUFNLE9BQU8sSUFBSSxnQkFBUSxFQUFFLENBQUM7SUFDL0IsSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDakIsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDN0MsQ0FBQztBQUNILENBQUM7QUFFRDs7R0FFRztBQUNILFNBQWdCLGVBQWUsQ0FBQyxRQUFnQjtJQUM5QyxPQUFPLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxVQUFVLFFBQVEsRUFBRSxDQUFDLENBQUE7QUFDbkQsQ0FBQztBQUVEOztHQUVHO0FBQ0gsU0FBZ0Isa0JBQWtCLENBQUMsUUFBZ0IsRUFBRSxPQUFlO0lBQ2xFLE1BQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUN6QyxJQUFJLE9BQU8sRUFBRSxDQUFDO1FBQ1osT0FBTyxVQUFVLE9BQU8sQ0FBQyxFQUFFLEtBQUssT0FBTyxFQUFFLENBQUE7SUFDM0MsQ0FBQztJQUNELE9BQU8sT0FBTyxDQUFBO0FBQ2hCLENBQUM7QUFFRDs7R0FFRztBQUNILFNBQWdCLFlBQVksQ0FBQyxRQUFnQjtJQUMzQyxNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUE7SUFDekMsSUFBSSxDQUFDLE9BQU87UUFBRSxPQUFPLEVBQUUsQ0FBQTtJQUV2QixPQUFPO1FBQ0wsS0FBSyxFQUFFO1lBQ0wsT0FBTyxFQUFFLE9BQU8sQ0FBQyxFQUFFO1lBQ25CLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSztZQUNwQixHQUFHLEVBQUUsc0RBQXNELE9BQU8sQ0FBQyxJQUFJLEVBQUU7U0FDMUU7S0FDRixDQUFBO0FBQ0gsQ0FBQztBQUVEOztHQUVHO0FBQ0gsU0FBZ0IsV0FBVyxDQUFDLFFBQWdCO0lBQzFDLE1BQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUN6QyxJQUFJLE9BQU8sRUFBRSxDQUFDO1FBQ1osT0FBTyxzREFBc0QsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFBO0lBQzdFLENBQUM7SUFDRCxPQUFPLDBDQUEwQyxDQUFBO0FBQ25ELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwYXR0ZXJucywgdHlwZSBQYXR0ZXJuIH0gZnJvbSAnQGdhbGxvcC9jYW5vbidcblxuLy8gQnVpbGQgYSBsb29rdXAgbWFwIGZyb20gcnVsZSBuYW1lIHRvIHBhdHRlcm5cbmNvbnN0IHJ1bGVUb1BhdHRlcm5NYXAgPSBuZXcgTWFwPHN0cmluZywgUGF0dGVybj4oKVxuZm9yIChjb25zdCBwYXR0ZXJuIG9mIHBhdHRlcm5zKSB7XG4gIGlmIChwYXR0ZXJuLnJ1bGUpIHtcbiAgICBydWxlVG9QYXR0ZXJuTWFwLnNldChwYXR0ZXJuLnJ1bGUsIHBhdHRlcm4pXG4gIH1cbn1cblxuLyoqXG4gKiBHZXQgQ2Fub24gcGF0dGVybiBpbmZvIGZvciBhbiBFU0xpbnQgcnVsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2Fub25QYXR0ZXJuKHJ1bGVOYW1lOiBzdHJpbmcpOiBQYXR0ZXJuIHwgdW5kZWZpbmVkIHtcbiAgcmV0dXJuIHJ1bGVUb1BhdHRlcm5NYXAuZ2V0KGBnYWxsb3AvJHtydWxlTmFtZX1gKVxufVxuXG4vKipcbiAqIEZvcm1hdCBhIG1lc3NhZ2Ugd2l0aCBDYW5vbiBwYXR0ZXJuIHByZWZpeFxuICovXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0Q2Fub25NZXNzYWdlKHJ1bGVOYW1lOiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IHBhdHRlcm4gPSBnZXRDYW5vblBhdHRlcm4ocnVsZU5hbWUpXG4gIGlmIChwYXR0ZXJuKSB7XG4gICAgcmV0dXJuIGBbQ2Fub24gJHtwYXR0ZXJuLmlkfV0gJHttZXNzYWdlfWBcbiAgfVxuICByZXR1cm4gbWVzc2FnZVxufVxuXG4vKipcbiAqIEdldCBDYW5vbiBkb2NzIG1ldGFkYXRhIGZvciBhIHJ1bGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldENhbm9uRG9jcyhydWxlTmFtZTogc3RyaW5nKSB7XG4gIGNvbnN0IHBhdHRlcm4gPSBnZXRDYW5vblBhdHRlcm4ocnVsZU5hbWUpXG4gIGlmICghcGF0dGVybikgcmV0dXJuIHt9XG4gIFxuICByZXR1cm4ge1xuICAgIGNhbm9uOiB7XG4gICAgICBwYXR0ZXJuOiBwYXR0ZXJuLmlkLFxuICAgICAgdGl0bGU6IHBhdHRlcm4udGl0bGUsXG4gICAgICB1cmw6IGBodHRwczovL2dpdGh1Yi5jb20vZ2FsbG9wLXNvZnR3YXJlL2Nhbm9uL2Jsb2IvbWFpbi8ke3BhdHRlcm4uZmlsZX1gLFxuICAgIH0sXG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBVUkwgZm9yIHRoZSBDYW5vbiBwYXR0ZXJuIGRvY3NcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldENhbm9uVXJsKHJ1bGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBwYXR0ZXJuID0gZ2V0Q2Fub25QYXR0ZXJuKHJ1bGVOYW1lKVxuICBpZiAocGF0dGVybikge1xuICAgIHJldHVybiBgaHR0cHM6Ly9naXRodWIuY29tL2dhbGxvcC1zb2Z0d2FyZS9jYW5vbi9ibG9iL21haW4vJHtwYXR0ZXJuLmZpbGV9YFxuICB9XG4gIHJldHVybiBgaHR0cHM6Ly9naXRodWIuY29tL2dhbGxvcC1zb2Z0d2FyZS9jYW5vbmBcbn1cbiJdfQ==