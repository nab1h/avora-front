type AccountUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
};

export function AccountSwitcher({ users }: { users: AccountUser[] }) {
  const activeUser = users[0];

  return (
    <div className="inline-flex items-center gap-2 rounded-md border bg-background px-2 py-1.5 text-sm">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
        {activeUser ? activeUser.name.charAt(0).toUpperCase() : 'A'}
      </div>
      <span>{activeUser ? activeUser.name : 'Account'}</span>
    </div>
  );
}
