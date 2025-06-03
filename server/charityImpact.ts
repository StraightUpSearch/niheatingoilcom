// Simon Community NI Charity Impact Tracking
export interface CharityImpact {
  quarter: string;
  grants: number;
  amount: number;
  period: string;
}

// Impact data - update quarterly with real figures
const impactData: CharityImpact[] = [
  {
    quarter: "Q1_2025",
    grants: 0, // Will be updated with real data as orders come in
    amount: 0,
    period: "January - March 2025"
  },
  {
    quarter: "Q4_2024", 
    grants: 8,
    amount: 420,
    period: "October - December 2024"
  },
  {
    quarter: "Q3_2024",
    grants: 12,
    amount: 600,
    period: "July - September 2024"
  }
];

export function getCurrentImpact(): { totalGrants: number; totalAmount: number; currentYear: number } {
  const currentYear = new Date().getFullYear();
  const currentYearData = impactData.filter(item => item.quarter.includes(currentYear.toString()));
  
  const totalGrants = currentYearData.reduce((sum, item) => sum + item.grants, 0);
  const totalAmount = currentYearData.reduce((sum, item) => sum + item.amount, 0);
  
  return {
    totalGrants,
    totalAmount,
    currentYear
  };
}

export function isWinterSeason(): boolean {
  const currentMonth = new Date().getMonth() + 1; // 1-12
  return currentMonth >= 10 || currentMonth <= 2; // October to February
}

export function getAllImpactData(): CharityImpact[] {
  return impactData;
}

// Calculate user's contribution based on their order history
export function calculateUserImpact(userOrderTotal: number): number {
  // 5% of user's total orders contributes to grants
  const contribution = userOrderTotal * 0.05;
  // Each grant averages £50, so divide contribution by grant amount
  const grantsContributed = Math.floor(contribution / 50);
  return Math.max(grantsContributed, 0);
}