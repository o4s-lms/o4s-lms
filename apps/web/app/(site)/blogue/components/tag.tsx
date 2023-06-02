import Link from "next/link"
import Label from "./label"
import { BlogPostsResponseData } from "@o4s/generated-wundergraph/models";

type Tags = BlogPostsResponseData["posts"][number]["post_tags"]

interface TagLabelProps {
	tags: Tags
	nomargin?: boolean
}

export default function TagLabel({
  tags,
  nomargin = false
}: TagLabelProps) {
  return (
    <div className="flex gap-3">
      {tags?.length &&
        tags.slice(0).map((item, index) => (
          <Link
            href={`/blogue/tag/${item.tag.slug}`}
            key={index}>
            <Label nomargin={nomargin} color={item.tag.color}>
              {item.tag.name}
            </Label>
          </Link>
        ))}
    </div>
  );
}