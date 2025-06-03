import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface BotProtectionProps {
  onValidation: (isValid: boolean) => void;
  className?: string;
}

export default function BotProtection({ onValidation, className }: BotProtectionProps) {
  const [honeypotValue, setHoneypotValue] = useState("");
  const [timeStart] = useState(Date.now());
  const [mathAnswer, setMathAnswer] = useState("");
  const [mathQuestion, setMathQuestion] = useState({ a: 0, b: 0, answer: 0 });

  useEffect(() => {
    // Generate simple math question
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setMathQuestion({ a, b, answer: a + b });
  }, []);

  useEffect(() => {
    const isValidTime = Date.now() - timeStart > 3000; // Must take at least 3 seconds
    const isHoneypotEmpty = honeypotValue === "";
    const isMathCorrect = parseInt(mathAnswer) === mathQuestion.answer;
    
    onValidation(isValidTime && isHoneypotEmpty && isMathCorrect);
  }, [honeypotValue, mathAnswer, mathQuestion.answer, timeStart, onValidation]);

  return (
    <div className={className}>
      {/* Honeypot field - hidden from users but visible to bots */}
      <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
        <Input
          type="text"
          name="website"
          value={honeypotValue}
          onChange={(e) => setHoneypotValue(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Simple math CAPTCHA */}
      <div className="space-y-2">
        <label htmlFor="math-captcha" className="text-sm font-medium">
          Security Check: What is {mathQuestion.a} + {mathQuestion.b}?
        </label>
        <Input
          id="math-captcha"
          type="number"
          value={mathAnswer}
          onChange={(e) => setMathAnswer(e.target.value)}
          placeholder="Enter the answer"
          required
        />
      </div>
    </div>
  );
}