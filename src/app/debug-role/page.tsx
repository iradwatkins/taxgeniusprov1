import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DebugRolePage() {
  const user = await currentUser();

  if (!user) {
    redirect('/auth/login');
  }

  const role = user.publicMetadata?.role;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug: User Role</h1>

        <div className="bg-card border rounded-lg p-6 space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">User ID</p>
            <p className="font-mono">{user.id}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-mono">{user.emailAddresses[0]?.emailAddress}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Current Role</p>
            <p className="font-mono text-lg">
              {role ? (
                <span className={role === 'admin' ? 'text-green-500' : 'text-yellow-500'}>
                  {role as string}
                </span>
              ) : (
                <span className="text-red-500">NO ROLE SET</span>
              )}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Full Public Metadata</p>
            <pre className="bg-muted p-4 rounded mt-2 overflow-auto">
              {JSON.stringify(user.publicMetadata, null, 2)}
            </pre>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">All User Data</p>
            <pre className="bg-muted p-4 rounded mt-2 overflow-auto max-h-96">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-bold">Instructions to Set Admin Role:</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Go to https://dashboard.clerk.com</li>
            <li>Select your project</li>
            <li>Go to "Users" in left sidebar</li>
            <li>Click on your user email: {user.emailAddresses[0]?.emailAddress}</li>
            <li>Scroll to "Public metadata" section</li>
            <li>Click "Edit" and add: {`{ "role": "admin" }`}</li>
            <li>Click "Save"</li>
            <li>Refresh this page to see the change</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
