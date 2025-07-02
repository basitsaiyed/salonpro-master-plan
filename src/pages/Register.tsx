import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scissors, Sparkles, Star, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    salonName: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      // You can add a toast here for password mismatch
      return;
    }
    
    setIsLoading(true);
    
    const success = await register({
      owner: formData.ownerName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      salonName: formData.salonName
    });
    
    if (success) {
      navigate('/dashboard');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-200 rounded-full opacity-20 animate-pulse-glow"></div>
        <div className="absolute top-1/3 -left-20 w-48 h-48 bg-gradient-elegant rounded-full opacity-10 animate-bounce-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-blue-200 rounded-full opacity-20 animate-pulse-glow"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-slate-200 rounded-full opacity-20 animate-bounce-slow"></div>
        
        {/* Floating Icons */}
        <div className="absolute top-32 right-1/3 animate-float">
          <Heart className="h-6 w-6 text-blue-400 opacity-40" />
        </div>
        <div className="absolute bottom-40 left-1/3 animate-float" style={{ animationDelay: '1s' }}>
          <Sparkles className="h-7 w-7 text-indigo-400 opacity-40" />
        </div>
        <div className="absolute top-1/2 right-20 animate-float" style={{ animationDelay: '2.5s' }}>
          <Star className="h-5 w-5 text-slate-400 opacity-40" />
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
          <p className="text-slate-600">Join thousands of salon owners</p>
        </div>
        
        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-semibold text-slate-800">Create Account</CardTitle>
            <p className="text-slate-600 text-sm">Start your salon management journey</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salonName" className="text-slate-700 font-medium">Salon Name</Label>
                  <Input
                    id="salonName"
                    type="text"
                    value={formData.salonName}
                    onChange={handleChange}
                    placeholder="Salon name"
                    className="h-11 border-slate-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-200"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerName" className="text-slate-700 font-medium">Owner Name</Label>
                  <Input
                    id="ownerName"
                    type="text"
                    value={formData.ownerName}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="h-11 border-slate-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-200"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="h-11 border-slate-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-200"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-700 font-medium">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="h-11 border-slate-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-200"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="h-11 border-slate-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-200"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">Confirm</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm"
                    className="h-11 border-slate-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-200"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-elegant hover:opacity-90 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] mt-6"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <span className="text-slate-600">Already have an account? </span>
              <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium hover:underline transition-colors duration-200">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
