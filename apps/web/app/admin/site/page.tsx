import { Separator } from "@/components/ui/separator"
import { AdminBlog } from "./components/admin-blog"

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-muted-foreground text-sm">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <AdminBlog />
    </div>
  )
}