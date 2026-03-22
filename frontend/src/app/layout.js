import "./globals.css";

export const metadata = {
  title: "Digital Talent Management System",
  description: "Manage your digital workforce efficiently.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased font-sans bg-gray-100 flex items-center justify-center min-h-screen">
        {/* Mobile App Container Constraint */}
        <main className="w-full max-w-[400px] min-h-[100dvh] sm:min-h-[850px] sm:h-[850px] sm:rounded-[40px] bg-background shadow-airbnb overflow-hidden relative flex flex-col ring-1 ring-gray-200 sm:m-4">
          {children}
        </main>
      </body>
    </html>
  );
}
