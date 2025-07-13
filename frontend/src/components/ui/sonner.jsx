import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

// In plain JSX, you typically wouldn't define a type alias like ToasterProps
// as you would in TypeScript. You would directly pass the props.
// If you need to ensure correct props, you'd rely on runtime checks or documentation.

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      // The `theme as ToasterProps["theme"]` type assertion is removed
      // as it's a TypeScript-specific construct.
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };