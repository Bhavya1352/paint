import { useState } from 'react';
import { Send, Star, Sparkles, Award, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface DrawingEvaluatorProps {
  isOpen: boolean;
  onClose: () => void;
  drawingDataURL: string;
}

interface EvaluationResult {
  score: number;
  category: string;
  feedback: string;
  tips: string[];
  character: string;
}

const evaluationResponses: EvaluationResult[] = [
  {
    score: 95,
    category: "Masterpiece! 🎨",
    feedback: "Wow! Your creativity is absolutely amazing! The colors and shapes work perfectly together!",
    tips: ["Try adding more details", "Experiment with gradients", "Add some background elements"],
    character: "🎨👨‍🎨"
  },
  {
    score: 85,
    category: "Excellent Work! ⭐",
    feedback: "Great job! Your drawing shows real artistic talent. The composition is very nice!",
    tips: ["Add more contrast", "Try different brush sizes", "Consider symmetry"],
    character: "🌟😊"
  },
  {
    score: 75,
    category: "Good Effort! 👍",
    feedback: "Nice work! You're getting better at this. Keep practicing and you'll improve even more!",
    tips: ["Practice basic shapes", "Use more colors", "Try drawing from life"],
    character: "👍😄"
  },
  {
    score: 65,
    category: "Keep Going! 💪",
    feedback: "You're on the right track! Every artist starts somewhere. Keep drawing and having fun!",
    tips: ["Start with simple shapes", "Practice daily", "Watch drawing tutorials"],
    character: "💪🎯"
  },
  {
    score: 50,
    category: "Practice Makes Perfect! 🌱",
    feedback: "Great start! Remember, even Picasso had to start somewhere. Keep experimenting!",
    tips: ["Focus on one shape at a time", "Use the grid for guidance", "Don't be afraid to make mistakes"],
    character: "🌱📚"
  }
];

export const DrawingEvaluator = ({ isOpen, onClose, drawingDataURL }: DrawingEvaluatorProps) => {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const evaluateDrawing = () => {
    setIsEvaluating(true);
    
    setTimeout(() => {
      const randomResult = evaluationResponses[Math.floor(Math.random() * evaluationResponses.length)];
      setResult(randomResult);
      setIsEvaluating(false);
      setShowResult(true);
    }, 3000);
  };

  const resetEvaluation = () => {
    setResult(null);
    setShowResult(false);
    setIsEvaluating(false);
  };

  const getStars = (score: number) => {
    const stars = Math.ceil(score / 20);
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-6 h-6 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            AI Drawing Evaluator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            {drawingDataURL ? (
              <img 
                src={drawingDataURL} 
                alt="Your Drawing" 
                className="max-w-full h-32 mx-auto rounded"
              />
            ) : (
              <div className="text-gray-500">No drawing to evaluate</div>
            )}
          </div>

          {!showResult && !isEvaluating && (
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Submit your drawing and get instant feedback from our AI art critic! 🎨
              </p>
              <Button 
                onClick={evaluateDrawing}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                disabled={!drawingDataURL}
              >
                <Send className="w-4 h-4 mr-2" />
                Submit for Evaluation
              </Button>
            </div>
          )}

          {isEvaluating && (
            <div className="text-center space-y-4">
              <div className="animate-spin text-6xl">🎨</div>
              <div className="space-y-2">
                <p className="font-medium">AI is analyzing your masterpiece...</p>
                <div className="flex justify-center space-x-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}

          {showResult && result && (
            <div className="space-y-4 text-center">
              <div className="text-6xl animate-bounce">
                {result.character}
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-purple-600">{result.category}</h3>
                <div className="flex justify-center space-x-1">
                  {getStars(result.score)}
                </div>
                <div className="text-3xl font-bold text-gray-800">{result.score}/100</div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                <p className="text-gray-700 font-medium">{result.feedback}</p>
              </div>

              <div className="text-left">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-500" />
                  Tips to Improve:
                </h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {result.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Zap className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2">
                <Button onClick={resetEvaluation} variant="outline" className="flex-1">
                  Try Again
                </Button>
                <Button onClick={onClose} className="flex-1">
                  Continue Drawing
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};