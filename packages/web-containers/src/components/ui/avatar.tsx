import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@web-containers/lib/utils";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
    onClick?: () => void;
  }
>(({ className, onClick, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    onClick={onClick}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> & {
    onClick?: () => void;
  }
>(({ className, onClick, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn(
      "aspect-square h-full w-full cursor-pointer rounded-full border-0 object-cover", // Changed object-center to object-cover for better image fitting
      className
    )}
    onClick={onClick}
    {...props}
  />
));

AvatarImage.displayName = "AvatarImage";

const AvatarImageBordered = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> & {
    onClick?: () => void;
  }
>(({ className, onClick, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn(
      "aspect-square h-full w-full cursor-pointer rounded-[5px] object-center",
      className
    )}
    onClick={onClick}
    {...props}
  />
));
AvatarImageBordered.displayName = "AvatarImageBordered";

const AvatarImageNoBorder = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> & {
    onClick?: () => void;
  }
>(({ className, onClick, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn(
      "aspect-square h-full w-full cursor-pointer object-center",
      className
    )}
    onClick={onClick}
    {...props}
  />
));
AvatarImageNoBorder.displayName = "AvatarImageNoBorder";

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "bg-muted flex h-full w-full items-center justify-center rounded-full",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarImageBordered, AvatarFallback };
