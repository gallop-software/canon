# Pattern 017: SEO Metadata

**Canon Version:** 1.0  
**Status:** Stable  
**Category:** SEO  
**Enforcement:** Documentation

## Decision

Every page must have complete SEO metadata including Open Graph, Twitter cards, and structured data.

## Rationale

1. **Search visibility** — Proper metadata improves rankings
2. **Social sharing** — OG/Twitter cards control previews
3. **Rich results** — Structured data enables rich snippets
4. **Consistency** — All pages follow the same pattern

## Required Metadata

### Core Properties

| Property | Required | Description |
|----------|----------|-------------|
| `title` | Yes | Page title with site name (50-60 chars) |
| `description` | Yes | SEO description (150-160 chars) |
| `keywords` | Yes | Array of relevant keywords |
| `focusKeyword` | Yes | Primary keyword for the page |
| `featuredImage` | Yes | OG image path |
| `alternates.canonical` | Yes | Canonical URL |

### Open Graph

```typescript
openGraph: {
  type: 'website',           // or 'article' for blog posts
  locale: 'en_US',
  url: 'https://example.com/page',
  siteName: 'Site Name',
  title: 'Page Title',
  description: 'Page description',
  image: {
    url: '/images/og-image.jpg',
    alt: 'Image description',
  },
}
```

### Twitter Cards

```typescript
twitter: {
  card: 'summary_large_image',
  site: '@sitehandle',
  creator: '@authorhandle',
  title: 'Page Title',
  description: 'Page description',
  image: '/images/twitter-image.jpg',
}
```

### Structured Data

```typescript
structuredData: [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',      // or Organization, Product, Article, etc.
    name: 'Page Title',
    description: 'Page description',
    // Additional properties based on type
  },
]
```

## Common Structured Data Types

### Organization (Homepage)

```typescript
{
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Company Name',
  url: 'https://example.com',
  logo: 'https://example.com/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-555-555-5555',
    contactType: 'customer service',
  },
}
```

### LocalBusiness (Contact Page)

```typescript
{
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Business Name',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Main St',
    addressLocality: 'City',
    addressRegion: 'State',
    postalCode: '12345',
  },
  telephone: '+1-555-555-5555',
}
```

### Article (Blog Post)

```typescript
{
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Article Title',
  author: {
    '@type': 'Person',
    name: 'Author Name',
  },
  datePublished: '2026-01-15',
  dateModified: '2026-01-15',
  image: 'https://example.com/article-image.jpg',
}
```

### Product (Product Page)

```typescript
{
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Product Name',
  description: 'Product description',
  brand: {
    '@type': 'Brand',
    name: 'Brand Name',
  },
  offers: {
    '@type': 'Offer',
    price: '99.00',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
}
```

## Image Guidelines

### Featured/OG Images

- Minimum size: 1200x630px
- Recommended: 1200x630px (1.91:1 ratio)
- Format: JPG or PNG
- Max file size: 5MB

### Twitter Images

- Minimum: 300x157px
- Recommended: 1200x600px (2:1 ratio)
- Format: JPG, PNG, or GIF

## Validation Tools

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

## Enforcement

- **Method:** Code review / SEO audit
- **Future:** CI validation of metadata completeness

## References

- `src/utils/page-helpers.ts` — Metadata generation utilities
- `src/app/(hero)/page.tsx` — Homepage metadata example
- Schema.org documentation: https://schema.org
