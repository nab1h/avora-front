import { Button } from '@/components/ui/button';

export function FacebookButton({ className }: { className?: string }) {
  return (
    <Button type="button" variant="outline" className={className}>
      Continue with Facebook
    </Button>
  );
}
