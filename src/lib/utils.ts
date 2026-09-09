import { User } from "@/types/users";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export const getInitials = (str: string): string => {
  if (typeof str !== "string" || !str.trim()) return "?";

  return (
    str
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "?"
  );
};



export function hasPermission(
  user: User | null,
  permission: string
): boolean {
  if (!user) return false

  return user.permissions.some(
    (item) => item.name === permission
  )
}


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


