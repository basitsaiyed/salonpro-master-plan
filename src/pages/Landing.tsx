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

            <div>
              <div className="text-gray-500 font-semibold text-sm">
                © 2024 SalonPro. All rights reserved.
              </div>

              <div className="mt-2 ml-20 mr-20 flex justify-between items-center">
                <button
                  onClick={() =>
                    window.open("https://www.youtube.com/", "_blank")
                  }
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    margin: 0,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    width="20"
                    fill="black"
                    viewBox="0 0 576 512"
                  >
                    <path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z" />
                  </svg>
                </button>

                <button
                  onClick={() =>
                    window.open("https://www.instagram.com/", "_blank")
                  }
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    margin: 0,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    width="20"
                    fill="black"
                    viewBox="0 0 448 512"
                  >
                    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                  </svg>
                </button>

                <button
                  onClick={() =>
                    window.open("https://www.facebook.com/", "_blank")
                  }
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    margin: 0,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    width="20"
                    fill="black"
                    viewBox="0 0 512 512"
                  >
                    <path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
