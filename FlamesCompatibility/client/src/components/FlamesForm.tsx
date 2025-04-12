import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, User, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Form schema
const formSchema = z.object({
  name1: z.string()
    .min(1, { message: 'Name is required' })
    .max(30, { message: 'Name is too long' })
    .regex(/^[A-Za-z\s\-']+$/, { 
      message: 'Please use only letters, spaces, hyphens, and apostrophes' 
    }),
  name2: z.string()
    .min(1, { message: 'Name is required' })
    .max(30, { message: 'Name is too long' })
    .regex(/^[A-Za-z\s\-']+$/, { 
      message: 'Please use only letters, spaces, hyphens, and apostrophes' 
    })
});

type FormValues = z.infer<typeof formSchema>;

type FlamesFormProps = {
  onSubmit: (name1: string, name2: string) => void;
};

const FlamesForm = ({ onSubmit }: FlamesFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name1: '',
      name2: ''
    }
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values.name1, values.name2);
  };

  return (
    <Card className="bg-white/90 backdrop-blur rounded-xl shadow-xl mb-8 transition-all duration-300 ease-in-out border border-primary/10 overflow-hidden">
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>
      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-secondary/10 rounded-full blur-2xl"></div>
      
      <div className="absolute right-3 top-3">
        <Sparkles className="w-5 h-5 text-primary/40 animate-pulse" />
      </div>
      
      <CardContent className="p-6 relative z-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium flex items-center space-x-1">
                      <span>Your Name</span>
                      <div className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full ml-2">Person 1</div>
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all group-focus-within:text-primary">
                          <User className="h-4 w-4 text-gray-400 group-focus-within:text-primary" />
                        </div>
                        <Input 
                          placeholder="Enter your name"
                          className="pl-10 pr-3 py-6 border-primary/20 focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition rounded-lg"
                          {...field}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity">
                          <Heart className="h-4 w-4 text-primary/70 animate-heartbeat" />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs mt-1" />
                  </FormItem>
                )}
              />
              
              <div className="relative flex justify-center items-center my-2">
                <Separator className="w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                <div className="absolute flex items-center justify-center bg-white px-4 py-1 rounded-full border border-primary/20 shadow-sm">
                  <Heart className="h-5 w-5 text-primary animate-heartbeat mr-2" fill="#FF4D8F" />
                  <span className="text-xs font-medium text-primary">and</span>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="name2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium flex items-center">
                      <span>Their Name</span>
                      <div className="bg-secondary/10 text-secondary text-xs px-2 py-0.5 rounded-full ml-2">Person 2</div>
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-gray-400 group-focus-within:text-secondary" />
                        </div>
                        <Input 
                          placeholder="Enter their name"
                          className="pl-10 pr-3 py-6 border-primary/20 focus:ring-2 focus:ring-secondary/30 focus:border-secondary/40 transition rounded-lg"
                          {...field}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity">
                          <Heart className="h-4 w-4 text-secondary/70 animate-heartbeat" />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs mt-1" />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold py-6 px-4 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-200 ease-in-out flex items-center justify-center"
              >
                <span className="mr-2">Calculate Compatibility</span>
                <ArrowRight className="h-5 w-5 group-hover:animate-pulse" />
              </Button>
              
              <p className="text-center text-xs text-gray-500 mt-4">
                Find out if you're Friends, Lovers, or something more!
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FlamesForm;
