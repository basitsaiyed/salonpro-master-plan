
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scissors, Sparkles, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse-glow"></div>
        <div className="absolute top-1/4 -right-20 w-48 h-48 b-gradient-elegant rounded-full opacity-10 animate-bounce-slow"></div>
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-indigo-200 rounded-full opacity-20 animate-pulse-glow"></div>
        <div className="absolute bottom-10 right-1/4 w-20 h-20 bg-slate-200 rounded-full opacity-20 animate-bounce-slow"></div>
        
        <div className="absolute top-20 left-1/3 animate-float">
          <Sparkles className="h-6 w-6 text-blue-400 opacity-40" />
        </div>
        <div className="absolute bottom-32 right-1/3 animate-float" style={{ animationDelay: '2s' }}>
          <Star className="h-8 w-8 text-indigo-400 opacity-40" />
        </div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-elegant rounded-full blur-lg opacity-30 animate-pulse-glow"></div>
              <div className="relative bg-white p-4 rounded-full shadow-xl">
                <Scissors className="h-12 w-12 text-gradient" />
              </div>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gradient mb-2">
            SalonPro
          </h2>
          <p className="text-slate-600">Transform your salon management experience</p>
        </div>
        
        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-semibold text-slate-800">Welcome Back</CardTitle>
            <p className="text-slate-600 text-sm">Sign in to your salon account</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="h-12 border-slate-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-200"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-12 border-slate-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-200"
                  required
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-elegant hover:opacity-90 hover:bg-indigo-400 text-gray-700 hover:text-white  font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <span className="text-slate-600">Don't have an account? </span>
              <Link to="/register" className="text-blue-600 hover:text-blue-500 font-medium hover:underline transition-colors duration-200">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
