import { useState } from 'react';
import FlamesForm from '@/components/FlamesForm';
import LoadingScreen from '@/components/LoadingScreen';
import ResultsScreen from '@/components/ResultsScreen';
import FloatingBackground from '@/components/FloatingBackground';
import { FlamesResponse } from '@shared/schema';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Heart, Stars } from 'lucide-react';

type ScreenState = 'input' | 'loading' | 'result';

const Home = () => {
  const [screen, setScreen] = useState<ScreenState>('input');
  const [result, setResult] = useState<FlamesResponse | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { toast } = useToast();

  const flamesMutation = useMutation({
    mutationFn: async (data: { name1: string; name2: string }) => {
      const res = await apiRequest('POST', '/api/flames', data);
      return res.json() as Promise<FlamesResponse>;
    },
    onSuccess: (data) => {
      setResult(data);
      setScreen('result');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to calculate compatibility',
        variant: 'destructive'
      });
      setScreen('input');
    }
  });

  const handleSubmit = (name1: string, name2: string) => {
    setScreen('loading');
    
    // Simulate progress
    setLoadingProgress(0);
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 100);
    
    // Submit after a short delay to allow for the loading animation
    setTimeout(() => {
      flamesMutation.mutate({ name1, name2 });
      clearInterval(interval);
      setLoadingProgress(100);
    }, 2000);
  };

  const handleTryAgain = () => {
    setScreen('input');
  };

  return (
    <div className="font-body min-h-screen">
      {/* Animated background shapes */}
      <FloatingBackground />
      
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header Section */}
        <header className="text-center mb-8">
          <div className="flex justify-center items-center mb-2">
            <div className="text-primary text-4xl">
              <Heart className="h-10 w-10 animate-heartbeat" />
            </div>
            <div className="relative ml-3">
              <h1 className="font-heading font-bold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">FLAMES</h1>
              <Stars className="h-5 w-5 absolute -top-3 -right-4 text-yellow-400 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-2">
            Find your relationship compatibility with the classic game
          </p>
          <div className="mt-3 text-sm bg-primary/10 inline-block rounded-full px-4 py-1">
            <span className="text-primary font-semibold">F</span>riends • 
            <span className="text-primary font-semibold"> L</span>ove • 
            <span className="text-primary font-semibold"> A</span>ffection • 
            <span className="text-primary font-semibold"> M</span>arriage • 
            <span className="text-primary font-semibold"> E</span>... Crush! • 
            <span className="text-primary font-semibold"> S</span>uper Besties
          </div>
        </header>

        {/* Show appropriate screen based on state */}
        {screen === 'input' && <FlamesForm onSubmit={handleSubmit} />}
        {screen === 'loading' && <LoadingScreen progress={loadingProgress} />}
        {screen === 'result' && result && <ResultsScreen result={result} onTryAgain={handleTryAgain} />}

        {/* Footer */}
        <footer className="text-center text-gray-500 text-xs mt-8">
          <p>© {new Date().getFullYear()} FLAMES App - Find Your Perfect Match</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
