import { Button } from '@/components/ui/button';

export function GoogleButton({ className }: { className?: string }) {
  return (
    <Button type="button" variant="outline" className={className}>
      Continue with Google
    </Button>
  );
}
