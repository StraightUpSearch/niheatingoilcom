import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Award, Target, Zap, Flame } from "lucide-react";
import { useState, useEffect } from "react";

export default function SavingsTracker() {
  const [animatedSavings, setAnimatedSavings] = useState(0);
  const totalSavings = 487.50; // This would come from user's actual savings data
  const savingsGoal = 500;
  const currentStreak = 7; // Days of checking prices
  const bestDeal = 28.40; // Best single deal savings

  // Animate the savings counter
  useEffect(() => {
    const timer = setTimeout(() => {
      if (animatedSavings < totalSavings) {
        setAnimatedSavings(prev => Math.min(prev + 15, totalSavings));
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [animatedSavings, totalSavings]);

  const achievements = [
    {
      title: "First Savings",
      description: "Saved your first £10",
      icon: Target,
      unlocked: true,
      color: "bg-green-500"
    },
    {
      title: "Smart Shopper",
      description: "Saved £100 total",
      icon: Award,
      unlocked: true,
      color: "bg-blue-500"
    },
    {
      title: "Savings Streak",
      description: "7 days of price checking",
      icon: Flame,
      unlocked: true,
      color: "bg-orange-500"
    },
    {
      title: "Deal Hunter",
      description: "Found 10 great deals",
      icon: Zap,
      unlocked: false,
      color: "bg-purple-500"
    }
  ];

  const progressPercentage = (animatedSavings / savingsGoal) * 100;

  return (
    <div className="space-y-6">
      {/* Main Savings Display */}
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-gray-900">Your Total Savings</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-5xl font-bold text-green-600 mb-2">
            £{animatedSavings.toFixed(2)}
          </div>
          <p className="text-gray-600 mb-4">You're saving money every time you compare!</p>
          
          {/* Progress to Goal */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress to £{savingsGoal} goal</span>
              <span>{progressPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{currentStreak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">£{bestDeal}</div>
              <div className="text-sm text-gray-600">Best Deal</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2 text-yellow-500" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  achievement.unlocked 
                    ? 'bg-white border-gray-200' 
                    : 'bg-gray-50 border-gray-100 opacity-60'
                }`}
              >
                <div className="flex items-center mb-2">
                  <div className={`w-8 h-8 rounded-full ${achievement.color} flex items-center justify-center mr-2`}>
                    <achievement.icon className="h-4 w-4 text-white" />
                  </div>
                  <Badge variant={achievement.unlocked ? "default" : "secondary"} className="text-xs">
                    {achievement.unlocked ? "Unlocked" : "Locked"}
                  </Badge>
                </div>
                <h4 className="font-semibold text-sm">{achievement.title}</h4>
                <p className="text-xs text-gray-600">{achievement.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Keep Your Streak Going!</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-white rounded border">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">Check today's prices</span>
              </div>
              <Badge variant="outline" className="text-xs">+5 XP</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-white rounded border">
              <div className="flex items-center">
                <Target className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-sm">Set a price alert</span>
              </div>
              <Badge variant="outline" className="text-xs">+10 XP</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}