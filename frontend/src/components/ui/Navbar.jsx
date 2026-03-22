import Link from 'next/link';
import Button from './Button';

export default function Navbar() {
  return (
    <nav className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-primary font-bold text-2xl tracking-tight">
              DigitalTalent
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <Link href="/login" className="text-foreground hover:text-primary font-medium transition-colors">
              Log in
            </Link>
            <Link href="/register">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
