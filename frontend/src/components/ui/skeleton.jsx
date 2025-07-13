import React from 'react'; // Often good practice to import React when using JSX

// Assuming 'cn' and 'bg-muted' are defined elsewhere or handled by a utility/CSS framework
// like Tailwind CSS, which is implied by the class names.
// If 'cn' is a custom utility, you'd need to ensure it's compatible with plain JS.

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }