import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scissors, Sparkles, Star, Heart, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    salonName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const { register } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation functions
  const validateSalonName = (name: string): string => {
    if (!name.trim()) return "Salon name is required";
    if (name.trim().length < 2) return "Salon name must be at least 2 characters";
    if (name.trim().length > 50) return "Salon name must be less than 50 characters";
    if (!/^[a-zA-Z0-9\s&'-]+$/.test(name.trim())) return "Salon name contains invalid characters";
    return "";
  };

  const validateOwnerName = (name: string): string => {
    if (!name.trim()) return "Owner name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    if (name.trim().length > 50) return "Name must be less than 50 characters";
    if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) return "Name can only contain letters, spaces, hyphens, and apostrophes";
    return "";
  };

  const validateEmail = (email: string): string => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    if (email.length > 254) return "Email is too long";
    return "";
  };

  const validatePhone = (phone: string): string => {
    if (!phone.trim()) return "Phone number is required";
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) return "Phone number must be at least 10 digits";
    if (cleanPhone.length > 15) return "Phone number must be less than 15 digits";
    if (!/^\+?[\d\s\-\(\)\.]+$/.test(phone)) return "Invalid phone number format";
    return "";
  };

  const validateAddress = (address: string): string => {
    if (!address.trim()) return "Address is required";
    if (address.trim().length < 10) return "Please enter a complete address";
    if (address.trim().length > 200) return "Address is too long";
    return "";
  };

  const validatePassword = (password: string): string => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (password.length > 128) return "Password is too long";
    if (!/(?=.*[a-z])/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/(?=.*\d)/.test(password)) return "Password must contain at least one number";
    if (!/(?=.*[@$!%*?&])/.test(password)) return "Password must contain at least one special character (@$!%*?&)";
    return "";
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): string => {
    if (!confirmPassword) return "Please confirm your password";
    if (password !== confirmPassword) return "Passwords do not match";
    return "";
  };

  // Real-time validation handler
  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (touched[field]) {
      let error = "";
      switch (field) {
        case 'salonName':
          error = validateSalonName(value);
          break;
        case 'ownerName':
          error = validateOwnerName(value);
          break;
        case 'email':
          error = validateEmail(value);
          break;
        case 'phone':
          error = validatePhone(value);
          break;
        case 'address':
          error = validateAddress(value);
          break;
        case 'password':
          error = validatePassword(value);
          // Also revalidate confirm password if it's been touched
          if (touched.confirmPassword) {
            const confirmError = validateConfirmPassword(value, formData.confirmPassword);
            setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
          }
          break;
        case 'confirmPassword':
          error = validateConfirmPassword(formData.password, value);
          break;
      }
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    let error = "";
    const value = formData[field as keyof typeof formData];

    switch (field) {
      case 'salonName':
        error = validateSalonName(value);
        break;
      case 'ownerName':
        error = validateOwnerName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'phone':
        error = validatePhone(value);
        break;
      case 'address':
        error = validateAddress(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(formData.password, value);
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors = {
      salonName: validateSalonName(formData.salonName),
      ownerName: validateOwnerName(formData.ownerName),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      address: validateAddress(formData.address),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.password, formData.confirmPassword)
    };

    setErrors(newErrors);
    setTouched({
      salonName: true,
      ownerName: true,
      email: true,
      phone: true,
      address: true,
      password: true,
      confirmPassword: true
    });

    return Object.values(newErrors).every(error => error === "");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix all validation errors before submitting");
      return;
    }

    setIsLoading(true);

    try {
      const success = await register({
        name: formData.ownerName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim(),
        salonName: formData.salonName.trim(),
        address: formData.address.trim()
      });

      if (success) {
        toast.success("Account created successfully! Welcome to SalonPro!");
        navigate("/dashboard");
      } else {
        toast.error("Registration failed. This email or phone number may already be in use.");
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get field status
  const getFieldStatus = (field: string) => {
    if (!touched[field]) return 'default';
    return errors[field] ? 'error' : 'valid';
  };

  const isFormValid = Object.values(errors).every(error => error === "") &&
    Object.keys(formData).every(key => formData[key as keyof typeof formData].trim() !== "");

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
            <form onSubmit={handleRegister} className="space-y-4" noValidate>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salonName" className="text-slate-700 font-medium">Salon Name</Label>
                  <div className="relative">
                    <Input
                      autoFocus
                      id="salonName"
                      type="text"
                      value={formData.salonName}
                      onChange={(e) => handleFieldChange('salonName', e.target.value)}
                      onBlur={() => handleBlur('salonName')}
                      placeholder="Salon name"
                      className={`h-11 pr-8 border-slate-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-200 ${getFieldStatus('salonName') === 'error' ? 'border-red-300 focus:border-red-400 focus:ring-red-400' :
                        getFieldStatus('salonName') === 'valid' ? 'border-green-300 focus:border-green-400 focus:ring-green-400' : ''
                        }`}
                      disabled={isLoading}
                      autoComplete="organization"
                    />
                    {getFieldStatus('salonName') === 'valid' && (
                      <CheckCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                  </div>
                  {errors.salonName && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.salonName}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerName" className="text-slate-700 font-medium">Owner Name</Label>
                  <div className="relative">
                    <Input
                      id="ownerName"
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) => handleFieldChange('ownerName', e.target.value)}
                      onBlur={() => handleBlur('ownerName')}
                      placeholder="Your name"
                      className={`h-11 pr-8 border-slate-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-200 ${getFieldStatus('ownerName') === 'error' ? 'border-red-300 focus:border-red-400 focus:ring-red-400' :
                        getFieldStatus('ownerName') === 'valid' ? 'border-green-300 focus:border-green-400 focus:ring-green-400' : ''
                        }`}
                      disabled={isLoading}
                      autoComplete="name"
                    />
                    {getFieldStatus('ownerName') === 'valid' && (
                      <CheckCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                  </div>
                  {errors.ownerName && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.ownerName}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    placeholder="Enter your email"
                    className={`h-11 pr-8 border-slate-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-200 ${getFieldStatus('email') === 'error' ? 'border-red-300 focus:border-red-400 focus:ring-red-400' :
                      getFieldStatus('email') === 'valid' ? 'border-green-300 focus:border-green-400 focus:ring-green-400' : ''
                      }`}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                  {getFieldStatus('email') === 'valid' && (
                    <CheckCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                  )}
                </div>
                {errors.email && (
                  <div className="flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-700 font-medium">Phone</Label>
                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    placeholder="Enter your phone number"
                    className={`h-11 pr-8 border-slate-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-200 ${getFieldStatus('phone') === 'error' ? 'border-red-300 focus:border-red-400 focus:ring-red-400' :
                      getFieldStatus('phone') === 'valid' ? 'border-green-300 focus:border-green-400 focus:ring-green-400' : ''
                      }`}
                    disabled={isLoading}
                    autoComplete="tel"
                  />
                  {getFieldStatus('phone') === 'valid' && (
                    <CheckCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                  )}
                </div>
                {errors.phone && (
                  <div className="flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.phone}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-slate-700 font-medium">Address</Label>
                <div className="relative">
                  <Input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleFieldChange('address', e.target.value)}
                    onBlur={() => handleBlur('address')}
                    placeholder="Salon address"
                    className={`h-11 pr-8 border-slate-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-200 ${getFieldStatus('address') === 'error' ? 'border-red-300 focus:border-red-400 focus:ring-red-400' :
                      getFieldStatus('address') === 'valid' ? 'border-green-300 focus:border-green-400 focus:ring-green-400' : ''
                      }`}
                    disabled={isLoading}
                    autoComplete="street-address"
                  />
                  {getFieldStatus('address') === 'valid' && (
                    <CheckCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                  )}
                </div>
                {errors.address && (
                  <div className="flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.address}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleFieldChange('password', e.target.value)}
                      onBlur={() => handleBlur('password')}
                      placeholder="Password"
                      className={`h-11 pr-16 border-slate-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-200 ${getFieldStatus('password') === 'error' ? 'border-red-300 focus:border-red-400 focus:ring-red-400' :
                        getFieldStatus('password') === 'valid' ? 'border-green-300 focus:border-green-400 focus:ring-green-400' : ''
                        }`}
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                    {getFieldStatus('password') === 'valid' && (
                      <CheckCircle className="absolute right-8 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
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
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.password}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">Confirm</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                      onBlur={() => handleBlur('confirmPassword')}
                      placeholder="Confirm"
                      className={`h-11 pr-16 border-slate-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-200 ${getFieldStatus('confirmPassword') === 'error' ? 'border-red-300 focus:border-red-400 focus:ring-red-400' :
                        getFieldStatus('confirmPassword') === 'valid' ? 'border-green-300 focus:border-green-400 focus:ring-green-400' : ''
                        }`}
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                    {getFieldStatus('confirmPassword') === 'valid' && (
                      <CheckCircle className="absolute right-8 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors duration-200"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.confirmPassword}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Password Requirements */}
              {touched.password && formData.password && (
                <div className="bg-slate-50 p-3 rounded-lg text-sm">
                  <p className="font-medium text-slate-700 mb-2">Password Requirements:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={`flex items-center gap-1 ${formData.password.length >= 8 ? 'text-green-600' : 'text-slate-500'
                      }`}>
                      <div className={`w-2 h-2 rounded-full ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-slate-300'
                        }`}></div>
                      <span>8+ characters</span>
                    </div>
                    <div className={`flex items-center gap-1 ${/(?=.*[a-z])/.test(formData.password) ? 'text-green-600' : 'text-slate-500'
                      }`}>
                      <div className={`w-2 h-2 rounded-full ${/(?=.*[a-z])/.test(formData.password) ? 'bg-green-500' : 'bg-slate-300'
                        }`}></div>
                      <span>Lowercase</span>
                    </div>
                    <div className={`flex items-center gap-1 ${/(?=.*[A-Z])/.test(formData.password) ? 'text-green-600' : 'text-slate-500'
                      }`}>
                      <div className={`w-2 h-2 rounded-full ${/(?=.*[A-Z])/.test(formData.password) ? 'bg-green-500' : 'bg-slate-300'
                        }`}></div>
                      <span>Uppercase</span>
                    </div>
                    <div className={`flex items-center gap-1 ${/(?=.*\d)/.test(formData.password) ? 'text-green-600' : 'text-slate-500'
                      }`}>
                      <div className={`w-2 h-2 rounded-full ${/(?=.*\d)/.test(formData.password) ? 'bg-green-500' : 'bg-slate-300'
                        }`}></div>
                      <span>Number</span>
                    </div>
                    <div className={`flex items-center gap-1 col-span-2 ${/(?=.*[@$!%*?&])/.test(formData.password) ? 'text-green-600' : 'text-slate-500'
                      }`}>
                      <div className={`w-2 h-2 rounded-full ${/(?=.*[@$!%*?&])/.test(formData.password) ? 'bg-green-500' : 'bg-slate-300'
                        }`}></div>
                      <span>Special character (@$!%*?&)</span>
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-elegant hover:opacity-90 hover:bg-indigo-400 text-gray-500 hover:text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] mt-6"
                disabled={isLoading || !isFormValid}
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