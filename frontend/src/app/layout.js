import "./globals.css";

export const metadata = {
  title: "Digital Talent Management System",
  description: "Manage your digital workforce efficiently.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased font-sans bg-gray-50 min-h-screen">
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
