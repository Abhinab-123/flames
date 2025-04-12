import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { flamesRequestSchema, flamesResponseSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// FLAMES constants for results
const FLAMES_RELATIONSHIPS = {
  F: 'Friends',
  L: 'Love',
  A: 'Affection',
  M: 'Marriage',
  E: 'Crush',
  S: 'Besties'
};

const FLAMES_DESCRIPTIONS = {
  F: 'You two have a solid foundation for a great friendship. Enjoy the casual bond you share!',
  L: 'There\'s a strong romantic connection between you two. The stars align in your favor!',
  A: 'There\'s a warm affectionate bond between you. You care deeply for each other.',
  M: 'Your compatibility suggests a long-term commitment. You could be great life partners!',
  E: 'You might have a secret crush on each other! There\'s definitely some chemistry here.',
  S: 'You\'re the ultimate besties! Your connection is unmatched and your friendship is goals!'
};

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for calculating FLAMES
  app.post('/api/flames', async (req, res) => {
    try {
      // Validate request body
      const data = flamesRequestSchema.parse(req.body);
      
      // Calculate FLAMES result
      const flamesChar = calculateFlames(data.name1, data.name2);
      
      // Calculate compatibility score
      const compatibilityScore = calculateCompatibility(data.name1, data.name2);
      
      // Create response
      const response = {
        name1: data.name1,
        name2: data.name2,
        result: flamesChar,
        relationship: FLAMES_RELATIONSHIPS[flamesChar as keyof typeof FLAMES_RELATIONSHIPS],
        compatibility: compatibilityScore,
        description: FLAMES_DESCRIPTIONS[flamesChar as keyof typeof FLAMES_DESCRIPTIONS]
      };
      
      // Store calculation in memory
      await storage.saveFlamesCalculation({
        name1: data.name1,
        name2: data.name2,
        result: flamesChar,
        compatibility: compatibilityScore,
        timestamp: new Date().toISOString()
      });
      
      // Return response
      return res.json(response);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      
      return res.status(500).json({ error: 'Failed to calculate FLAMES result' });
    }
  });

  // Get recent calculations
  app.get('/api/flames/recent', async (_req, res) => {
    try {
      const recentCalculations = await storage.getRecentCalculations(10);
      return res.json(recentCalculations);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch recent calculations' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

// FLAMES calculation algorithm
function calculateFlames(name1: string, name2: string): string {
  // Remove spaces and convert to lowercase
  name1 = name1.replace(/\s+/g, '').toLowerCase();
  name2 = name2.replace(/\s+/g, '').toLowerCase();
  
  // Create arrays of characters
  let name1Array = name1.split('');
  let name2Array = name2.split('');
  
  // Remove common characters
  for (let i = 0; i < name1.length; i++) {
    const char = name1[i];
    const index = name2Array.indexOf(char);
    
    if (index !== -1) {
      name1Array[i] = '';
      name2Array[index] = '';
    }
  }
  
  // Count remaining characters
  const remainingChars = name1Array.filter(char => char !== '').length + 
                         name2Array.filter(char => char !== '').length;
  
  // FLAMES algorithm
  const flames = ['F', 'L', 'A', 'M', 'E', 'S'];
  let index = 0;
  
  while (flames.length > 1) {
    index = (index + remainingChars - 1) % flames.length;
    flames.splice(index, 1);
  }
  
  return flames[0];
}

// Calculate compatibility percentage
function calculateCompatibility(name1: string, name2: string): number {
  // Create a consistent but pseudo-random score based on the names
  const combinedNames = name1.toLowerCase() + name2.toLowerCase();
  let hash = 0;
  
  for (let i = 0; i < combinedNames.length; i++) {
    hash = combinedNames.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Map to a percentage between 50-100 (for more optimistic results)
  const percentage = 50 + Math.abs(hash % 51);
  
  return percentage;
}
