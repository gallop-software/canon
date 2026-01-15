# Contributing to Canon

## Adding or Updating ESLint Rules

Follow this workflow when creating new Canon rules or updating existing ones.

### 1. Update the Schema

Edit `canon/schema.json` to add the new pattern:

```json
{
  "id": "020",
  "title": "Your Rule Title",
  "file": "patterns/020-your-rule.md",
  "category": "components",
  "status": "stable",
  "enforcement": "eslint",
  "rule": "gallop/your-rule-name",
  "summary": "Brief description of what the rule enforces"
}
```

Add the pattern ID to relevant guarantees if applicable.

### 2. Create Pattern Documentation

Create `canon/patterns/0XX-your-rule.md`:

```markdown
# 0XX: Your Rule Title

**Category:** Components  
**Status:** Stable  
**Enforcement:** ESLint (`gallop/your-rule-name`)

## Summary

One sentence describing what the rule enforces.

## Rationale

Why this rule exists and what problems it prevents.

## Bad

\`\`\`tsx
// Example of code that violates the rule
\`\`\`

## Good

\`\`\`tsx
// Example of code that follows the rule
\`\`\`

## Exceptions

When the rule intentionally doesn't apply.
```

### 3. Create the ESLint Rule

Create `canon/src/eslint/rules/your-rule-name.ts`:

```typescript
import type { Rule } from 'eslint'
import { getCanonUrl, getCanonPattern } from '../utils/canon.js'

const RULE_NAME = 'your-rule-name'
const pattern = getCanonPattern(RULE_NAME)

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: pattern?.summary || 'Default description',
      recommended: true,
      url: getCanonUrl(RULE_NAME),
    },
    messages: {
      yourMessageId: `[Canon ${pattern?.id || '0XX'}] Your error message here.`,
    },
    schema: [],
  },

  create(context) {
    const filename = context.filename || context.getFilename()

    // Only apply to block files
    if (!filename.includes('/blocks/')) {
      return {}
    }

    return {
      JSXOpeningElement(node: any) {
        // Your rule logic here
        // Use context.report({ node, messageId: 'yourMessageId' }) to flag violations
      },
    }
  },
}

export default rule
```

### 4. Register the Rule

Edit `canon/src/eslint/index.ts`:

```typescript
// Add import
import yourRuleName from './rules/your-rule-name.js'

// Add to rules object
rules: {
  // ... existing rules
  'your-rule-name': yourRuleName,
},

// Add to recommended config
const recommended = {
  // ... existing rules
  'gallop/your-rule-name': 'warn',
}
```

### 5. Build and Test Locally

```bash
cd ~/Sites/canon/canon
npm run build
```

Test in speedwell without publishing:

```bash
cd ~/Sites/speedwell
npm link ../canon/canon
npx eslint src/blocks/your-test-file.tsx
```

### 6. Bump Version and Publish

Edit `canon/package.json` - bump version following semver:
- Patch (2.3.1 → 2.3.2): Bug fixes to existing rules
- Minor (2.3.0 → 2.4.0): New rules added
- Major (2.0.0 → 3.0.0): Breaking changes

```bash
cd ~/Sites/canon
npm publish --workspace=canon --access public
```

### 7. Update Speedwell

```bash
cd ~/Sites/speedwell
npm update @gallop.software/canon
# or for specific version:
npm install @gallop.software/canon@2.4.0
```

### 8. Regenerate AI Rules

```bash
npm run generate:ai-rules
```

### 9. Commit and Push

Canon repo:
```bash
cd ~/Sites/canon
git add -A
git commit -m "feat: add your-rule-name rule (Pattern 0XX)

- Description of what the rule does
- v2.X.X"
git push
```

Speedwell repo:
```bash
cd ~/Sites/speedwell
git add -A
git commit -m "chore: update canon to 2.X.X, add your-rule-name"
git push
```

## Rule Development Tips

### Checking JSX Elements

```typescript
JSXOpeningElement(node: any) {
  const elementName = node.name?.name
  
  if (elementName === 'YourComponent') {
    // Check attributes
    const someAttr = node.attributes?.find(
      (attr: any) => attr.type === 'JSXAttribute' && attr.name?.name === 'someProp'
    )
    
    // Get attribute value
    const value = someAttr?.value?.value // for string literals
  }
}
```

### Checking className Values

```typescript
const classNameAttr = node.attributes?.find(
  (attr: any) => attr.type === 'JSXAttribute' && attr.name?.name === 'className'
)

if (classNameAttr?.value?.type === 'Literal') {
  const classValue = classNameAttr.value.value
  if (classValue.includes('some-class')) {
    // Found the class
  }
}
```

### Checking Parent Elements

```typescript
let parent = node.parent
while (parent) {
  if (parent.type === 'JSXElement') {
    const parentName = parent.openingElement?.name?.name
    if (parentName === 'SomeParent') {
      return // Skip - inside allowed parent
    }
  }
  parent = parent.parent
}
```

### Checking Children for Text Content

```typescript
const jsxElement = node.parent
if (jsxElement?.type === 'JSXElement') {
  const hasText = jsxElement.children?.some((child: any) => 
    child.type === 'JSXText' && child.value.trim().length > 0
  )
}
```
