import React from 'react';

interface PageHeadingProps {
  prefixText?: string;
  highlightText?: string;
  suffixText?: string;
  subtitle?: string;
  actionNode?: React.ReactNode;
  category?: string;
  title?: string;
  highlightKeyword?: string;
  description?: string;
}

export const PageHeading: React.FC<PageHeadingProps> = ({
  prefixText,
  highlightText,
  suffixText = '',
  subtitle,
  actionNode,
  category,
  title,
  highlightKeyword,
  description
}) => {
  let finalPrefix = prefixText || '';
  let finalHighlight = highlightText || '';
  let finalSuffix = suffixText || '';
  let finalSubtitle = subtitle || description || '';

  if (title && highlightKeyword) {
    const idx = title.toLowerCase().indexOf(highlightKeyword.toLowerCase());
    if (idx !== -1) {
      finalPrefix = title.substring(0, idx);
      finalHighlight = title.substring(idx, idx + highlightKeyword.length);
      finalSuffix = title.substring(idx + highlightKeyword.length);
    } else {
      finalPrefix = title;
      finalHighlight = '';
      finalSuffix = '';
    }
  }

  return (
    <div className="space-y-1">
      {category && (
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
          {category}
        </p>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-[34px] font-extrabold text-[#102A43] tracking-tight leading-tight">
            {finalPrefix}
            {finalHighlight && (
              <span className="bg-gradient-to-r from-[#1677E8] to-[#08A8C8] bg-clip-text text-transparent">
                {finalHighlight}
              </span>
            )}
            {finalSuffix}
          </h1>
          {finalSubtitle && (
            <p className="text-xs sm:text-[14px] text-[#64748B] max-w-3xl leading-relaxed">
              {finalSubtitle}
            </p>
          )}
        </div>

        {actionNode && (
          <div className="self-start sm:self-auto shrink-0">
            {actionNode}
          </div>
        )}
      </div>
    </div>
  );
};

