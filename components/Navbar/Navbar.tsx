"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import EthicConvoLogo from "@/public/assets/logo/EthicConvoLogo";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/constants"
import { NavLinkProps } from "@/types"

// Reusable NavLink component with active state
const NavLink = ({ href, children, className }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link 
      href={href} 
      className={cn(
        "transition-colors hover:text-primary",
        isActive && "text-primary font-medium",
        className
      )}
    >
      {children}
    </Link>
  );
};

const Navbar = () => {
  const pathname = usePathname();

  // Add this new check for /join/ URLs
  const logoHref = pathname.startsWith('/join/') ? '/sessions' : '/';

  // More specific path checking
  const isRootPath = ['/home', '/home/about', '/home/researchers', '/sessions'].includes(pathname);
  const isSessionPathWithId = pathname.match(/^\/sessions\/[\w-]+/) || 
                             pathname.startsWith("/session-dashboard/");

  return (
    <Card className="sticky top-0 z-50 w-full bg-card py-3 px-4 border-0 border-b border-gray-200 flex items-center justify-between gap-6 rounded-2xl mt-5">
      <div className="flex items-center gap-4">
        <Link 
          href={logoHref}
          className="inline-block transition-transform duration-300 hover:scale-105"
        >
          <EthicConvoLogo className="text-primary w-48 h-8 -mt-2" />
        </Link>

        {isSessionPathWithId && (
          <Button 
            variant="ghost" 
            size="sm" 
            asChild 
            className="hidden md:flex items-center gap-2"
          >
            <Link href="/sessions">
              <ArrowLeft className="h-4 w-4" />
              <span>Sessions</span>
            </Link>
          </Button>
        )}
      </div>

      {isRootPath && (
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8">
            {NAV_ITEMS.map(({ label, href }) => (
              <li key={href}>
                <NavLink href={href}>{label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="flex items-center gap-4">
        <SignedIn>
          <UserButton 
            afterSignOutUrl="/" 
            appearance={{
              elements: {
                avatarBox: "h-8 w-8"
              }
            }}
          />
        </SignedIn>

        <SignedOut>
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
        </SignedOut>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              {NAV_ITEMS.map(({ label, href }) => (
                <DropdownMenuItem key={href} asChild>
                  <Link href={href}>{label}</Link>
                </DropdownMenuItem>
              ))}
              <SignedOut>
                <DropdownMenuItem asChild>
                  <Link href="/sign-in">Login</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/sign-up">Get Started</Link>
                </DropdownMenuItem>
              </SignedOut>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <ThemeToggle />
      </div>
    </Card>
  );
};

export default Navbar;