import { Separator } from "@/components/ui/separator"
import Posts from "./components/posts"

export default function AdminPosts() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-muted-foreground text-sm">
          Manage your blog posts.
        </p>
      </div>
      <Separator />
      <Posts />
    </div>
  )
}