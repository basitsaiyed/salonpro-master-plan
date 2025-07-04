import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Scissors,
  Users,
  FileText,
  TrendingUp,
  MessageCircle,
  Star,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Calendar,
  DollarSign,
} from "lucide-react"
import { Link } from "react-router-dom"

const Landing = () => {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: "Customer Management",
      description:
        "Organize customer details, track preferences, and maintain complete client profiles.",
    },
    {
      icon: <Calendar className="h-8 w-8 text-green-500" />,
      title: "Service Scheduling",
      description:
        "Manage your service catalog with pricing and availability for seamless booking.",
    },
    {
      icon: <FileText className="h-8 w-8 text-purple-500" />,
      title: "Smart Invoicing",
      description:
        "Generate professional invoices with automatic calculations and payment tracking.",
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-pink-500" />,
      title: "Auto Reminders",
      description:
        "Send WhatsApp & SMS reminders for birthdays, anniversaries, and appointments.",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-orange-500" />,
      title: "Business Analytics",
      description:
        "Track revenue, identify top customers, and get insights to grow your salon.",
    },
    {
      icon: <DollarSign className="h-8 w-8 text-emerald-500" />,
      title: "Revenue Tracking",
      description:
        "Monitor your earnings with detailed reports and export capabilities.",
    },
  ]

  const testimonials = [
    {
      name: "Priya Sharma",
      salon: "Glamour Studio",
      content:
        "SalonPro transformed how I manage my salon. The automated reminders alone increased my customer retention by 40%!",
      rating: 5,
    },
    {
      name: "Rajesh Kumar",
      salon: "Elite Hair Lounge",
      content:
        "Finally, a salon management system that's both powerful and easy to use. My staff loves it!",
      rating: 5,
    },
    {
      name: "Neha Patel",
      salon: "Beauty Haven",
      content:
        "The invoicing feature is fantastic. I can track payments and generate reports in seconds.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-elegant rounded-full blur-sm opacity-30"></div>
                <div className="relative bg-gradient-elegant p-2 rounded-full">
                  <Scissors className="h-6 w-6 text-white" />
                </div>
              </div>

              <div className="bg-gradient-elegant p-2 rounded-full">
                <Scissors className="h-6 w-6 text-black" />
              </div>

              <span className="text-2xl font-bold text-gradient">SalonPro</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button
                  variant="ghost"
                  className="text-black  hover:text-white"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-elegant hover:opacity-90 text-white bg-indigo-400 hover:bg-indigo-400 hover:text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse-glow"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-200 rounded-full opacity-20 animate-bounce-slow"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-slate-200 rounded-full opacity-20 animate-pulse-glow"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Transform Your
              <span className="block text-gradient">Salon Management</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Streamline your salon operations with our all-in-one management
              platform. From customer management to automated reminders, we've
              got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-gradient-elegant hover:opacity-90 bg-white hover:bg-indigo-400 text-black hover:text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-3 text-lg hover:text-black font-semibold border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to Run Your Salon
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Powerful features designed specifically for salon owners to manage
              their business efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-md"
              >
                <CardContent className="p-6">
                  <div className="mb-4 transform group-hover:scale-110 transition-transform duration-200">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Loved by Salon Owners
            </h2>
            <p className="text-xl text-slate-600">
              See what our customers have to say about SalonPro
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {testimonial.name}
                    </p>
                    <p className="text-slate-600 text-sm">
                      {testimonial.salon}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-20 bg-gradient-elegant text-white relative overflow-hidden">
        // Animated Background Elements
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-20 animate-float">
            <Sparkles className="h-12 w-12 text-white opacity-20" />
          </div>
          <div className="absolute bottom-20 left-20 animate-float" style={{ animationDelay: '1s' }}>
            <Star className="h-16 w-16 text-white opacity-20" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Salon?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of salon owners who have already streamlined their operations with SalonPro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                Start Your Free Trial
                <CheckCircle className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <p className="text-sm mt-4 opacity-75">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-slate-200 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-gradient-elegant p-2 rounded-full">
                <Scissors className="h-6 w-6 text-black" />
              </div>
              <span className="text-2xl text-black font-semibold">
                SalonPro
              </span>
            </div>
            <div className="text-gray-500 font-semibold text-sm">
              © 2024 SalonPro. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
