export default function Layout({ children }: { children: React.ReactNode }) {
  return <main className="p-2 space-y-1.5 max-w-4xl mx-auto">{children}</main>;
}
