"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";

import {
  useSendVerificationNotificationMutation,
  useUpdateProfileMutation,
} from "@/lib/services/profile-api";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export function ProfileForm() {
  const user = useSelector((state: RootState) => state.auth.user);

  
  const [updateProfile, { isLoading, isSuccess }] = useUpdateProfileMutation();
  const [sendVerificationNotification, { isLoading: isSendingVerification }] =
    useSendVerificationNotificationMutation();

  const handleSendVerification = async () => {
    try {
      const response = await sendVerificationNotification().unwrap();
      toast.success(response.message || "Verification email sent successfully.");
    } catch {
      toast.error("Failed to send verification email. Please try again.");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    try {
      const response = await updateProfile({
        name,
        email,
      }).unwrap();

      toast.success("Profile updated successfully");
      
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Update your name and email address.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {isSuccess && (
            <p className="text-sm text-green-500">
              Profile updated successfully
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>

            <Input
              id="name"
              name="name"
              defaultValue={user.name}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>

            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={user.email}
              required
            />

            {!user.email_verified_at && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-200">
                <span>You must verify your email to complete your account verification.</span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleSendVerification}
                  disabled={isSendingVerification}
                >
                  {isSendingVerification ? "Sending..." : "Verify email"}
                </Button>
              </div>
            )}
          </div>

           {isLoading ? (
            <Button variant="secondary" disabled>
              Changing...
              <Spinner data-icon="inline-start" />
            </Button>
          ) : (
            <Button type="submit">
              Change information
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}