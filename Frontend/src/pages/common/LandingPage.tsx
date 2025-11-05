'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Trophy, 
  Users, 
  Zap, 
  Shield, 
  ArrowRight,
  CheckCircle2,
  Star,
  TrendingUp
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { secureTokenStorage } from '@/services/api'

export default function Landing() {
  const navigate = useNavigate()
  const tokenData = secureTokenStorage.get();
  const token = tokenData ? tokenData.token : null;
  const features = [
    {
      icon: BookOpen,
      title: '1000+ Practice Quizzes',
      desc: 'Covering JavaScript, React, Node.js, Databases, and more.'
    },
    {
      icon: Trophy,
      title: 'Track Your Progress',
      desc: 'Detailed analytics, leaderboards, and achievement badges.'
    },
    {
      icon: Users,
      title: 'Community Learning',
      desc: 'Compete with peers and see how you rank globally.'
    },
    {
      icon: Zap,
      title: 'Instant Feedback',
      desc: 'Real-time scoring and explanations after every question.'
    },
    {
      icon: Shield,
      title: 'Admin Dashboard',
      desc: 'Full control to create, manage, and analyze quizzes.'
    },
    {
      icon: TrendingUp,
      title: 'Proven Results',
      desc: 'Users improve 3x faster with structured practice.'
    }
  ]

  const stats = [
    { label: 'Active Users', value: '12,847', growth: '+23%' },
    { label: 'Quizzes Completed', value: '56,392', growth: '+18%' },
    { label: 'Avg. Score', value: '78%', growth: '+5%' },
    { label: 'Categories', value: '12+', growth: '' }
  ]

  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-[radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <Badge className="mb-4" variant="secondary">
              <Star className="h-3 w-3 mr-1" />
              Rated 4.9/5 by 10,000+ learners
            </Badge>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 mb-6">
              Master Coding with{' '}
              <span className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Interactive Quizzes
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Practice real-world coding problems. Get instant feedback. Track your progress. 
              Level up faster than ever before.
            </p>

            {token ? (
              <Button
                onClick={() => navigate("/user/dashboard")}
                className="bg-blue-600 hover:bg-blue-900 text-white px-5 py-2 rounded-md shadow-md transition duration-200"
              >
                Continue Browsing
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="gap-2 text-lg px-8"
                  onClick={() => navigate('/login')}
                >
                  Start Learning Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8"
                  onClick={() => navigate('/admin')}
                >
                  <Shield className="h-5 w-5 mr-2" />
                  Admin Access
                </Button>
              </div>
            )}

            <div className="mt-16 flex justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image / Mockup */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
          <div className="bg-linear-to-r from-blue-500 to-purple-600 p-1 rounded-2xl shadow-2xl">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4">
              <div className="bg-gray-100 border-2 border-dashed rounded-xl h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto mb-4" />
                  <p className="text-gray-500">Dashboard Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                {stat.growth && (
                  <div className="text-xs text-green-600 font-medium mt-1 flex items-center justify-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {stat.growth} this month
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From beginners to advanced developers — our platform adapts to your skill level.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white mb-4">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.desc}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          {token ? (
              <Button
                onClick={() => navigate("/user/dashboard")}
                className="bg-blue-600 hover:bg-blue-900 text-white px-5 py-2 rounded-md shadow-md transition duration-200"
              >
                Continue Browsing
              </Button>
            ) : (
              <>
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Start Your Learning Journey?
              </h2>
              <p className="text-xl text-blue-100 mb-10">
                Join thousands of developers improving their skills every day.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="text-lg px-8"
                  onClick={() => navigate("/auth?path=register")}
                >
                  Create Free Account
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 border-white text-white hover:bg-white hover:text-purple-600"
                  onClick={() => navigate("/auth?path=login")}
                >
                  Sign In
                </Button>
              </div>
              </>
            )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">QuizMaster Pro</h3>
              <p className="text-sm">Learn faster. Code better. Succeed sooner.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            © 2025 QuizMaster Pro. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  )
}