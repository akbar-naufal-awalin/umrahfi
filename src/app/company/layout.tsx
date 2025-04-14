import DashboardLayout from '@/components/dashboard/Layout';

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
} 