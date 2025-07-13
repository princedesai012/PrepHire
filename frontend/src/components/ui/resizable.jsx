import * as React from "react"
import { ResizablePanelGroup as PanelGroup, ResizablePanel as Panel, ResizableHandle as Handle } from "react-resizable-panels"
import { cn } from "@/lib/utils"

const ResizablePanelGroup = React.forwardRef(({ className, ...props }, ref) => (
  <PanelGroup ref={ref} className={cn("flex w-full", className)} {...props} />
))
ResizablePanelGroup.displayName = "ResizablePanelGroup"

const ResizablePanel = React.forwardRef(({ className, ...props }, ref) => (
  <Panel ref={ref} className={cn("relative", className)} {...props} />
))
ResizablePanel.displayName = "ResizablePanel"

const ResizableHandle = React.forwardRef((props, ref) => (
  <Handle
    ref={ref}
    className="relative flex w-px items-center justify-center bg-border after:absolute after:h-4 after:w-1 after:rounded-full after:bg-border after:content-[''] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring data-[resize=horizontal]:cursor-col-resize data-[resize=vertical]:cursor-row-resize"
    {...props}
  />
))
ResizableHandle.displayName = "ResizableHandle"

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
