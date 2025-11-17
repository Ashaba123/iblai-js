import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import remarkStringify from 'remark-stringify';
import remarkHtml from 'remark-html';
import { remark } from 'remark';

export { sanitizeHtml } from './sanitize-html';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function htmlToMarkdown(htmlText: string) {
  if (!htmlText || typeof htmlText !== 'string') {
    return '';
  }

  try {
    const file = remark()
      .use(rehypeParse, { emitParseErrors: true, duplicateAttribute: false })
      .use(rehypeRemark)
      .use(remarkStringify)
      .processSync(htmlText);

    return String(file);
  } catch (error) {
    console.warn('Failed to convert HTML to Markdown:', error);
    return htmlText; // Return original text as fallback
  }
}

export function isHtml(str: string) {
  if (!str || typeof str !== 'string') {
    return false;
  }

  const trimmed = str.trim();

  return (
    trimmed.startsWith('<') &&
    trimmed.endsWith('>') &&
    (trimmed.includes('</') || trimmed.includes('/>'))
  );
}

export function markdownToHtml(markdownText: string) {
  if (!markdownText || typeof markdownText !== 'string') {
    return '';
  }

  try {
    const file = remark().use(remarkHtml).processSync(markdownText);
    return String(file);
  } catch (error) {
    console.warn('Failed to convert Markdown to HTML:', error);
    return markdownText; // Return original text as fallback
  }
}
