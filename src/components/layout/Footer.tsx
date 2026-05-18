export function Footer() {
  return (
    <footer className="mt-16 border-t border-border py-8">
      <p className="text-center text-sm text-muted">
        © {new Date().getFullYear()} Dev Blog. Built with Next.js & Supabase.
      </p>
    </footer>
  );
}
