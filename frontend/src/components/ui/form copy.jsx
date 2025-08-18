import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  FormProvider,
  useFormContext,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

// Provide form context
const Form = FormProvider

// Context for a single field (e.g. name, email)
const FormFieldContext = React.createContext({})

const FormField = ({ name, ...props }) => (
  <FormFieldContext.Provider value={{ name }}>
    <Controller name={name} {...props} />
  </FormFieldContext.Provider>
)

const FormItemContext = React.createContext({})

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  if (!fieldContext) {
    throw new Error("useFormField must be used inside <FormField>")
  }

  const fieldState = getFieldState(fieldContext.name, formState)

  return {
    id: itemContext?.id,
    name: fieldContext.name,
    formItemId: `${itemContext?.id}-form-item`,
    formDescriptionId: `${itemContext?.id}-form-item-description`,
    formMessageId: `${itemContext?.id}-form-item-message`,
    ...fieldState,
  }
}

const FormItem = React.forwardRef(({ className, ...props }, ref) => {
  const id = React.useId()
  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()
  return (
    <Label
      ref={ref}
      htmlFor={formItemId}
      className={cn(error && "text-destructive", className)}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()
  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={!error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()
  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error?.message || children

  if (!body) return null

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField,
}
