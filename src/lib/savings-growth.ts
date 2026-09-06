export interface SavingsGrowthInput {
  startingBalance: number;
  monthlyDeposit: number;
  annualInterestRate: number;
  years: number;
}

export interface SavingsGrowthYear {
  year: number;
  startBalance: number;
  deposits: number;
  interest: number;
  endBalance: number;
}

export interface SavingsGrowthResult {
  finalBalance: number;
  startingBalance: number;
  totalDeposits: number;
  totalInterest: number;
  yearlyBreakdown: SavingsGrowthYear[];
}

export const computeSavingsGrowth = (
  input: SavingsGrowthInput,
): SavingsGrowthResult => {
  const startingBalance = Math.max(0, input.startingBalance);
  const monthlyDeposit = Math.max(0, input.monthlyDeposit);
  const annualRate = Math.max(0, input.annualInterestRate) / 100;
  const totalMonths = Math.max(0, Math.round(input.years * 12));

  const monthlyRate = annualRate > 0 ? (1 + annualRate) ** (1 / 12) - 1 : 0;

  let balance = startingBalance;
  const yearlyBreakdown: SavingsGrowthYear[] = [];
  let yearStartBalance = balance;
  let yearDeposits = 0;
  let yearInterest = 0;

  for (let month = 1; month <= totalMonths; month++) {
    balance += monthlyDeposit;
    yearDeposits += monthlyDeposit;

    const interestThisMonth = balance * monthlyRate;
    balance += interestThisMonth;
    yearInterest += interestThisMonth;

    const isYearEnd = month % 12 === 0;
    const isFinalMonth = month === totalMonths;

    if (isYearEnd || isFinalMonth) {
      yearlyBreakdown.push({
        year: month / 12,
        startBalance: yearStartBalance,
        deposits: yearDeposits,
        interest: yearInterest,
        endBalance: balance,
      });

      yearStartBalance = balance;
      yearDeposits = 0;
      yearInterest = 0;
    }
  }

  const totalDeposits = monthlyDeposit * totalMonths;
  const totalInterest = balance - startingBalance - totalDeposits;

  return {
    finalBalance: balance,
    startingBalance,
    totalDeposits,
    totalInterest,
    yearlyBreakdown,
  };
};
