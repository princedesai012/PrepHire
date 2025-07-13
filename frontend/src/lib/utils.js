import { clsx } from "clsx"; // 'type ClassValue' is a type-only import, so it's removed
import { twMerge } from "tailwind-merge";

export function cn(...inputs) { // Removed ': ClassValue[]' type annotation
  return twMerge(clsx(inputs));
}queueMicrotask