import { useState } from 'react';
import { Send, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DrawingSubmitterProps {
  fabricCanvas: any;
}

export const DrawingSubmitter = ({ fabricCanvas }: DrawingSubmitterProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    if (!fabricCanvas) {
      toast.error('No drawing to submit!');
      return;
    }

    setIsSubmitting(true);
    toast.info('Submitting your drawing...');

    // Simulate submission process
    setTimeout(() => {
      // Generate specific ratings: 1, 5, or 10
      const possibleRatings = [1, 2, 3, 5, 6, 7, 8, 9, 10];
      const randomRating = possibleRatings[Math.floor(Math.random() * possibleRatings.length)];
      setRating(randomRating);
      setIsSubmitting(false);
      setShowRating(true);
      
      // Show rating message
      if (randomRating <= 3) {
        toast.error(`Rating: ${randomRating}/10 - Keep practicing!`);
      } else if (randomRating <= 7) {
        toast.info(`Rating: ${randomRating}/10 - Good effort!`);
      } else {
        toast.success(`Rating: ${randomRating}/10 - Amazing work!`);
      }
    }, 2000);
  };

  const getRatingGif = (rating: number) => {
    if (rating >= 1 && rating <= 4) return '/1-one.gif';           // 1-4: Show 1/10 gif
    if (rating >= 5 && rating <= 8) return '/celebrating-anniversary.gif';  // 5-8: Show 5/10 gif  
    if (rating >= 9 && rating <= 10) return '/dança-musica.gif';    // 9-10: Show 10/10 gif
    return '/1-one.gif'; // Default
  };

  const getRatingMessage = (rating: number) => {
    if (rating <= 3) return { text: 'Keep Practicing! 😅', color: 'text-red-600' };
    if (rating <= 7) return { text: 'Good Work! 👍', color: 'text-yellow-600' };
    return { text: 'Amazing Art! 🎨', color: 'text-green-600' };
  };

  const resetSubmission = () => {
    setShowRating(false);
    setRating(0);
  };

  if (showRating) {
    const message = getRatingMessage(rating);
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl border p-6 w-96 max-w-md mx-4">
        <div className="text-center space-y-3">
          <h3 className="font-bold text-lg">Your Rating!</h3>
          
          {/* Rating GIF */}
          <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden border">
            <img 
              src={getRatingGif(rating)} 
              alt="Rating" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Score */}
          <div className="space-y-2">
            <div className="flex justify-center">
              {Array.from({ length: 10 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <div className="text-2xl font-bold">{rating}/10</div>
            <div className={`font-medium ${message.color}`}>{message.text}</div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={resetSubmission} variant="outline" className="flex-1">
              Submit Another
            </Button>
            <Button onClick={resetSubmission} className="flex-1">
              Continue Drawing
            </Button>
          </div>
        </div>
      </div>
    </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
            Submitting...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Submit Drawing
          </>
        )}
      </Button>
    </div>
  );
};