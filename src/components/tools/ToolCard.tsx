'use client';
import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Tool, ToolCategory } from '@/types/tool';
import { Card } from '@/components/ui/Card';
import { ToolIcon } from '@/components/ui/ToolIcon';

export interface ToolCardProps {
  tool: Tool;
  locale: string;
  className?: string;
  localizedContent?: { title: string; description: string };
}

export function ToolCard({ tool, locale, className = '', localizedContent }: ToolCardProps) {
  const t = useTranslations();
  const toolUrl = `/${locale}/tools/${tool.slug}`;

  const toolName = localizedContent?.title || tool.id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const description = localizedContent?.description || tool.features
    .slice(0, 3)
    .map(f => f.replace(/-/g, ' '))
    .join(', ');

  return (
    <Link
      href={toolUrl}
      className={`block focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--color-ring))] focus-visible:ring-offset-2 rounded-lg group ${className}`}
      data-testid="tool-card"
    >
      <Card
        className="h-full bg-white transition-all duration-200 hover:shadow-md relative overflow-hidden border border-gray-200 hover:border-gray-300 rounded-lg"
        data-testid="tool-card-container"
      >
        <div className="flex flex-col h-full p-5">
          <div className="flex items-start gap-3 mb-3">
            {/* iLovePDF-style SVG icon */}
            <div className="flex-shrink-0" data-testid="tool-card-icon" aria-hidden="true">
              <ToolIcon toolId={tool.id} size={40} />
            </div>

            <h3
              className="text-sm font-bold text-gray-800 line-clamp-2 group-hover:text-[hsl(var(--color-primary))] transition-colors leading-tight pt-0.5"
              data-testid="tool-card-name"
            >
              {toolName}
            </h3>
          </div>

          <p
            className="text-xs text-gray-500 line-clamp-2 leading-relaxed"
            data-testid="tool-card-description"
          >
            {description}
          </p>
        </div>
      </Card>
    </Link>
  );
}

export default ToolCard;
