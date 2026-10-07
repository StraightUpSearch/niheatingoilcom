import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Search, Bell, TrendingDown, Award } from "lucide-react";

export default function UserProgress() {
  // Simple milestone system - users start at level 1
  const userLevel = 2; // Current user level
  const currentXP = 65; // Current experience points
  const nextLevelXP = 100; // XP needed for next level
  const progressPercentage = (currentXP / nextLevelXP) * 100;

  const milestones = [
    {
      id: 1,
      title: "First Search",
      description: "Compare your first heating oil prices",
      icon: Search,
      xp: 10,
      completed: true
    },
    {
      id: 2,
      title: "Smart Saver",
      description: "Complete 5 price comparisons",
      icon: TrendingDown,
      xp: 25,
      completed: true
    },
    {
      id: 3,
      title: "Alert Master",
      description: "Set up your first price alert",
      icon: Bell,
      xp: 15,
      completed: false
    },
    {
      id: 4,
      title: "Deal Hunter",
      description: "Find 3 great deals",
      icon: Award,
      xp: 30,
      completed: false
    }
  ];

  const completedMilestones = milestones.filter(m => m.completed).length;
  const nextMilestone = milestones.find(m => !m.completed);

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-purple-800">Your Progress</span>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            Level {userLevel}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* XP Progress Bar */}
        <div>
          <div className="flex justify-between text-sm text-brand-muted mb-2">
            <span>{currentXP} XP</span>
            <span>{nextLevelXP} XP to Level {userLevel + 1}</span>
          </div>
          <Progress value={progressPercentage} className="h-3 bg-brand-line">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </Progress>
        </div>

        {/* Milestone Progress */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-brand-ink">Milestones</h4>
            <span className="text-sm text-brand-muted">
              {completedMilestones}/{milestones.length} completed
            </span>
          </div>
          
          <div className="space-y-3">
            {milestones.map((milestone) => {
              const Icon = milestone.icon;
              return (
                <div 
                  key={milestone.id}
                  className={`flex items-center p-3 rounded-lg border ${
                    milestone.completed 
                      ? 'bg-brand-mint border-brand-line' 
                      : 'bg-white border-brand-line'
                  }`}
                >
                  <div className={`mr-3 ${milestone.completed ? 'text-[#0B6A30]' : 'text-brand-muted'}`}>
                    {milestone.completed ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center">
                      <Icon className={`h-4 w-4 mr-2 ${milestone.completed ? 'text-[#0B6A30]' : 'text-brand-muted'}`} />
                      <span className={`font-medium ${milestone.completed ? 'text-[#0B6A30]' : 'text-brand-ink'}`}>
                        {milestone.title}
                      </span>
                    </div>
                    <p className={`text-sm ${milestone.completed ? 'text-[#0B6A30]' : 'text-brand-muted'}`}>
                      {milestone.description}
                    </p>
                  </div>
                  
                  <Badge 
                    variant={milestone.completed ? "default" : "outline"}
                    className={`ml-2 ${milestone.completed ? 'bg-brand-mint text-[#0B6A30]' : ''}`}
                  >
                    +{milestone.xp} XP
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Goal */}
        {nextMilestone && (
          <div className="bg-brand-mint border border-brand-line rounded-lg p-3">
            <h5 className="font-medium text-brand-forest mb-1">Next Goal</h5>
            <p className="text-sm text-brand-forest">{nextMilestone.description}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-brand-forest">Reward: +{nextMilestone.xp} XP</span>
              <Badge variant="outline" className="text-xs border-brand-line text-brand-forest">
                In Progress
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}