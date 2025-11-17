'use client';

import ReactMarkdown from 'react-markdown';
import { components } from './markdown-components';

interface MarkdownProps {
  children: string;
}

export function Markdown({ children }: MarkdownProps) {
  return <ReactMarkdown components={components}>{children}</ReactMarkdown>;
}

export { components as markdownComponents };
export { CopyButtonIcon } from './copy-button-icon';
