import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Truck, LayoutDashboard, BellRing, FileText } from "lucide-react";
import HeatingOilLogo from "@/components/heating-oil-logo";

export default function Navigation() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isAuthenticated = !!user;

  const navigation = [
    { name: "Compare Prices", href: "/compare", icon: Truck },
    ...(isAuthenticated ? [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Price Alerts", href: "/alerts", icon: BellRing },
      { name: "Saved Quotes", href: "/saved-quotes", icon: FileText }
    ] : []),
    { name: "Suppliers", href: "/suppliers", icon: null },
  ];

  const NavItems = ({ mobile = false }) => (
    <>
      {navigation.map((item) => {
        const isActive = location === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`
              ${mobile 
                ? "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors" 
                : "font-medium transition-colors"
              }
              ${isActive
                ? mobile 
                  ? "bg-blue-50 text-primary" 
                  : "text-primary"
                : mobile
                  ? "text-gray-700 hover:bg-gray-50 hover:text-primary"
                  : "text-gray-700 hover:text-primary"
              }
            `}
            onClick={() => setIsOpen(false)}
          >
            {mobile && item.icon && <item.icon className="h-5 w-5" />}
            <span>{item.name}</span>
          </Link>
        );
      })}
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
            {/* Desktop Auth Buttons */}
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center space-x-2 sm:space-x-4">
                {user?.firstName && (
                  <span className="text-gray-700 truncate max-w-24">Hi, {user.firstName}</span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = "/api/logout"}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link href="/auth">Sign In</Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-primary text-white hover:bg-blue-700"
                  asChild
                >
                  <Link href="/auth">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden h-10 w-10">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px] p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="p-6 border-b">
                    <HeatingOilLogo size="lg" />
                    <h2 className="text-lg font-semibold mt-2">NI Heating Oil</h2>
                    {isAuthenticated && user?.firstName && (
                      <p className="text-sm text-gray-600 mt-1">Welcome, {user.firstName}!</p>
                    )}
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 py-4 overflow-y-auto">
                    <div className="space-y-1 px-3">
                      <NavItems mobile={true} />
                    </div>
                  </nav>

                  {/* Mobile Auth Actions */}
                  <div className="p-4 border-t bg-gray-50 space-y-2">
                    {isAuthenticated ? (
                      <Button
                        variant="outline"
                        onClick={() => window.location.href = "/api/logout"}
                        className="w-full justify-center"
                      >
                        Sign Out
                      </Button>
                    ) : (
                      <>
                        <Link href="/auth" className="block">
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setIsOpen(false)}
                          >
                            Sign In
                          </Button>
                        </Link>
                        <Link href="/auth" className="block">
                          <Button
                            className="w-full bg-primary hover:bg-blue-700"
                            onClick={() => setIsOpen(false)}
                          >
                            Get Started
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}