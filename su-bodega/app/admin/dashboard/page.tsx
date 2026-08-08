import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_COOKIE_NAME, isAdminToken } from '@/lib/auth';
import AddWineForm from '@/app/add-wine/AddWineForm';

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!isAdminToken(token)) {
    redirect('/admin');
  }

  return <AddWineForm />;
}
