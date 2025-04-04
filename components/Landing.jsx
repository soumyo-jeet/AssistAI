"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles } from "lucide-react";

const Landing = () => {

  return (
    <section 
      className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/10"
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8 md:space-y-12">
          {/* Animated gradient title with sparkles */}
          <div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -top-6 -left-6 md:-top-8 md:-left-8 w-16 h-16 md:w-20 md:h-20 bg-primary/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-6 -right-6 md:-bottom-8 md:-right-8 w-16 h-16 md:w-20 md:h-20 bg-secondary/20 rounded-full blur-xl"></div>
            
            <h1 className="text-4xl font-bold md:text-6xl lg:text-7xl xl:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary animate-gradient bg-300% leading-tight">
              Your AI Assistance for
              <br />
              <span>
                Grabbing Success
              </span>
            </h1>
                <Sparkles className="absolute -top-4 -right-6 md:-right-8 w-6 h-6 md:w-8 md:h-8 text-yellow-400 animate-pulse" />
          </div>

          {/* Animated subtitle */}
          < p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-[700px] text-lg md:text-xl text-muted-foreground scroll-effect"
          >
            Advance your career with personalized guidance, interview prep, and
            <span className="font-semibold text-primary"> AI-powered tools </span>
            designed to accelerate your job search success.
          </ p>
                <Sparkles className="absolute -top-4 -right-6 md:-right-8 w-6 h-6 md:w-8 md:h-8 text-yellow-400 animate-pulse" />

          {/* CTA buttons with hover effects */}
          < div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Link href="/dashboard">
              <Button 
                size="lg" 
                className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary/20"
              >
                Get Started Free
              </Button>
            </Link>
            <Link href="#explore" scroll={true}>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-6 text-lg font-semibold border-2 hover:bg-accent/50 transition-all duration-300 transform hover:scale-105"
              >
                Explore Features
              </Button>
            </Link>
          </ div>

          {/* Floating animated elements */}
          <div className="absolute top-1/4 left-10 w-16 h-16 rounded-full bg-blue-400/10 blur-3xl -z-10"></div>
          <div className="absolute bottom-1/4 right-10 w-24 h-24 rounded-full bg-purple-400/10 blur-3xl -z-10"></div>
        </div>
      </div>

      {/* Scroll indicator */}
      < div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
      >
        <span className="text-sm text-muted-foreground mb-2">Scroll down</span>
        <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center">
          < div 
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1 h-2 bg-muted-foreground rounded-full mt-1"
          />
        </div>
      </ div>
    </section>
  );
};

export default Landing;