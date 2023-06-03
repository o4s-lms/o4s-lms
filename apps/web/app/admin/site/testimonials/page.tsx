import { Separator } from "@/components/ui/separator"
import Testimonials from "./components/testimonials"

export default function AdminTestimonials() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-muted-foreground text-sm">
          Manage your FAQS.
        </p>
      </div>
      <Separator />
      <Testimonials />
    </div>
  )
}