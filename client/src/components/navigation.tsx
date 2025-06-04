import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Truck } from "lucide-react";
import HeatingOilLogo from "@/components/heating-oil-logo";
import logoUrl from "@assets/Untitled design (1).png";

export default function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

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
              <img 
                src={logoUrl} 
                alt="NI Heating Oil Logo" 
                className="h-10 w-10 sm:h-12 sm:w-12"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-lg sm:text-xl font-bold text-gray-900 truncate cursor-pointer">NI Heating Oil</span>
              </div>
            </Link>
            <nav className="hidden lg:flex space-x-4 xl:space-x-6 ml-4 xl:ml-8">
              <NavItems />
            </nav>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
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
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.href = "/api/login"}
                  className="text-primary hover:text-blue-700 hidden sm:flex"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => window.location.href = "/api/login"}
                  className="bg-primary text-white hover:bg-blue-700 hidden sm:flex"
                >
                  Get Started
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
                        <Button
                          variant="ghost"
                          onClick={() => window.location.href = "/api/login"}
                          className="justify-start"
                        >
                          Sign In
                        </Button>
                        <Button
                          onClick={() => window.location.href = "/api/login"}
                          className="justify-start"
                        >
                          Get Started
                        </Button>
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
