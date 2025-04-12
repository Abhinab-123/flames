import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share, Heart, Repeat } from 'lucide-react';
import { FlamesResponse } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import ThreeDScene from './ThreeDScene';
import { FLAMES_DETAILS } from '@/lib/flames';

type ResultsScreenProps = {
  result: FlamesResponse;
  onTryAgain: () => void;
};

// Helper to determine color class based on FLAMES result
const getColorClass = (result: string) => {
  switch (result) {
    case 'F': return 'text-[#64B5F6]';
    case 'L': return 'text-[#FF4081]';
    case 'A': return 'text-[#AB47BC]';
    case 'M': return 'text-[#EC407A]';
    case 'E': return 'text-[#FF9800]';
    case 'S': return 'text-[#66BB6A]';
    default: return 'text-primary';
  }
};

// Helper to determine border color based on FLAMES result
const getBorderColorClass = (result: string) => {
  switch (result) {
    case 'F': return 'border-[#64B5F6]';
    case 'L': return 'border-[#FF4081]';
    case 'A': return 'border-[#AB47BC]';
    case 'M': return 'border-[#EC407A]';
    case 'E': return 'border-[#FF9800]';
    case 'S': return 'border-[#66BB6A]';
    default: return 'border-primary';
  }
};

// Helper to get background gradient class
const getBackgroundClass = (result: string) => {
  switch (result) {
    case 'F': return 'bg-friends-gradient';
    case 'L': return 'bg-love-gradient';
    case 'A': return 'bg-affection-gradient';
    case 'M': return 'bg-marriage-gradient';
    case 'E': return 'bg-crush-gradient';
    case 'S': return 'bg-besties-gradient';
    default: return 'bg-primary/10';
  }
};

const ResultsScreen = ({ result, onTryAgain }: ResultsScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();
  
  // Get FLAMES details
  const flamesDetails = FLAMES_DETAILS[result.result as keyof typeof FLAMES_DETAILS];
  
  // Animate the circular progress and show confetti on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(result.compatibility);
      setShowConfetti(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [result.compatibility]);
  
  // Calculate the stroke-dashoffset for the SVG circle
  const circumference = 2 * Math.PI * 58;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'FLAMES Relationship Result',
        text: `${result.name1} & ${result.name2} are ${result.relationship} with ${result.compatibility}% compatibility!`,
        url: window.location.href
      }).catch(() => {
        toast({
          title: 'Share',
          description: 'Copied result to clipboard!',
        });
      });
    } else {
      // Fallback if Web Share API is not available
      navigator.clipboard.writeText(
        `${result.name1} & ${result.name2} are ${result.relationship} with ${result.compatibility}% compatibility!`
      ).then(() => {
        toast({
          title: 'Share',
          description: 'Copied result to clipboard!',
        });
      });
    }
  };

  return (
    <Card className={`rounded-xl shadow-lg p-6 mb-8 transition-all duration-300 ease-in-out overflow-hidden bg-white`}>
      <CardContent className="p-0">
        <div className="text-center">
          <div className={`-mx-6 -mt-6 p-6 mb-6 ${getBackgroundClass(result.result)}`}>
            <h2 className="font-heading font-bold text-2xl mb-2 text-white drop-shadow">Your Result</h2>
            <p className="text-white/90 mb-4 text-lg font-medium">{result.name1} & {result.name2}</p>
          
            {/* 3D Scene */}
            <div className="mb-4">
              <ThreeDScene 
                objectType={flamesDetails.object3d} 
                intensity={result.compatibility}
              />
            </div>
            
            {/* Result Icon */}
            <div className={`relative inline-block mb-4 transform translate-y-8`}>
              <div className={`w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center border-4 ${getBorderColorClass(result.result)} relative z-10`}>
                <span className={`${getColorClass(result.result)} text-3xl ${flamesDetails.animation && `animate-${flamesDetails.animation}`}`}>
                  <i className={`fas ${flamesDetails.icon}`}></i>
                </span>
              </div>
            </div>
          </div>
          
          {/* Result Title and Description */}
          <div className="mt-10 mb-6">
            <h3 className={`font-heading font-bold text-2xl mb-2 ${getColorClass(result.result)}`}>
              {result.relationship}
            </h3>
            <p className="text-gray-600">{result.description}</p>
          </div>
          
          {/* Compatibility Percentage */}
          <div className="flex justify-center mb-8">
            <div className="relative w-32 h-32">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  stroke="#e6e6e6"
                  strokeWidth="8"
                  fill="transparent"
                  r="58"
                  cx="64"
                  cy="64"
                />
                <circle
                  className="transition-all duration-1000 ease-in-out"
                  stroke={`var(--tw-colors-${flamesDetails.color})`}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  fill="transparent"
                  r="58"
                  cx="64"
                  cy="64"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-gray-800">{result.compatibility}%</span>
                <span className="text-xs text-gray-500">Compatibility</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={onTryAgain}
              className={`w-full font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-200 ease-in-out group`}
              style={{
                background: `var(--tw-colors-${flamesDetails.color})`,
                color: 'white'
              }}
            >
              <Repeat className="mr-2 h-4 w-4 group-hover:animate-spin" />
              Try Again
            </Button>
            
            <Button 
              onClick={handleShare}
              variant="outline"
              className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 px-4 rounded-lg shadow-sm hover:shadow transition duration-200 ease-in-out flex items-center justify-center"
            >
              <Share className="mr-2 h-4 w-4" />
              Share Result
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsScreen;
