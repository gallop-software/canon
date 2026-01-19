# Pattern 027: Luxon for Dates

**Canon Version:** 1.0  
**Status:** Stable  
**Category:** Components  
**Enforcement:** ESLint (`gallop/no-native-date`)

## Decision

Use Luxon's `DateTime` for all date and time operations. Do not use the native JavaScript `Date` object.

## Rationale

1. **Timezone consistency** — Native `Date` operates in the user's local timezone, causing inconsistencies when users in different timezones interact with the same dates. A user in California viewing a New York restaurant's reservation system would see incorrect "today" calculations.
2. **Explicit timezone handling** — Luxon's `.setZone()` method allows explicit timezone specification, ensuring dates are always interpreted in the intended timezone (e.g., the business's location).
3. **Immutable API** — Luxon DateTime objects are immutable, preventing accidental mutation bugs common with native Date.
4. **Better API** — Luxon provides clearer methods for formatting, parsing, and date arithmetic.

## Usage

### Import

```tsx
import { DateTime } from 'luxon'
```

### Get Current Time in Specific Timezone

```tsx
// Get "now" in New York, regardless of user's location
const now = DateTime.now().setZone('America/New_York')

// Get start of "today" in business timezone
const today = DateTime.now().setZone('America/Chicago').startOf('day')
```

### Compare Dates in Timezone

```tsx
// Check if a date is in the past (relative to business timezone)
function isDatePast(year: number, month: number, day: number, timezone: string) {
  const date = DateTime.fromObject(
    { year, month: month + 1, day },
    { zone: timezone }
  ).startOf('day')
  const today = DateTime.now().setZone(timezone).startOf('day')
  return date < today
}
```

### Format Dates

```tsx
// Format for display
const formatted = DateTime.now()
  .setZone('America/New_York')
  .toFormat('MMMM d, yyyy') // "January 19, 2026"

// Format for form submission (timezone-agnostic string)
const formValue = DateTime.fromObject({ year: 2026, month: 1, day: 19 })
  .toFormat('yyyy-MM-dd') // "2026-01-19"
```

### Parse User Input

```tsx
// Parse a date string and interpret in business timezone
const date = DateTime.fromFormat('2026-01-19', 'yyyy-MM-dd', {
  zone: 'America/New_York'
})
```

## Examples

### Good

```tsx
import { DateTime } from 'luxon'

// Business timezone from config/props
const BUSINESS_TIMEZONE = 'America/Chicago'

// Get "today" in business timezone
const today = DateTime.now().setZone(BUSINESS_TIMEZONE).startOf('day')

// Check if user-selected date is valid
const selectedDate = DateTime.fromObject(
  { year: 2026, month: 1, day: 19 },
  { zone: BUSINESS_TIMEZONE }
)

if (selectedDate < today) {
  console.log('Cannot select a date in the past')
}
```

### Bad

```tsx
// Native Date uses user's local timezone
const today = new Date()
today.setHours(0, 0, 0, 0) // Still in user's timezone!

// This will be wrong for users in different timezones
const selectedDate = new Date(2026, 0, 19)
if (selectedDate < today) {
  console.log('This comparison is timezone-dependent!')
}
```

## Common Timezone Identifiers

| City | IANA Timezone |
|------|---------------|
| New York | `America/New_York` |
| Chicago / Dallas / Houston | `America/Chicago` |
| Denver | `America/Denver` |
| Los Angeles / San Francisco | `America/Los_Angeles` |
| London | `Europe/London` |
| Paris | `Europe/Paris` |
| Tokyo | `Asia/Tokyo` |

## Enforcement

- **Method:** ESLint rule `gallop/no-native-date`
- **Detects:** `new Date()`, `Date.now()`, `Date.parse()`
- **Suggests:** Use Luxon's `DateTime.now()`, `DateTime.fromISO()`, or `DateTime.fromFormat()`

## References

- Luxon Documentation: https://moment.github.io/luxon/
- IANA Timezone Database: https://www.iana.org/time-zones
- Form components use `timezone` prop for business location
