"use client";

import React from "react";
import Link from "next/link";

interface CardProps {
  title: string;
  subtitle?: string;
  badge?: { text: string; color: string };
  themeColor?: string;
  href?: string;
  miniPreview?: React.ReactNode;
  children?: React.ReactNode;
}

export function Card({
  title,
  subtitle,
  badge,
  themeColor = "#5B5EF4",
  href,
  miniPreview,
  children,
}: CardProps) {
  const content = (
    <div
      className="relative overflow-hidden rounded-2xl border border-[#E2E4E9] bg-white p-5 shadow-sm transition-all duration-300"
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
        (e.currentTarget as HTMLDivElement).style.borderColor = `${themeColor}66`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "#E2E4E9";
      }}
    >
      {/* Badge */}
      {badge && (
        <span
          className="absolute right-4 top-4 rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{
            backgroundColor: `${badge.color}1A`,
            color: badge.color,
          }}
        >
          {badge.text}
        </span>
      )}

      {/* Mini preview */}
      {miniPreview && (
        <div className="mb-4">{miniPreview}</div>
      )}

      {/* Title & subtitle */}
      <h3 className="text-base font-semibold text-[#1A1D26]">{title}</h3>
      {subtitle && (
        <p className="mt-1 text-sm text-[#5F6980]">{subtitle}</p>
      )}

      {/* Children */}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

export default Card;
