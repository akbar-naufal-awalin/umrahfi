import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | UmrahFi",
  description: "Login to access your UmrahFi account",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      {children}
    </div>
  );
} 