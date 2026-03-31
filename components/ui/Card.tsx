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
      className="relative overflow-hidden rounded-2xl border border-border bg-bg-card p-5 shadow-sm transition-all duration-300"
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-card-hover)";
        (e.currentTarget as HTMLDivElement).style.borderColor = `${themeColor}66`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-card)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "";
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
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      {subtitle && (
        <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
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
