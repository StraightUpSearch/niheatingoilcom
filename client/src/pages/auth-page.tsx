import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { Loader2, User, Mail, Lock, Fuel } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function AuthPage() {
  usePageTitle("Sign In | NI Heating Oil");
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();

  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    phone: ""
  });
  const [providers, setProviders] = useState<{ google: boolean; facebook: boolean }>({ google: false, facebook: false });

  useEffect(() => {
    fetch("/api/auth/providers")
      .then(r => r.json())
      .then(setProviders)
      .catch(() => {});
  }, []);

  // Redirect if already logged in
  if (user) {
    setLocation("/");
    return null;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(registerData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
      <Navigation />
      <div className="flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

          {/* Hero Section */}
          <div className="text-white space-y-6 order-2 lg:order-1">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Fuel className="h-10 w-10" />
                <h1 className="text-3xl font-bold">NI Heating Oil</h1>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                Compare Heating Oil Prices Across Northern Ireland
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Compare heating oil prices from local suppliers across Northern Ireland. Free, independent, and updated regularly.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <span className="text-lg">Prices updated regularly from supplier websites</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <span className="text-lg">Price alerts when oil drops in your area</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <span className="text-lg">Compare 300L, 500L, and 900L options</span>
              </div>
            </div>
          </div>

          {/* Auth Forms */}
          <div className="order-1 lg:order-2">
            <Card className="w-full max-w-md mx-auto shadow-2xl border-0">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">Welcome</CardTitle>
                <CardDescription className="text-gray-600">
                  Sign in to save on heating oil or create your free account
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Social Login Buttons */}
                {(providers.google || providers.facebook) && (
                  <div className="space-y-3 mb-6">
                    {providers.google && (
                      <a href="/api/auth/google" className="block">
                        <Button variant="outline" className="w-full h-11 font-medium" type="button">
                          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          Continue with Google
                        </Button>
                      </a>
                    )}
                    {providers.facebook && (
                      <a href="/api/auth/facebook" className="block">
                        <Button variant="outline" className="w-full h-11 font-medium bg-[#1877F2] text-white hover:bg-[#166FE5] hover:text-white border-[#1877F2]" type="button">
                          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                          Continue with Facebook
                        </Button>
                      </a>
                    )}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Or continue with email</span>
                      </div>
                    </div>
                  </div>
                )}

                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Sign In</TabsTrigger>
                    <TabsTrigger value="register">Create Account</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="space-y-4">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-username" className="text-sm font-medium text-gray-700">
                          Username
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="login-username"
                            type="text"
                            value={loginData.username}
                            onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                            placeholder="Enter your username"
                            className="pl-10 h-11"
                            required
                            disabled={loginMutation.isPending}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="login-password" className="text-sm font-medium text-gray-700">
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="login-password"
                            type="password"
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            placeholder="Enter your password"
                            className="pl-10 h-11"
                            required
                            disabled={loginMutation.isPending}
                          />
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                        disabled={loginMutation.isPending || !loginData.username || !loginData.password}
                      >
                        {loginMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          "Sign In"
                        )}
                      </Button>

                      <div className="text-center mt-4">
                        <a 
                          href="/forgot-password" 
                          className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          Forgot your password?
                        </a>
                      </div>
                    </form>
                  </TabsContent>

                  <TabsContent value="register" className="space-y-4">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-username" className="text-sm font-medium text-gray-700">
                          Username
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-username"
                            type="text"
                            value={registerData.username}
                            onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                            placeholder="Choose a username"
                            className="pl-10 h-11"
                            required
                            disabled={registerMutation.isPending}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-email" className="text-sm font-medium text-gray-700">
                          Email Address
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-email"
                            type="email"
                            required
                            value={registerData.email}
                            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                            placeholder="your.email@example.com"
                            className="pl-10 h-11"
                            disabled={registerMutation.isPending}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-password" className="text-sm font-medium text-gray-700">
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-password"
                            type="password"
                            value={registerData.password}
                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                            placeholder="Create a secure password"
                            className="pl-10 h-11"
                            required
                            disabled={registerMutation.isPending}
                          />
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-medium"
                        disabled={registerMutation.isPending || !registerData.username || !registerData.password}
                      >
                        {registerMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">
                    By creating an account, you agree to save money on heating oil in Northern Ireland
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}