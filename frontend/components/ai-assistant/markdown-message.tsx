"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { containsUrduScript } from "@/lib/ai/translations";

export interface MarkdownMessageProps {
  content: string;
  className?: string;
}

/**
 * Validates that a hyperlink protocol is safe (http, https, mailto, tel, or relative).
 * Strictly disallows javascript:, data:, vbscript:, and file: schemes.
 */
export function isSafeUrl(url?: string): boolean {
  if (!url) return false;
  const trimmed = url.trim().toLowerCase();
  if (
    trimmed.startsWith("javascript:") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("vbscript:") ||
    trimmed.startsWith("file:")
  ) {
    return false;
  }
  return (
    trimmed.startsWith("https://") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("#")
  );
}

/**
 * Secure, healthcare-styled Markdown renderer for VisionCare AI responses.
 * Renders bold, italics, headings, lists, tables, blockquotes, code blocks,
 * and links safely without dangerouslySetInnerHTML.
 */
export function MarkdownMessage({ content, className = "" }: MarkdownMessageProps) {
  const isUrdu = containsUrduScript(content);

  return (
    <div
      dir={isUrdu ? "rtl" : "ltr"}
      className={`markdown-content text-xs leading-relaxed break-words overflow-hidden ${
        isUrdu ? "text-right" : "text-left"
      } ${className}`.trim()}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 1. Hyperlinks with strict protocol validation and security attributes
          a: ({ href, children, ...props }) => {
            const safe = isSafeUrl(href);
            if (!safe) {
              return <span className="underline decoration-dotted text-slate-400">{children}</span>;
            }
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 dark:text-cyan-400 hover:text-teal-700 dark:hover:text-cyan-300 font-semibold underline underline-offset-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-xs"
                {...props}
              >
                {children}
              </a>
            );
          },

          // 2. Paragraphs with comfortable vertical rhythm
          p: ({ children }) => {
            return <p className="mb-2.5 last:mb-0 leading-relaxed text-xs">{children}</p>;
          },

          // 3. Unordered Lists with clear bullets and RTL margin support
          ul: ({ children }) => {
            return (
              <ul className="my-2 pl-4.5 rtl:pl-0 rtl:pr-4.5 space-y-1 list-disc list-outside marker:text-teal-600 dark:marker:text-cyan-400 text-xs">
                {children}
              </ul>
            );
          },

          // 4. Ordered Lists with numbers and RTL margin support
          ol: ({ children }) => {
            return (
              <ol className="my-2 pl-4.5 rtl:pl-0 rtl:pr-4.5 space-y-1 list-decimal list-outside marker:font-bold marker:text-teal-600 dark:marker:text-cyan-400 text-xs">
                {children}
              </ol>
            );
          },

          // 5. List items
          li: ({ children }) => {
            return <li className="leading-relaxed pl-0.5 rtl:pl-0 rtl:pr-0.5">{children}</li>;
          },

          // 6. Compact Headings (h1, h2, h3)
          h1: ({ children }) => {
            return (
              <h1 className="text-sm font-extrabold mt-3 mb-1.5 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1">
                {children}
              </h1>
            );
          },
          h2: ({ children }) => {
            return (
              <h2 className="text-xs font-bold mt-2.5 mb-1 text-slate-900 dark:text-white uppercase tracking-wider">
                {children}
              </h2>
            );
          },
          h3: ({ children }) => {
            return (
              <h3 className="text-xs font-bold mt-2 mb-1 text-teal-700 dark:text-cyan-300">
                {children}
              </h3>
            );
          },

          // 7. Bold and Italic formatting
          strong: ({ children }) => {
            return <strong className="font-bold text-slate-950 dark:text-white">{children}</strong>;
          },
          em: ({ children }) => {
            return <em className="italic">{children}</em>;
          },

          // 8. Blockquotes with colored border and background tint
          blockquote: ({ children }) => {
            return (
              <blockquote className="my-2.5 py-1.5 px-3 border-l-3 rtl:border-l-0 rtl:border-r-3 border-teal-500 bg-teal-50/40 dark:bg-slate-900/60 rounded-r-xl rtl:rounded-r-none rtl:rounded-l-xl italic text-slate-700 dark:text-slate-300">
                {children}
              </blockquote>
            );
          },

          // 9. Horizontal Dividers
          hr: () => <hr className="my-3 border-slate-200 dark:border-slate-700/80" />,

          // 10. Inline Code & Fenced Code Blocks
          code: ({ className: codeClassName, children, ...props }) => {
            const hasLang = /language-(\w+)/.exec(codeClassName || "");
            const isCodeBlock = Boolean(hasLang) || String(children).includes("\n");

            if (isCodeBlock) {
              const langName = hasLang ? hasLang[1] : "";
              return (
                <div className="relative my-2.5 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 shadow-xs max-w-full">
                  {langName && (
                    <div className="px-3 py-1 bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400 font-mono flex items-center justify-between">
                      <span>{langName}</span>
                    </div>
                  )}
                  <pre className="p-3 overflow-x-auto text-[11px] font-mono leading-relaxed max-w-full">
                    <code>{children}</code>
                  </pre>
                </div>
              );
            }

            return (
              <code
                className="font-mono text-[11px] px-1.5 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 text-teal-800 dark:text-cyan-200 border border-slate-300/60 dark:border-slate-700/80"
                {...props}
              >
                {children}
              </code>
            );
          },

          // 11. Tables with safe horizontal scrolling container
          table: ({ children }) => (
            <div className="my-2.5 overflow-x-auto max-w-full rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <table className="w-full text-left rtl:text-right border-collapse text-[11px]">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-2.5 py-1.5 font-bold text-slate-900 dark:text-white text-[11px] whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-2.5 py-1.5 border-b border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
