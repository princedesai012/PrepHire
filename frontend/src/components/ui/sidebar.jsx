import * as React from "react"
import { cn } from "@/lib/utils"

const Sidebar = React.forwardRef(({ className, ...props }, ref) => (
  <aside
    ref={ref}
    className={cn("flex flex-col w-64 shrink-0 border-r bg-background", className)}
    {...props}
  />
))
Sidebar.displayName = "Sidebar"

export { Sidebar }
