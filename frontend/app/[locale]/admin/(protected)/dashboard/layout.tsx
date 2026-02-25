import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';

export const metadata = {
  title: 'Administration - GLI International',
  description: 'Panneau d\'administration',
};

export default async function AdminDashboardLayout({
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
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  // If profile doesn't exist, create it
  if (!profile) {
    console.log('Profile not found, creating one...');
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        role: 'user'
      });

    if (insertError) {
      console.error('Error creating profile:', insertError);
    }

    // After creating, redirect to home (not admin since they're not admin yet)
    redirect(`/${locale}`);
  }

  if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
    redirect(`/${locale}`);
  }

return (

  <div className="fixed inset-0 z-50 overflow-auto" style={{ backgroundColor: 'rgb(231, 227, 216)' }}>
    <div className="fixed top-0 left-0 right-0 z-50">
      <AdminNav locale={locale} userEmail={user.email || ''} />
    </div>

    <main className="pt-0">
      {children}
    </main>
  </div>
);

}
