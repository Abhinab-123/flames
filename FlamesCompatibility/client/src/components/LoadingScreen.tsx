import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, Sparkles, Flame, Loader2 } from 'lucide-react';

type LoadingScreenProps = {
  progress: number;
};

const loadingMessages = [
  "Analyzing name compatibility...",
  "Calculating cosmic connections...",
  "Consulting the stars...",
  "Measuring emotional resonance...",
  "Aligning your love frequencies...",
  "Finding your perfect match...",
  "Reading your relationship fortune..."
];

const LoadingScreen = ({ progress }: LoadingScreenProps) => {
  const [message, setMessage] = useState(loadingMessages[0]);
  const [particleCount, setParticleCount] = useState<number[]>([]);
  
  // Change loading message periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(prev => {
        const currentIndex = loadingMessages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % loadingMessages.length;
        return loadingMessages[nextIndex];
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Generate random particles for animation effect
  useEffect(() => {
    setParticleCount(Array.from({ length: 15 }, (_, i) => i));
  }, []);
  
  return (
    <Card className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-8 mb-8 transition-all duration-300 ease-in-out text-center relative overflow-hidden">
      <CardContent className="p-0 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="text-primary animate-pulse absolute -left-10 top-0">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="text-primary animate-heartbeat">
              <Heart className="h-16 w-16 drop-shadow-md" fill="#FF4D8F" />
            </div>
            <div className="text-primary animate-pulse absolute -right-10 top-0">
              <Sparkles className="h-6 w-6" />
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="text-primary font-medium text-lg">{message}</p>
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
              <p className="text-gray-500 text-sm">{progress}% complete</p>
            </div>
          </div>
          
          <Progress 
            value={progress} 
            className="w-full max-w-xs h-3 bg-gray-100 rounded-full overflow-hidden"
          />
        </div>
      </CardContent>
      
      {/* Animated particles */}
      <div className="absolute inset-0 z-0 opacity-30 overflow-hidden">
        {particleCount.map((i) => {
          const size = Math.floor(Math.random() * 20) + 5;
          const left = Math.floor(Math.random() * 100);
          const delay = Math.floor(Math.random() * 5);
          const duration = Math.floor(Math.random() * 5) + 5;
          
          return (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${left}%`,
                top: '100%',
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: '#FF4D8F',
                borderRadius: '50%',
                opacity: Math.random() * 0.5 + 0.2,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                transform: 'translateY(0)',
              }}
            />
          );
        })}
      </div>
    </Card>
  );
};

export default LoadingScreen;
