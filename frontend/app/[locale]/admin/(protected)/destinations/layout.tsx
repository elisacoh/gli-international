import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';

export const metadata = {
  title: 'Destinations - Administration - GLI International',
  description: 'Gestion des destinations',
};

export default async function DestinationsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect(`/${locale}/admin/login`);
  }

  // Check if user has admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) {
    redirect(`/${locale}`);
  }

  if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
    redirect(`/${locale}`);
  }

  return (
    <div className="fixed inset-0 z-50 overflow-auto" style={{backgroundColor: 'rgb(231, 227, 216)'}}>
      <div className="fixed top-0 left-0 right-0 z-50">
        <AdminNav locale={locale} userEmail={user.email || ''} />
      </div>
      <main className="pt-0">
        {children}
      </main>
    </div>
  );
}
