import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Truck } from "lucide-react";
import HeatingOilLogo from "@/components/heating-oil-logo";

export default function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Compare Prices", href: "/compare" },
    ...(isAuthenticated ? [{ name: "Price Alerts", href: "/alerts" }] : []),
    { name: "Suppliers", href: "/suppliers" },
    { name: "Blog", href: "/blog" },
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
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <HeatingOilLogo size="lg" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900">NI Heating Oil</span>
                <span className="text-xs text-green-600 font-medium hidden sm:block">By locals, for locals</span>
              </div>
            </Link>
            <nav className="hidden md:flex space-x-6 ml-8">
              <NavItems />
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {user?.firstName && (
                  <span className="text-gray-700">Hi, {user.firstName}</span>
                )}
                <Button
                  variant="outline"
                  onClick={() => window.location.href = "/api/logout"}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => window.location.href = "/api/login"}
                  className="text-primary hover:text-blue-700"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => window.location.href = "/api/login"}
                  className="bg-primary text-white hover:bg-blue-700"
                >
                  Get Started
                </Button>
              </div>
            )}
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-6">
                  <NavItems />
                  {!isAuthenticated && (
                    <div className="flex flex-col space-y-2 pt-4 border-t">
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
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
