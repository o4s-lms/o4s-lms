import { Separator } from "@/components/ui/separator"
import Tags from "./components/tags"

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Tags</h3>
        <p className="text-muted-foreground text-sm">
          Manage the tags of your blog.
        </p>
      </div>
      <Separator />
      <Tags />
    </div>
  )
}