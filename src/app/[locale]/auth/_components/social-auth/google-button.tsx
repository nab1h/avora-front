"use client";

import { siGoogle } from "simple-icons";
import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


export function GoogleButton({ className, ...props }: React.ComponentProps<typeof Button>) {

  function handleGoogleLogin() {

        window.location.href =
            `${process.env.NEXT_PUBLIC_API_URL}/auth/google/redirect`;



    }

  return (
    <Button variant="secondary" className={cn(className)} {...props} onClick={handleGoogleLogin}>
      <SimpleIcon icon={siGoogle} className="size-4" />
      Continue with Google
    </Button>
  );
}
