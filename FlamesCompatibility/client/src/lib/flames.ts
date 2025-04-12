// FLAMES algorithm implementation

// Calculate FLAMES result
export const calculateFlames = (name1: string, name2: string): string => {
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
};

// Calculate compatibility percentage
export const calculateCompatibility = (name1: string, name2: string): number => {
  // Create a consistent but pseudo-random score based on the names
  const combinedNames = name1.toLowerCase() + name2.toLowerCase();
  let hash = 0;
  
  for (let i = 0; i < combinedNames.length; i++) {
    hash = combinedNames.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Map to a percentage between 50-100 (for more optimistic results)
  const percentage = 50 + Math.abs(hash % 51);
  
  return percentage;
};

// FLAMES relationship types and descriptions
export const FLAMES_DETAILS = {
  F: {
    relationship: 'Friends',
    description: 'You two have a solid foundation for a great friendship. Enjoy the casual bond you share!',
    icon: 'fa-user-friends',
    color: 'friends',
    animation: 'float',
    object3d: 'handshake'
  },
  L: {
    relationship: 'Love',
    description: 'There\'s a strong romantic connection between you two. The stars align in your favor!',
    icon: 'fa-heart',
    color: 'love',
    animation: 'heartbeat',
    object3d: 'hearts'
  },
  A: {
    relationship: 'Affection',
    description: 'There\'s a warm affectionate bond between you. You care deeply for each other.',
    icon: 'fa-hand-holding-heart',
    color: 'affection',
    animation: 'float',
    object3d: 'flower'
  },
  M: {
    relationship: 'Marriage',
    description: 'Your compatibility suggests a long-term commitment. You could be great life partners!',
    icon: 'fa-ring',
    color: 'marriage',
    animation: 'heartbeat',
    object3d: 'rings'
  },
  E: {
    relationship: 'Crush',
    description: 'You might have a secret crush on each other! There\'s definitely some chemistry here.',
    icon: 'fa-bolt',
    color: 'crush',
    animation: 'pulse',
    object3d: 'stars'
  },
  S: {
    relationship: 'Besties',
    description: 'You\'re the ultimate besties! Your connection is unmatched and your friendship is goals!',
    icon: 'fa-people-hold-hands',
    color: 'besties',
    animation: 'bounce',
    object3d: 'highfive'
  }
};
