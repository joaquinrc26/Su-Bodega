import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AddWineForm from './AddWineForm';
import { ADMIN_COOKIE_NAME, isAdminToken } from '@/lib/auth';

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!isAdminToken(token)) {
    redirect('/admin');
  }

  return <AddWineForm />;
}
