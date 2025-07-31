import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scissors, Sparkles, Star, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation functions
  const validateEmail = (email: string): string => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    if (email.length > 254) return "Email is too long";
    return "";
  };

  const validatePassword = (password: string): string => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  // Real-time validation
  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (touched.email) {
      const error = validateEmail(value);
      setErrors(prev => ({ ...prev, email: error }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (touched.password) {
      const error = validatePassword(value);
      setErrors(prev => ({ ...prev, password: error }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    if (field === 'email') {
      const error = validateEmail(email);
      setErrors(prev => ({ ...prev, email: error }));
    } else if (field === 'password') {
      const error = validatePassword(password);
      setErrors(prev => ({ ...prev, password: error }));
    }
  };

  const validateForm = (): boolean => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    const newErrors = {
      email: emailError,
      password: passwordError
    };

    setErrors(newErrors);
    setTouched({ email: true, password: true });

    return !emailError && !passwordError;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(email.trim(), password);
      if (success) {
        toast.success("Login successful!");
        navigate('/dashboard');
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse-glow"></div>
        <div className="absolute top-1/4 -right-20 w-48 h-48 bg-gradient-elegant rounded-full opacity-10 animate-bounce-slow"></div>
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
            <form onSubmit={handleLogin} className="space-y-6" noValidate>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  placeholder="Enter your email"
                  className={`h-12 border-slate-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-200 ${errors.email ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : ''
                    }`}
                  disabled={isLoading}
                  autoComplete="email"
                />
                {errors.email && (
                  <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    onBlur={() => handleBlur('password')}
                    placeholder="Enter your password"
                    className={`h-12 pr-10 border-slate-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-200 ${errors.password ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : ''
                      }`}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors duration-200"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>


              <Button
                type="submit"
                className="w-full h-12 bg-gradient-elegant hover:opacity-90 hover:bg-indigo-400 text-gray-700 hover:text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                disabled={isLoading || Object.values(errors).some(error => error !== '')}
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