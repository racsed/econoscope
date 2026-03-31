'use client';

import { Eye } from 'lucide-react';
import { NarrationBlock } from '@/components/ui/NarrationBlock';

interface ObservationBlockProps {
  content: string;
  themeColor: string;
}

export function ObservationBlock({ content, themeColor }: ObservationBlockProps) {
  return (
    <NarrationBlock
      icon={Eye}
      title="Ce que tu observes"
      content={content}
      themeColor={themeColor}
    />
  );
}

export default ObservationBlock;
