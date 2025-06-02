import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { Loader2, User, Mail, Lock, Fuel } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function AuthPage() {
  usePageTitle("Sign In | NI Heating Oil");
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({ username: "", email: "", password: "" });

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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center p-4">
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
              Built by locals, for locals. Compare official Consumer Council prices across all six counties and save on your heating oil deliveries.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">25+</div>
              <div className="text-sm text-blue-100">Oil Suppliers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">£150+</div>
              <div className="text-sm text-blue-100">Average Savings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">1200+</div>
              <div className="text-sm text-blue-100">Happy Users</div>
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
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="register">Create Account</TabsTrigger>
                </TabsList>

                {/* Login Form */}
                <TabsContent value="login">
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
                          Signing In...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </TabsContent>

                {/* Register Form */}
                <TabsContent value="register">
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
                        Email (Optional)
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-email"
                          type="email"
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
  );
}