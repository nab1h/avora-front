"use client";

import { useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  useLazyGetMeQuery,
  useVerifyEmailMutation
} from "@/lib/services/auth-api";
import { useAppDispatch } from "@/lib/hooks";
import { setUser } from "@/lib/features/auth/auth-slice";

export default function EmailVerifyPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [verifyEmail] = useVerifyEmailMutation();
  const [getMe] = useLazyGetMeQuery();

  useEffect(() => {
    const verify = async () => {
      const id = params.id as string;
      const hash = params.hash as string;

      const expires = searchParams.get("expires");
      const signature = searchParams.get("signature");

      if (!id || !hash || !expires || !signature) {
        router.push(
          `/dashboard/profile?message=${encodeURIComponent(
            "Invalid verification link."
          )}`
        );
        return;
      }

      try {
        // 1. Verify email
        const response = await verifyEmail({
          id,
          hash,
          expires,
          signature,
        }).unwrap();

        // 2. Get fresh user data
        const me = await getMe().unwrap();

        console.log(me);
        // 3. Update Redux user
        console.log("ME RESPONSE:", me);
        console.log("USER DATA:", me.data);
        dispatch(setUser(me.data));

        // 4. Update localStorage if you are using it
        localStorage.setItem("user", JSON.stringify(me.data));

        // 5. Go back to profile with message
        router.push(
          `/dashboard/profile?message=${encodeURIComponent(
            response.message
          )}`
        );
      } catch (error: any) {
        router.push(
          `/dashboard/profile?message=${encodeURIComponent(
            error?.data?.message || "Verification failed."
          )}`
        );
      }
    };

    verify();
  }, [
    params,
    searchParams,
    verifyEmail,
    getMe,
    dispatch,
    router,
  ]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Verifying your email...</p>
    </div>
  );
}