
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scissors, Sparkles, Star, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    salonName: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register attempt:", formData);
    // TODO: Implement actual registration logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-teal-200 rounded-full opacity-20 animate-bounce" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-cyan-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-green-200 rounded-full opacity-20 animate-bounce" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
        
        {/* Floating Icons */}
        <div className="absolute top-32 right-1/3 animate-float">
          <Heart className="h-6 w-6 text-emerald-300 opacity-60" />
        </div>
        <div className="absolute bottom-40 left-1/3 animate-float" style={{ animationDelay: '1s' }}>
          <Sparkles className="h-7 w-7 text-teal-300 opacity-60" />
        </div>
        <div className="absolute top-1/2 right-20 animate-float" style={{ animationDelay: '2.5s' }}>
          <Star className="h-5 w-5 text-cyan-300 opacity-60" />
        </div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <div className="relative bg-white p-4 rounded-full shadow-lg">
                <Scissors className="h-12 w-12" style={{ color: '#10B981' }} />
              </div>
            </div>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            SalonPro
          </h2>
          <p className="mt-2 text-sm text-gray-600">Join thousands of salon owners</p>
        </div>
        
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-semibold text-gray-800">Create Account</CardTitle>
            <p className="text-gray-600 text-sm">Start your salon management journey</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salonName" className="text-gray-700 font-medium">Salon Name</Label>
                  <Input
                    id="salonName"
                    type="text"
                    value={formData.salonName}
                    onChange={handleChange}
                    placeholder="Salon name"
                    className="h-11 border-gray-200 focus:border-emerald-400 focus:ring-emerald-400 transition-all duration-200"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerName" className="text-gray-700 font-medium">Owner Name</Label>
                  <Input
                    id="ownerName"
                    type="text"
                    value={formData.ownerName}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="h-11 border-gray-200 focus:border-emerald-400 focus:ring-emerald-400 transition-all duration-200"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="h-11 border-gray-200 focus:border-emerald-400 focus:ring-emerald-400 transition-all duration-200"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 font-medium">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="h-11 border-gray-200 focus:border-emerald-400 focus:ring-emerald-400 transition-all duration-200"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="h-11 border-gray-200 focus:border-emerald-400 focus:ring-emerald-400 transition-all duration-200"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm"
                    className="h-11 border-gray-200 focus:border-emerald-400 focus:ring-emerald-400 transition-all duration-200"
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 mt-6"
              >
                Create Account
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link to="/login" className="text-emerald-600 hover:text-emerald-500 font-medium hover:underline transition-colors duration-200">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Register;
