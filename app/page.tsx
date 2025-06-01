import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to finance dashboard by default
  redirect('/finance');
}