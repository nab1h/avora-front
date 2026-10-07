'use client';

import { useEffect, useState } from 'react';
import { Mail, MapPin, MessageCircle, Phone, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  useGetWebsiteSettingsQuery,
  useUpdateWebsiteSettingMutation,
} from '@/lib/services/settings-api';

const contactFields = [
  {
    key: 'contact_email',
    label: 'Email address',
    description: 'The email address customers can use to contact you.',
    icon: Mail,
    type: 'email',
  },
  {
    key: 'contact_phone',
    label: 'Phone number',
    description: 'The phone number shown on your website.',
    icon: Phone,
    type: 'tel',
  },
  {
    key: 'contact_whatsapp',
    label: 'WhatsApp number',
    description: 'The number customers can message you on WhatsApp.',
    icon: MessageCircle,
    type: 'tel',
  },
  {
    key: 'contact_address',
    label: 'Address',
    description: 'Your business or office address.',
    icon: MapPin,
    type: 'textarea',
  },
] as const;

export default function ContactSettingsPage() {
  const { data, isLoading, isError } = useGetWebsiteSettingsQuery();
  const [updateSetting, { isLoading: isSaving }] = useUpdateWebsiteSettingMutation();

  const contact = data?.data?.contact ?? [];
  const settings = [
    ...(data?.data?.general ?? []),
    ...(data?.data?.branding ?? []),
    ...contact,
    ...(data?.data?.maps ?? []),
  ];
  const siteName = settings.find((item) => item.key === 'site_name')?.value?.trim() ?? '';
  const email = contact.find((item) => item.key === 'contact_email')?.value ?? '';
  const phone = contact.find((item) => item.key === 'contact_phone')?.value ?? '';
  const whatsapp = contact.find((item) => item.key === 'contact_whatsapp')?.value ?? '';
  const address = contact.find((item) => item.key === 'contact_address')?.value ?? '';

  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    setValues({
      contact_email: email,
      contact_phone: phone,
      contact_whatsapp: whatsapp,
      contact_address: address,
    });
  }, [email, phone, whatsapp, address]);

  const handleSave = async () => {
    if (!siteName) {
      toast.error('Add the site name in General Settings before saving contact details.');
      return;
    }

    try {
      const response = await updateSetting({
        values: {
          site_name: siteName,
          contact_email: values.contact_email ?? '',
          contact_phone: values.contact_phone ?? '',
          contact_whatsapp: values.contact_whatsapp ?? '',
          contact_address: values.contact_address ?? '',
        },
      }).unwrap();

      toast.success(response.message ?? 'Contact details updated successfully.');
    } catch (error) {
      const errorData =
        typeof error === 'object' && error !== null && 'data' in error
          ? error.data
          : null;
      const validationMessages =
        typeof errorData === 'object' && errorData !== null && 'errors' in errorData
          ? Object.values(errorData.errors as Record<string, string[]>).flat()
          : [];
      const message =
        validationMessages.join(' ') ||
        (typeof errorData === 'object' && errorData !== null && 'message' in errorData &&
        typeof errorData.message === 'string'
          ? errorData.message
          : 'Failed to save contact details. Please try again.');

      toast.error(message);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 p-4 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-medium">Contact</h1>
        <p className="text-sm text-muted-foreground">Manage the contact details shown on your website.</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading contact details...</p>
      ) : isError ? (
        <p className="text-sm text-red-500">Failed to load contact details.</p>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {contactFields.map(({ key, label, description, icon: Icon, type }) => (
              <Card key={key}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                      <Icon className="size-4 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle>{label}</CardTitle>
                      <CardDescription>{description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {type === 'textarea' ? (
                    <textarea
                      value={values[key] ?? ''}
                      onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))}
                      className="min-h-24 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                      placeholder="Enter your address"
                    />
                  ) : (
                    <Input
                      type={type}
                      value={values[key] ?? ''}
                      onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))}
                      placeholder={type === 'email' ? 'name@example.com' : '+1 555 000 0000'}
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          <Button type="button" onClick={handleSave} disabled={isSaving}>
            <Save data-icon="inline-start" />
            {isSaving ? 'Saving...' : 'Save contact details'}
          </Button>
        </div>
      )}
    </div>
  );
}
