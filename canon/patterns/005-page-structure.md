# Pattern 005: Page Structure

**Canon Version:** 1.0  
**Status:** Stable  
**Category:** Structure  
**Enforcement:** Documentation

## Decision

Page files follow a consistent structure using `PageWrapper` and `generatePageMetadata`.

## Rationale

1. **Consistent metadata** — All pages have proper SEO metadata
2. **Structured data** — Schema.org markup applied uniformly
3. **Predictable layout** — Pages follow the same wrapper pattern
4. **Easy auditing** — Can verify metadata completeness across all pages

## Template

```tsx
import { PageWrapper } from '@/components/page-wrapper'
import { generatePageMetadata, type PageMetadata } from '@/utils/page-helpers'

import Hero1 from '@/blocks/hero-1'
import Section1 from '@/blocks/section-1'

function Content() {
  return (
    <>
      <Hero1 />
      <Section1 />
    </>
  )
}

const metadata: PageMetadata = {
  title: 'Page Title | Site Name',
  description: 'Page description for SEO (150-160 characters)',
  keywords: ['keyword1', 'keyword2', 'keyword3'],
  focusKeyword: 'primary keyword',
  readingTimeMinutes: 5,
  publishDate: '2026-01-15T00:00:00Z',
  modifiedDate: '2026-01-15T00:00:00Z',
  featuredImage: '/images/page-featured.jpg',
  alternates: {
    canonical: 'https://example.com/page-slug',
  },
  authors: [{ name: 'Author Name' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://example.com/page-slug',
    siteName: 'Site Name',
    title: 'Page Title | Site Name',
    description: 'Page description for SEO',
    image: {
      url: '/images/page-featured.jpg',
      alt: 'Featured image description',
    },
  },
  twitter: {
    card: 'summary_large_image',
    site: '@sitehandle',
    creator: '@creatorhandle',
    title: 'Page Title',
    description: 'Page description for Twitter',
    image: '/images/page-featured.jpg',
  },
  structuredData: [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Page Title',
      description: 'Page description',
    },
  ],
}

export const generateMetadata = () => generatePageMetadata(metadata)
export default function Page() {
  return (
    <PageWrapper metadata={metadata}>
      <Content />
    </PageWrapper>
  )
}
```

## Required Metadata Properties

| Property | Required | Description |
|----------|----------|-------------|
| `title` | Yes | Page title with site name |
| `description` | Yes | SEO description (150-160 chars) |
| `keywords` | Yes | Array of relevant keywords |
| `focusKeyword` | Yes | Primary SEO keyword |
| `featuredImage` | Yes | OG image path |
| `alternates.canonical` | Yes | Canonical URL |

## Enforcement

- **Method:** Code review / Documentation
- **Future:** CI validation of metadata completeness

## References

- `src/app/(hero)/page.tsx` — Homepage example
- `src/components/page-wrapper.tsx` — PageWrapper component
- `src/utils/page-helpers.ts` — Metadata utilities
