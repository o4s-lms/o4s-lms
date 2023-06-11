import { Separator } from "@/components/ui/separator"
import Faqs from "./components/faqs"

export default function AdminFaqs() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-muted-foreground text-sm">
          Manage your FAQS.
        </p>
      </div>
      <Separator />
      <Faqs />
    </div>
  )
}