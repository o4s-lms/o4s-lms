import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface ContentSectionProps {
  title: string;
  desc: string;
  completed: boolean;
  children: React.JSX.Element;
}

export function ContentSection({
  title,
  desc,
  completed,
  children,
}: ContentSectionProps) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-none">
        <h3 className="text-lg font-medium">{title}</h3>
        <Badge
          className={`text-sm text-muted-foreground ${completed ? 'border-teal-200 bg-teal-100/30 text-teal-900 dark:text-teal-200' : 'border-sky-300 bg-sky-200/40 text-sky-900 dark:text-sky-100'}`}
        >
          {desc}
        </Badge>
      </div>
      <Separator className="my-4 flex-none" />
      <ScrollArea className="faded-bottom -mx-4 flex-1 scroll-smooth px-4 md:pb-16">
        <div className="-mx-1 px-1.5">{children}</div>
      </ScrollArea>
    </div>
  );
}
