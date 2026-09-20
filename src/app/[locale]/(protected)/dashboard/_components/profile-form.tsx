"use client";

import { useRef, useState } from "react";
import { z } from "zod";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { setUser } from "@/lib/features/auth/auth-slice";

import {
  useSendVerificationNotificationMutation,
  useUpdateProfileMutation,
} from "@/lib/services/profile-api";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { CalendarIcon, Camera, CheckCircle2, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { getAvatarUrl } from "@/lib/avatar-url";

type User = NonNullable<RootState["auth"]["user"]>;


export function ProfileForm() {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) return null;

  return <ProfileFormFields user={user} />;
}

function ProfileFormFields({ user }: { user: User }) {
  const dispatch = useDispatch();
  const t = useTranslations("profile");

  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone ?? "",
    national_id: user.national_id ?? "",
    job: user.job ?? "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [birthdayDate, setBirthdayDate] = useState<Date | undefined>(() => {
    if (!user.birthday) return undefined;
    const date = new Date(`${user.birthday}T00:00:00`);
    return Number.isNaN(date.getTime()) ? undefined : date;
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarLoadError, setAvatarLoadError] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [updateProfile, { isLoading, isSuccess }] = useUpdateProfileMutation();
  const [sendVerificationNotification, { isLoading: isSendingVerification }] =
    useSendVerificationNotificationMutation();

  const schema = z.object({
    name: z.string().min(1, t("required")),
    email: z.string().email(t("invalidEmail")),
    phone: z.string().min(1, t("required")),
    birthday: z.string().min(1, t("required")),
    national_id: z.string().min(1, t("required")),
    job: z.string().min(1, t("required")),
  });

  const birthdayValue = birthdayDate
    ? format(birthdayDate, "yyyy-MM-dd")
    : "";

  const avatarSrc = avatarPreview ?? getAvatarUrl(user.avatar);

  const handleSendVerification = async () => {
    try {
      const response = await sendVerificationNotification().unwrap();
      toast.success(response.message || t("verificationEmailSent"));
    } catch {
      toast.error(t("failedToSendVerification"));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = schema.safeParse({ ...form, birthday: birthdayValue });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    const avatar = avatarInputRef.current?.files?.[0];

    try {
      const response = await updateProfile({
        ...parsed.data,
        ...(avatar && avatar.size > 0 ? { avatar } : {}),
      }).unwrap();

      const updatedUser = response.user ?? response.data;
      if (updatedUser) dispatch(setUser(updatedUser));

      setAvatarLoadError(false);
      toast.success(t("updatedSuccessfully"));
    } catch {
      toast.error(t("updatedError"));
    }
  };

  const setField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("personalInformation")}</CardTitle>
        <CardDescription>{t("updateNameAndEmail")}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-8 md:flex-row rtl:md:flex-row-reverse md:items-start md:gap-10">
          <div className="flex shrink-0 flex-col items-center gap-3 md:w-52">
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              aria-label={t("profilePicture")}
              className="group relative size-32 cursor-pointer overflow-hidden rounded-full ring-2 ring-border ring-offset-2 ring-offset-background transition hover:ring-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {avatarSrc && !avatarLoadError ? (
                <img
                  src={avatarSrc}
                  alt={user.name}
                  className="size-full object-cover"
                  onError={() => setAvatarLoadError(true)}
                />
              ) : (
                <span className="flex size-full items-center justify-center bg-muted">
                  <UserRound className="size-12 text-muted-foreground" />
                </span>
              )}
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/55 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="size-6" />
                <span className="text-xs font-medium">{t("changePhoto")}</span>
              </span>
            </button>

            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  setAvatarLoadError(false);
                  setAvatarPreview(URL.createObjectURL(file));
                }
              }}
            />

            <p className="text-center text-sm text-muted-foreground">
              {t("profilePicture")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 space-y-5">
            {isSuccess && (
              <p className="text-sm text-green-500">
                {t("updatedSuccessfully")}
              </p>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">{t("name")}</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(event) => setField("name", event.target.value)}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(event) => setField("email", event.target.value)}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}

                {!user.email_verified_at && (
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-200">
                    <span>{t("verifyEmailInstruction")}</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleSendVerification}
                      disabled={isSendingVerification}
                    >
                      {isSendingVerification ? t("sending") : t("verifyEmail")}
                    </Button>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span dir="ltr">{user.email}</span>
                  {user?.email_verified_at && (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {t("verified")}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t("phone")}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(event) => setField("phone", event.target.value)}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthday">{t("birthday")}</Label>
                <Popover>
                  <PopoverTrigger
                    render={
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full justify-start px-3 font-normal",
                          !birthdayDate && "text-muted-foreground"
                        )}
                      />
                    }
                  >
                    <CalendarIcon className="size-4 text-muted-foreground" />
                    {birthdayDate ? (
                      birthdayValue
                    ) : (
                      <span>{t("pickBirthday")}</span>
                    )}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={birthdayDate}
                      onSelect={setBirthdayDate}
                      defaultMonth={birthdayDate}
                      captionLayout="dropdown"
                      startMonth={new Date(1920, 0)}
                      endMonth={new Date(new Date().getFullYear() - 5, 11)}
                      disabled={{ after: new Date() }}
                    />
                  </PopoverContent>
                </Popover>
                {errors.birthday && (
                  <p className="text-sm text-destructive">{errors.birthday}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="national_id">{t("nationalId")}</Label>
                <Input
                  id="national_id"
                  inputMode="numeric"
                  value={form.national_id}
                  onChange={(event) =>
                    setField("national_id", event.target.value)
                  }
                />
                {errors.national_id && (
                  <p className="text-sm text-destructive">
                    {errors.national_id}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="job">{t("job")}</Label>
                <Input
                  id="job"
                  value={form.job}
                  onChange={(event) => setField("job", event.target.value)}
                />
                {errors.job && (
                  <p className="text-sm text-destructive">{errors.job}</p>
                )}
              </div>
            </div>

            {isLoading ? (
              <Button variant="secondary" disabled>
                {t("changing")}
                <Spinner data-icon="inline-start" />
              </Button>
            ) : (
              <Button type="submit">{t("changeInformation")}</Button>
            )}
          </form>
        </div>
      </CardContent>
    </Card>
  );
}