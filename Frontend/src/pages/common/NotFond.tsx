'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Home, 
  Search, 
  Zap, 
  BookOpen,
  AlertCircle
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <>
      {/* Full-screen gradient background */}
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 overflow-hidden">
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 mask-[radial-gradient(ellipse_at_center,transparent_20%,black)]" />

        <div className="relative z-10 max-w-4xl w-full text-center">
          
          {/* 404 Large Text with Gradient */}
          <div className="mb-8">
            <h1 className="text-9xl md:text-[12rem] font-bold tracking-tighter bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
              404
            </h1>
          </div>

          {/* Main Message */}
          <div className="mb-6">
            <Badge variant="secondary" className="mb-4">
              <AlertCircle className="h-3 w-3 mr-1" />
              Page Not Found
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Oops! Looks like this quiz doesn't exist.
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The page you're looking for might have been moved, deleted, or is temporarily unavailable.
            </p>
          </div>

          {/* Fun Illustration Card */}
          <Card className="mx-auto max-w-md mb-10 overflow-hidden shadow-xl">
            <div className="bg-linear-to-br from-blue-500 to-purple-600 p-8 relative">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-4 left-4 w-16 h-16 bg-white rounded-full animate-bounce" />
                <div className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full animate-bounce delay-300" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full animate-ping" />
              </div>
              <div className="relative z-10 text-white text-center">
                <Search className="h-16 w-16 mx-auto mb-3" />
                <p className="text-sm font-medium">Searching the entire codebase...</p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="gap-2 text-lg px-8 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => navigate('/')}
            >
              <Home className="h-5 w-5" />
              Back to Home
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 border-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Quick Links */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center justify-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Explore Popular Sections
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <a 
                href="/quizzes/javascript" 
                className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">JavaScript</p>
                  <p className="text-sm text-gray-500">200+ quizzes</p>
                </div>
              </a>
              <a 
                href="/quizzes/react" 
                className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <div className="text-purple-600 font-bold text-xs">JSX</div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">React</p>
                  <p className="text-sm text-gray-500">150+ quizzes</p>
                </div>
              </a>
              <a 
                href="/leaderboard" 
                className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <div className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Leaderboard</p>
                  <p className="text-sm text-gray-500">Top 100 coders</p>
                </div>
              </a>
            </div>
          </div>

          {/* Footer Note */}
          <p className="mt-12 text-sm text-gray-500">
            Still lost? <a href="mailto:support@quizmaster.pro" className="text-blue-600 hover:underline">Contact support</a>
          </p>
        </div>
      </div>
    </>
  )
}