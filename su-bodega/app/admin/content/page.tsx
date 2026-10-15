import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_COOKIE_NAME, isAdminToken } from '@/lib/auth';
import { getSiteContent } from '@/lib/site-content';
import ContentEditor from './ContentEditor';

export default async function AdminContentPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!isAdminToken(token)) {
    redirect('/admin');
  }

  const content = await getSiteContent();

  return <ContentEditor initialValues={content} />;
}
