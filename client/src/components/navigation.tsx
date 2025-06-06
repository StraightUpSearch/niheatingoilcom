import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Truck, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import HeatingOilLogo from "@/components/heating-oil-logo";

export default function Navigation() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const isAuthenticated = !!user;

  const navigation = [
    { name: "Compare Prices", href: "/compare" },
    ...(isAuthenticated ? [{ name: "Price Alerts", href: "/alerts" }] : []),
    { name: "Suppliers", href: "/suppliers" },
  ];

  const NavItems = () => (
    <>
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={`font-medium transition-colors ${
            location === item.href
              ? "text-primary"
              : "text-gray-700 hover:text-primary"
          }`}
          onClick={() => setIsOpen(false)}
        >
          {item.name}
        </Link>
      ))}
    </>
  );

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center min-w-0 flex-1">
            <Link href="/" className="flex items-center space-x-2 min-w-0 hover:opacity-80 transition-opacity">
              <HeatingOilLogo size="lg" />
              <div className="flex flex-col min-w-0">
                <span className="text-lg sm:text-xl font-bold text-gray-900 truncate cursor-pointer">NI Heating Oil</span>
              </div>
            </Link>
            <nav className="hidden lg:flex space-x-4 xl:space-x-6 ml-4 xl:ml-8">
              <NavItems />
            </nav>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 sm:space-x-4">
                {user?.firstName && (
                  <span className="text-gray-700 hidden sm:block truncate max-w-24">Hi, {user.firstName}</span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = "/api/logout"}
                  className="hidden sm:flex"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex"
                >
                  <Link href="/auth">Sign In</Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-primary text-white hover:bg-blue-700 hidden sm:flex"
                >
                  <Link href="/auth">Get Started</Link>
                </Button>
              </div>
            )}

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <nav className="flex flex-col space-y-4 mt-6">
                  <NavItems />
                  <div className="flex flex-col space-y-3 pt-4 border-t">
                    {isAuthenticated ? (
                      <>
                        {user?.firstName && (
                          <span className="text-gray-700 text-sm">Hi, {user.firstName}</span>
                        )}
                        <Button
                          variant="outline"
                          onClick={() => window.location.href = "/api/logout"}
                          className="justify-start"
                        >
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link href="/auth">
                          <Button
                            variant="ghost"
                            className="justify-start w-full"
                            onClick={() => setIsOpen(false)}
                          >
                            Sign In
                          </Button>
                        </Link>
                        <Link href="/register">
                          <Button
                            className="justify-start w-full"
                            onClick={() => setIsOpen(false)}
                          >
                            Get Started
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}