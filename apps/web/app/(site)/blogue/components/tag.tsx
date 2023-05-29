import Link from "next/link"
import Label from "./label"

type Tag = {
	id: string;
	name: string;
	slug: string;
	color?: string;
}

interface TagLabelProps {
	tags: Tag[]
	nomargin?: boolean
}

export default function TagLabel({
  tags,
  nomargin = false
}: TagLabelProps) {
  return (
    <div className="flex gap-3">
      {tags?.length &&
        tags.slice(0).map((tag, index) => (
          <Link
            href={`/blogue/tag/${tag.slug}`}
            key={index}>
            <Label nomargin={nomargin} color={tag.color}>
              {tag.name}
            </Label>
          </Link>
        ))}
    </div>
  );
}