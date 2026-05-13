import { redirect } from 'next/navigation';

export default function DeprecatedEditPage() {
  redirect('/admin/produtos');
}
