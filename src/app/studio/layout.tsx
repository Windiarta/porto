export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen h-screen">{children}</body>
    </html>
  );
}


