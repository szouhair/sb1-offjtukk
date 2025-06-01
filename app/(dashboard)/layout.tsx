import { Providers } from "@/components/providers/Providers";
import BottomNav from "@/components/dashboard/BottomNav";
import { redirect } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <main className="min-h-screen pt-4 pb-20">
        {children}
      </main>
      <BottomNav />
    </Providers>
  );
}