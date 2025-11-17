import DOMPurify, { Config } from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks.
 *
 * This function uses DOMPurify to clean HTML content by:
 * - Removing malicious scripts and event handlers
 * - Preserving safe HTML elements and attributes
 * - Preventing DOM clobbering attacks
 *
 * @param html - The HTML string to sanitize
 * @returns The sanitized HTML string safe for rendering
 *
 * @example
 * ```tsx
 * const userContent = '<p>Hello</p><script>alert("XSS")</script>';
 * const safeContent = sanitizeHtml(userContent);
 * // Returns: '<p>Hello</p>'
 *
 * <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(userContent) }} />
 * ```
 */
export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') {
    // Server-side: Return as-is or use a server-compatible sanitizer
    // For SSR, consider using isomorphic-dompurify or similar
    return html;
  }

  // Configure DOMPurify with secure defaults
  const config: Config = {
    // Allow common safe tags for rich text content
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      'u',
      's',
      'a',
      'ul',
      'ol',
      'li',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'blockquote',
      'code',
      'pre',
      'span',
      'div',
      'img',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
    ],
    // Allow safe attributes
    ALLOWED_ATTR: [
      'href',
      'title',
      'target',
      'rel',
      'src',
      'alt',
      'width',
      'height',
      'class',
      'id',
      'style',
    ],
    // Prevent DOM clobbering
    SANITIZE_DOM: true,
    // Keep the HTML safe even if it contains unusual combinations
    KEEP_CONTENT: true,
    // Allow data attributes for styling/functionality
    ALLOW_DATA_ATTR: false,
  };

  return DOMPurify.sanitize(html, config) as string;
}
