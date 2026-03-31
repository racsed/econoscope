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
  themeColor = "#6366F1",
  href,
  miniPreview,
  children,
}: CardProps) {
  const content = (
    <div
      className="relative overflow-hidden rounded-2xl border border-[#2A2A35] bg-[#141419] p-5 transition-shadow duration-300"
      style={{
        boxShadow: "0 0 0 0 transparent",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 20px 0 ${themeColor}33`;
        (e.currentTarget as HTMLDivElement).style.borderColor = `${themeColor}55`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 0 0 transparent";
        (e.currentTarget as HTMLDivElement).style.borderColor = "#2A2A35";
      }}
    >
      {/* Badge */}
      {badge && (
        <span
          className="absolute right-4 top-4 rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{
            backgroundColor: `${badge.color}26`,
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
      <h3 className="text-base font-semibold text-[#E8E8ED]">{title}</h3>
      {subtitle && (
        <p className="mt-1 text-sm text-[#6E6E7A]">{subtitle}</p>
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
