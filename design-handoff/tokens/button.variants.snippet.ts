/**
 * Rollout step R1. Edit client/src/components/ui/button.tsx.
 *
 * 1. Replace buttonVariants with the version below. Changes from the shadcn default:
 *    - sizes are taller (44px minimum touch target, the design uses 46 to 62px)
 *    - radius is rounded-xl
 *    - new "cta" variant: gold, the single primary action on a page
 *    - "default" stays forest, so every existing <Button> turns forest with no page edits
 *    - "outline" gets the 2px forest border used on Website and Profile buttons
 *
 * 2. Search the codebase for size="sm" and size="icon" before merging. Anything below 44px
 *    high on mobile should move to the new "md" size.
 */
import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-[15px] font-semibold transition-[filter,transform] " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
    "hover:brightness-95 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        cta: "bg-brand-gold text-brand-ink font-bold",
        secondary: "bg-secondary text-secondary-foreground border-2 border-brand-forest",
        outline: "border-2 border-brand-forest bg-transparent text-brand-forest hover:bg-white hover:brightness-100",
        ghost: "bg-transparent text-brand-forest hover:bg-brand-mint hover:brightness-100",
        destructive: "bg-destructive text-destructive-foreground",
        link: "text-brand-forest underline underline-offset-4 hover:brightness-100",
      },
      size: {
        default: "h-12 px-5",
        sm: "h-11 px-4", // 44px, was 36px
        md: "h-12 px-5",
        lg: "h-14 px-7 text-[17px]",
        xl: "h-[60px] px-8 text-lg", // main CTA
        icon: "h-11 w-11",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);
