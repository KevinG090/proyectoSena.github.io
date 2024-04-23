import Navbar from "@/app/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <section className="main_page flex min-h-screen flex-col items-center">
      <Navbar />
      {children}
    </section>
  )
}