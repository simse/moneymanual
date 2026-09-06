type Strings = {
  siteName: string;
  titleSuffix: string;
  siteTagline: string;
  siteDescription: string;
  home: string;
  topics: string;
  tools: string;
  seeAll: string;
  search: string;
  searchPageHeading: string;
  searchPlaceholder: string;
  findATopic: string;
  heroHeading: string;
  heroSubheading: string;
  homepageDescription: string;
  toolsHeading: string;
  toolsSubheading: string;
  sitemap: string;
  searchTheSite: string;
  footerTagline: string;
  notFinancialAdvice: string;
  copyright: (year: number) => string;
  resultsFound: (count: number, query: string, queryTimeMs?: number) => string;
  resultsNone: (query: string) => string;
  notFoundTitle: string;
  notFoundHeading: string;
  notFoundBody: string;
  notFoundHomeLink: string;

  glossaryHeading: string;
  glossarySubheading: string;
  glossaryDescription: string;
  glossaryFooterLink: string;
  glossaryFilterPlaceholder: string;
  glossaryBreadcrumb: string;
  glossaryTermCount: (count: number) => string;
  glossarySeeAlso: string;
  glossaryBrowseByTopic: string;
  glossaryJumpToLetter: string;
  glossaryTopicCount: (count: number) => string;
  glossaryRecentlyAdded: string;
  glossaryRecentlyAddedBadge: string;

  // Tool index + footer entries (long name + short name + description)
  toolsTakeHomeName: string;
  toolsTakeHomeShortName: string;
  toolsTakeHomeDescription: string;
  toolsSavingsName: string;
  toolsSavingsShortName: string;
  toolsSavingsDescription: string;
  toolsStudentLoanName: string;
  toolsStudentLoanShortName: string;
  toolsStudentLoanDescription: string;

  // Tool page titles + descriptions (used in page header + <title>)
  toolsTakeHomePageTitle: string;
  toolsTakeHomePageDescription: string;
  toolsSavingsPageTitle: string;
  toolsSavingsPageDescription: string;
  toolsStudentLoanPageTitle: string;
  toolsStudentLoanPageDescription: string;

  // Shared
  optional: string;
  pluralYears: (n: number) => string;
  pluralPlans: (n: number) => string;

  // Take-home pay calculator
  thTaxYearHeading: string;
  thTaxYearAria: string;
  thCountryHeading: string;
  thCountryAria: string;
  thCountryEngNiWales: string;
  thCountryScotland: string;
  thSalaryHeading: string;
  thSalaryAria: string;
  thSalaryPlaceholder: string;
  thFreqWeekly: string;
  thFreqFortnightly: string;
  thFreqMonthly: string;
  thFreqAnnually: string;
  thPensionTitle: string;
  thPensionAria: string;
  thPensionIntro: string;
  thPensionNetPay: string;
  thPensionNetPayHelp: string;
  thPensionRas: string;
  thPensionRasHelp: string;
  thPensionPercentPlaceholder: string;
  thPensionAmountPlaceholder: string;
  thPensionPercentHelp: string;
  thPensionAmountHelp: string;
  thBonusTitle: string;
  thBonusAria: string;
  thBonusIntro: string;
  thBonusPlaceholder: string;
  thStudentLoanTitle: string;
  thStudentLoanPlan1: string;
  thStudentLoanPlan2: string;
  thStudentLoanPlan4: string;
  thStudentLoanPlan5: string;
  thResultHeading: string;
  thResultMonthly: (formatted: string) => string;
  thResultAnnual: (formatted: string) => string;
  thBonusMonthHeading: string;
  thBonusMonthSummary: (bonusFormatted: string) => string;
  thBonusMonthMonthly: (formatted: string) => string;
  thBonusMonthAnnual: (formatted: string) => string;
  thBonusMonthNetOnTop: (netBonus: string, regularMonthly: string) => string;
  thWorkingsHeading: string;
  thWorkingsSalary: string;
  thWorkingsBonus: string;
  thWorkingsTaxFree: string;
  thWorkingsPension: string;
  thWorkingsPensionCost: (method: string, costFromTakeHome: string) => string;
  thWorkingsNi: string;
  thWorkingsIncomeTax: string;
  thBandBasicRate: string;
  thBandHigherRate: string;
  thBandAdditionalRate: string;
  thBandStarterRate: string;
  thBandBasicRateScot: string;
  thBandIntermediateRate: string;
  thBandHigherRateScot: string;
  thBandAdvancedRate: string;
  thBandTopRate: string;
  thWorkingsStudentLoan: string;
  thRasNote: string;

  // Savings calculator
  svStartingBalanceTitle: string;
  svStartingBalanceHelp: string;
  svStartingBalanceAria: string;
  svStartingBalancePlaceholder: string;
  svMonthlyDepositTitle: string;
  svMonthlyDepositHelp: string;
  svMonthlyDepositAria: string;
  svMonthlyDepositPlaceholder: string;
  svInterestRateTitle: string;
  svInterestRateHelp: string;
  svInterestRateAria: string;
  svInterestRatePlaceholder: string;
  svTimePeriodTitle: string;
  svTimePeriodHelp: string;
  svTimePeriodAria: string;
  svTimePeriodPlaceholder: string;
  svYearsUnit: string;
  svAssumptionNote: string;
  svFinalBalanceHeading: string;
  svAfterYears: (years: number) => string;
  svYourMoney: string;
  svStartingBalanceLine: string;
  svTotalDeposits: string;
  svInterestEarned: string;
  svBreakdownToggle: string;
  svTableYear: string;
  svTableDeposits: string;
  svTableInterest: string;
  svTableBalance: string;
  svYearLabel: (year: number) => string;

  // Student loan repayment calculator
  slPlan1: string;
  slPlan2: string;
  slPlan4: string;
  slPlan5: string;
  slPostgrad: string;
  slBalanceTitle: string;
  slBalanceHelp: string;
  slBalanceAria: string;
  slBalancePlaceholder: string;
  slYearGraduatedTitle: string;
  slYearGraduatedHelp: string;
  slYearGraduatedAria: string;
  slYearGraduatedPlaceholder: (year: number) => string;
  slPlanTitle: string;
  slPlanHelpBefore: string;
  slPlanHelpLink: string;
  slPlanHelpAfter: string;
  slPlanAria: string;
  slSalaryTitle: string;
  slSalaryHelp: string;
  slSalaryAria: string;
  slSalaryPlaceholder: string;
  slSalaryGrowthTitle: string;
  slSalaryGrowthHelp: string;
  slSalaryGrowthAria: string;
  slSalaryGrowthPlaceholder: string;
  slInflationTitle: string;
  slInflationHelp: string;
  slInflationAria: string;
  slInflationPlaceholder: string;
  slOverpaymentTitle: string;
  slOverpaymentHelp: string;
  slOverpaymentAria: string;
  slOverpaymentPlaceholder: string;
  slAssumptionNote: string;
  slWithoutOverpayment: string;
  slWithOverpayment: string;
  slPaidLabel: (formatted: string) => string;
  slPaidOffIn: (years: number) => string;
  slWrittenOffAfter: (years: number) => string;
  slForgivenIn: (formatted: string, year: number) => string;
  slForgivenInYear: (year: number) => string;
  slOverpayingCostsMore: (moreAmount: string, writeOffYear: number) => string;
  slSavingsTimeAndMoney: (years: number, moneySaved: string) => string;
  slSavingsTimeOnly: (years: number) => string;
  slTotalPaidBack: string;
  slYouRepaid: string;
  slInterestAccrued: string;
  slForgivenAtWriteOff: string;
  slBreakdownToggle: string;
  slTableYear: string;
  slTableSalary: string;
  slTableRepayment: string;
  slTableInterest: string;
  slTableBalance: string;
  slStatusStudying: string;
  slStatusPaidOff: string;
  slStatusRepaying: string;
  slEmptyState: string;
};

export const copy: Strings = {
  siteName: "MoneyManual.org.uk",
  titleSuffix: " - MoneyManual.org.uk",
  siteTagline: "Welcome to MoneyManual.org.uk",
  siteDescription:
    "Money Manual is an encyclopedia for everything relating to money, finance and the economy.",
  home: "Home",
  topics: "Topics",
  tools: "Tools",
  seeAll: "See all →",
  search: "Search",
  searchPageHeading: "Search on MoneyManual.org.uk",
  searchPlaceholder: "Search MoneyManual",
  findATopic: "Find a topic",
  heroHeading: "Information about money, finance and the UK economy",
  heroSubheading:
    "Free guides to help you save money, manage debt and understand your finances.",
  homepageDescription:
    "Money Manual is an encyclopedia for everything relating to money, finance and the economy.",
  toolsHeading: "Tools and Calculators",
  toolsSubheading:
    "A collection of useful finance tools and money calculators.",
  sitemap: "Sitemap",
  searchTheSite: "Search the site",
  footerTagline:
    "Free, plain-English guides to money, finance and the UK economy.",
  notFinancialAdvice: "Information only — not financial advice.",
  copyright: (year) => `© ${year} MoneyManual.org.uk`,
  resultsFound: (count, query, queryTimeMs) =>
    `Found ${count} results for "${query}"${queryTimeMs === undefined ? "" : ` in ${queryTimeMs} ms`}`,
  resultsNone: (query) => `No results found for "${query}".`,
  notFoundTitle: "404",
  notFoundHeading: "Page not found",
  notFoundBody: "We couldn't find the page you were looking for.",
  notFoundHomeLink: "Back to home",

  glossaryHeading: "Glossary of finance terms",
  glossarySubheading:
    "Plain-English definitions of the money words you'll come across — from AER to Yield. Pick a term from the list, or browse by topic.",
  glossaryDescription:
    "A plain-English glossary of common money, finance and economy terms, browsable by topic.",
  glossaryFooterLink: "Glossary",
  glossaryFilterPlaceholder: "Filter terms…",
  glossaryBreadcrumb: "Glossary",
  glossaryTermCount: (count) => `${count} term${count === 1 ? "" : "s"}`,
  glossarySeeAlso: "See also",
  glossaryBrowseByTopic: "Browse by topic",
  glossaryJumpToLetter: "Jump to a letter",
  glossaryTopicCount: (count) => `${count} term${count === 1 ? "" : "s"}`,
  glossaryRecentlyAdded: "Recently added",
  glossaryRecentlyAddedBadge: "NEW",

  toolsTakeHomeName: "Take Home Pay Calculator",
  toolsTakeHomeShortName: "Take-home pay",
  toolsTakeHomeDescription:
    "Calculate how much you should earn after taxes and other contributions",
  toolsSavingsName: "Savings Growth Calculator",
  toolsSavingsShortName: "Savings growth",
  toolsSavingsDescription:
    "See how your savings will grow with compound interest and regular deposits",
  toolsStudentLoanName: "Student Loan Repayment Calculator",
  toolsStudentLoanShortName: "Student loan",
  toolsStudentLoanDescription:
    "Find out how long it will take to repay your student loan",

  toolsTakeHomePageTitle: "Take-Home Pay Calculator",
  toolsTakeHomePageDescription:
    "Calculate your exact take-home pay after tax and National Insurance with this handy calculator",
  toolsSavingsPageTitle: "Savings Growth Calculator",
  toolsSavingsPageDescription:
    "See how your savings will grow with compound interest, regular deposits and a fixed annual interest rate.",
  toolsStudentLoanPageTitle: "Student Loan Repayment Calculator",
  toolsStudentLoanPageDescription:
    "Find out how long it will take to repay your UK student loan, how much you will pay back in total, and whether your loan will be written off — based on your salary, plan and graduation year.",

  optional: "optional",
  pluralYears: (n) => `${n} year${n === 1 ? "" : "s"}`,
  pluralPlans: (n) => `${n} plan${n === 1 ? "" : "s"}`,

  thTaxYearHeading: "Tax year",
  thTaxYearAria: "Tax year",
  thCountryHeading: "Which country do you work in?",
  thCountryAria: "Country",
  thCountryEngNiWales: "England, Northern Ireland or Wales",
  thCountryScotland: "Scotland",
  thSalaryHeading: "Your salary",
  thSalaryAria: "Gross salary",
  thSalaryPlaceholder: "For example: 45000",
  thFreqWeekly: "Weekly",
  thFreqFortnightly: "Fortnightly",
  thFreqMonthly: "Monthly",
  thFreqAnnually: "Annually",
  thPensionTitle: "Pension contribution",
  thPensionAria: "Pension contribution",
  thPensionIntro:
    "Auto-enrolment pensions reduce your take-home pay differently depending on the relief method your employer uses.",
  thPensionNetPay: "Net pay arrangement",
  thPensionNetPayHelp:
    "Deducted before income tax — tax relief is automatic at your marginal rate.",
  thPensionRas: "Relief at source",
  thPensionRasHelp:
    "Deducted from net pay; provider claims back basic-rate (20%) relief.",
  thPensionPercentPlaceholder: "For example: 5",
  thPensionAmountPlaceholder: "For example: 200",
  thPensionPercentHelp:
    "Percentage of your gross salary (and bonus) paid into your pension.",
  thPensionAmountHelp:
    "Amount paid into your pension at the same frequency as your salary above.",
  thBonusTitle: "Annual bonus",
  thBonusAria: "Annual bonus",
  thBonusIntro: "A one-off annual bonus, paid in a single month.",
  thBonusPlaceholder: "For example: 5000",
  thStudentLoanTitle: "Student loan",
  thStudentLoanPlan1: "Plan 1",
  thStudentLoanPlan2: "Plan 2",
  thStudentLoanPlan4: "Plan 4 (Scotland)",
  thStudentLoanPlan5: "Plan 5",
  thResultHeading: "Your Take-Home Pay",
  thResultMonthly: (f) => `${f} monthly`,
  thResultAnnual: (f) => `${f} annually`,
  thBonusMonthHeading: "Bonus month take-home",
  thBonusMonthSummary: (bonus) => `${bonus} in bonus month`,
  thBonusMonthMonthly: (f) => `${f} in bonus month`,
  thBonusMonthAnnual: (f) => `${f} annually including bonus.`,
  thBonusMonthNetOnTop: (netBonus, regular) =>
    `${netBonus} net bonus on top of your regular ${regular}.`,
  thWorkingsHeading: "How this was worked out",
  thWorkingsSalary: "Your salary",
  thWorkingsBonus: "Annual bonus",
  thWorkingsTaxFree: "Tax-free amount",
  thWorkingsPension: "Pension contribution",
  thWorkingsPensionCost: (method, cost) =>
    `${method} — costs you ${cost} from take-home.`,
  thWorkingsNi: "National Insurance (NI)",
  thWorkingsIncomeTax: "Income tax",
  thBandBasicRate: "Basic rate (20%)",
  thBandHigherRate: "Higher rate (40%)",
  thBandAdditionalRate: "Additional rate (45%)",
  thBandStarterRate: "Starter rate",
  thBandBasicRateScot: "Basic rate",
  thBandIntermediateRate: "Intermediate rate",
  thBandHigherRateScot: "Higher rate",
  thBandAdvancedRate: "Advanced rate",
  thBandTopRate: "Top rate",
  thWorkingsStudentLoan: "Student loan",
  thRasNote:
    "Note: with relief at source you'd typically claim back the extra higher-rate tax relief via Self Assessment.",

  svStartingBalanceTitle: "Starting balance",
  svStartingBalanceHelp: "How much you have saved already.",
  svStartingBalanceAria: "Starting balance in pounds",
  svStartingBalancePlaceholder: "For example: 1000",
  svMonthlyDepositTitle: "Monthly deposit",
  svMonthlyDepositHelp:
    "How much you plan to add each month. Leave blank if you don't plan to add anything.",
  svMonthlyDepositAria: "Monthly deposit in pounds",
  svMonthlyDepositPlaceholder: "For example: 100",
  svInterestRateTitle: "Annual interest rate",
  svInterestRateHelp:
    "The yearly rate (AER) your savings earn. UK savings accounts typically advertise this figure.",
  svInterestRateAria: "Annual interest rate as a percentage",
  svInterestRatePlaceholder: "For example: 5",
  svTimePeriodTitle: "Time period",
  svTimePeriodHelp: "How many years you plan to save for.",
  svTimePeriodAria: "Time period in years",
  svTimePeriodPlaceholder: "For example: 10",
  svYearsUnit: "years",
  svAssumptionNote:
    "Assumes interest compounds monthly and that you make each deposit at the start of the month. Tax on interest is not included.",
  svFinalBalanceHeading: "Final balance",
  svAfterYears: (years) => `after ${years} year${years === 1 ? "" : "s"}`,
  svYourMoney: "Your money",
  svStartingBalanceLine: "Starting balance",
  svTotalDeposits: "Total deposits",
  svInterestEarned: "Interest earned",
  svBreakdownToggle: "Show year-by-year breakdown",
  svTableYear: "Year",
  svTableDeposits: "Deposits",
  svTableInterest: "Interest",
  svTableBalance: "Balance",
  svYearLabel: (year) => {
    if (Number.isInteger(year)) {
      return `Year ${year}`;
    }

    return `Year ${year.toFixed(2).replace(/\.?0+$/, "")}`;
  },

  slPlan1: "Plan 1",
  slPlan2: "Plan 2",
  slPlan4: "Plan 4",
  slPlan5: "Plan 5",
  slPostgrad: "Postgraduate Loan",
  slBalanceTitle: "Current loan balance",
  slBalanceHelp:
    "The amount you currently owe. You can find this on your Student Loans Company online account.",
  slBalanceAria: "Current loan balance in pounds",
  slBalancePlaceholder: "For example: 35000",
  slYearGraduatedTitle: "Year you graduated",
  slYearGraduatedHelp:
    "You start repaying the April after you finish your course. If you have not graduated yet, enter the year you expect to.",
  slYearGraduatedAria: "Year you graduated",
  slYearGraduatedPlaceholder: (year) => `For example: ${year}`,
  slPlanTitle: "Repayment plan",
  slPlanHelpBefore:
    "Your plan depends on when and where you studied. Check your ",
  slPlanHelpLink: "repayment plan details",
  slPlanHelpAfter: " if you are not sure.",
  slPlanAria: "Repayment plan",
  slSalaryTitle: "Current annual salary",
  slSalaryHelp:
    "Your gross income before tax and other deductions, including bonuses.",
  slSalaryAria: "Current annual salary in pounds",
  slSalaryPlaceholder: "For example: 35000",
  slSalaryGrowthTitle: "Expected annual salary growth",
  slSalaryGrowthHelp:
    "How much you expect your pay to rise each year, on average.",
  slSalaryGrowthAria: "Annual salary growth as a percentage",
  slSalaryGrowthPlaceholder: "For example: 5",
  slInflationTitle: "Expected annual inflation",
  slInflationHelp:
    "The repayment threshold is reviewed each April. We assume it grows in line with inflation, so a higher figure means more of your pay stays below the threshold.",
  slInflationAria: "Annual inflation as a percentage",
  slInflationPlaceholder: "For example: 3",
  slOverpaymentTitle: "Monthly overpayment",
  slOverpaymentHelp:
    "Voluntary extra payment you'll make each month on top of the statutory deduction. You can make voluntary repayments directly to the Student Loans Company at any time.",
  slOverpaymentAria: "Monthly overpayment in pounds",
  slOverpaymentPlaceholder: "For example: 100",
  slAssumptionNote:
    "Estimates based on current plan thresholds and rates. Plan 2 interest scales with income between £29,385 and £52,485. Real-world thresholds and rates can change each April.",
  slWithoutOverpayment: "Without overpayment",
  slWithOverpayment: "With overpayment",
  slPaidLabel: (formatted) => `${formatted} paid`,
  slPaidOffIn: (years) => `Paid off in ${years} year${years === 1 ? "" : "s"}`,
  slWrittenOffAfter: (years) =>
    `Written off after ${years} year${years === 1 ? "" : "s"}`,
  slForgivenIn: (formatted, year) => `${formatted} forgiven in ${year}`,
  slForgivenInYear: (year) => `forgiven in ${year}`,
  slOverpayingCostsMore: (more, writeOff) =>
    `Overpaying costs you ${more} more — without it, your loan would have been written off in ${writeOff}.`,
  slSavingsTimeAndMoney: (years, money) =>
    `You save ${years} year${years === 1 ? "" : "s"} and ${money}.`,
  slSavingsTimeOnly: (years) =>
    `You save ${years} year${years === 1 ? "" : "s"}.`,
  slTotalPaidBack: "total paid back",
  slYouRepaid: "You repaid",
  slInterestAccrued: "Interest accrued",
  slForgivenAtWriteOff: "Forgiven at write-off",
  slBreakdownToggle: "Show year-by-year breakdown",
  slTableYear: "Year",
  slTableSalary: "Salary",
  slTableRepayment: "Repayment",
  slTableInterest: "Interest",
  slTableBalance: "Balance",
  slStatusStudying: "Studying",
  slStatusPaidOff: "Paid off",
  slStatusRepaying: "Repaying",
  slEmptyState:
    "Enter your details on the left to see your repayment forecast.",
};
