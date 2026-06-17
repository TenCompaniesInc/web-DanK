"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

interface TestimonialProps extends React.HTMLAttributes<HTMLDivElement> {
  companyLogo?: string;
  quote: string;
  authorName: string;
  authorPosition: string;
  authorImage?: string;
  highlightedText?: string;
}

export const Testimonial = React.forwardRef<HTMLDivElement, TestimonialProps>(
  ({
    className,
    companyLogo,
    quote,
    authorName,
    authorPosition,
    authorImage,
    highlightedText,
    ...props
  }, ref) => {
    const formattedQuote = highlightedText
      ? quote.replace(
          highlightedText,
          `<strong class="font-semibold text-[#1a3d2b]">${highlightedText}</strong>`
        )
      : quote;

    return (
      <div ref={ref} className={cn("py-12", className)} {...props}>
        <div className="max-w-2xl mx-auto px-6 flex flex-col items-center text-center">
          {companyLogo && (
            <div className="mb-6 h-8 w-32 flex items-center justify-center">
              <img
                src={companyLogo}
                alt="Company logo"
                className="h-full w-full object-contain"
              />
            </div>
          )}

          <p
            className="text-xl sm:text-2xl text-[#1a3d2b] leading-relaxed font-medium"
            dangerouslySetInnerHTML={{ __html: `"${formattedQuote}"` }}
          />

          <div className="mt-8 flex flex-col items-center gap-2">
            {authorImage && (
              <img
                src={authorImage}
                alt={authorName}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#d8e6dd] mb-1"
              />
            )}
            <p className="font-bold text-[#141414] text-sm">{authorName}</p>
            <p className="text-xs text-zinc-400 tracking-wide">{authorPosition}</p>
          </div>
        </div>
      </div>
    );
  }
);

Testimonial.displayName = "Testimonial";