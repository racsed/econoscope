'use client';

import { Brain } from 'lucide-react';
import { NarrationBlock } from '@/components/ui/NarrationBlock';

interface InterpretationBlockProps {
  content: string;
  themeColor: string;
}

export function InterpretationBlock({ content, themeColor }: InterpretationBlockProps) {
  return (
    <NarrationBlock
      icon={Brain}
      title="Interpretation économique"
      content={content}
      themeColor={themeColor}
    />
  );
}

export default InterpretationBlock;
