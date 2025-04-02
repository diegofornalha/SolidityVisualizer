import Link from 'next/link';
import { Button } from '~/components/ui/button';
import { FileText, Home } from 'lucide-react';

export function Nav() {
  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center px-4">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <FileText className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              FlowAgents
            </span>
          </Link>
          <div className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/">
              <Button variant="ghost" className="flex items-center">
                <Home className="mr-2 h-4 w-4" />
                Início
              </Button>
            </Link>
            <Link href="/diagramas">
              <Button variant="ghost" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Meus Diagramas
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 