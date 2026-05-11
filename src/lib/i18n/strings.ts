import type { Locale } from "./locales";

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
	resultsFound: (count: number, query: string) => string;
	resultsNone: (query: string) => string;
	notFoundTitle: string;
	notFoundHeading: string;
	notFoundBody: string;
	notFoundHomeLink: string;
	languageSwitcherLabel: string;

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

const enGb: Strings = {
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
	resultsFound: (count, query) => `Found ${count} results for "${query}"`,
	resultsNone: (query) => `No results found for "${query}".`,
	notFoundTitle: "404",
	notFoundHeading: "Page not found",
	notFoundBody: "We couldn't find the page you were looking for.",
	notFoundHomeLink: "Back to home",
	languageSwitcherLabel: "Language",

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
		if (Number.isInteger(year)) return `Year ${year}`;
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

const cy: Strings = {
	siteName: "MoneyManual.org.uk",
	titleSuffix: " - MoneyManual.org.uk",
	siteTagline: "Croeso i MoneyManual.org.uk",
	siteDescription:
		"Mae Money Manual yn wyddoniadur ar gyfer popeth sy'n ymwneud ag arian, cyllid a'r economi.",
	home: "Hafan",
	topics: "Pynciau",
	tools: "Offer",
	seeAll: "Gweld y cyfan →",
	search: "Chwilio",
	searchPageHeading: "Chwilio ar MoneyManual.org.uk",
	searchPlaceholder: "Chwilio MoneyManual",
	findATopic: "Dewch o hyd i bwnc",
	heroHeading: "Gwybodaeth am arian, cyllid ac economi'r DU",
	heroSubheading:
		"Canllawiau am ddim i'ch helpu i arbed arian, rheoli dyledion a deall eich cyllid.",
	homepageDescription:
		"Mae Money Manual yn wyddoniadur ar gyfer popeth sy'n ymwneud ag arian, cyllid a'r economi.",
	toolsHeading: "Offer a Chyfrifianellau",
	toolsSubheading:
		"Casgliad o offer cyllid a chyfrifianellau arian defnyddiol.",
	sitemap: "Map o'r safle",
	searchTheSite: "Chwilio'r safle",
	footerTagline:
		"Canllawiau am ddim, mewn iaith glir, i arian, cyllid ac economi'r DU.",
	notFinancialAdvice: "Gwybodaeth yn unig — nid cyngor ariannol.",
	copyright: (year) => `© ${year} MoneyManual.org.uk`,
	resultsFound: (count, query) =>
		`Wedi dod o hyd i ${count} canlyniad ar gyfer "${query}"`,
	resultsNone: (query) => `Dim canlyniadau ar gyfer "${query}".`,
	notFoundTitle: "404",
	notFoundHeading: "Heb ddod o hyd i'r dudalen",
	notFoundBody: "Ni allwn ddod o hyd i'r dudalen yr oeddech yn chwilio amdani.",
	notFoundHomeLink: "Yn ôl i'r hafan",
	languageSwitcherLabel: "Iaith",

	toolsTakeHomeName: "Cyfrifiannell Cyflog Net",
	toolsTakeHomeShortName: "Cyflog net",
	toolsTakeHomeDescription:
		"Cyfrifwch faint y dylech ei ennill ar ôl trethi a chyfraniadau eraill",
	toolsSavingsName: "Cyfrifiannell Twf Cynilion",
	toolsSavingsShortName: "Twf cynilion",
	toolsSavingsDescription:
		"Gwelwch sut bydd eich cynilion yn tyfu gyda llog cyfansawdd a blaendaliadau rheolaidd",
	toolsStudentLoanName: "Cyfrifiannell Ad-dalu Benthyciad Myfyriwr",
	toolsStudentLoanShortName: "Benthyciad myfyriwr",
	toolsStudentLoanDescription:
		"Darganfyddwch pa mor hir y bydd yn ei gymryd i ad-dalu eich benthyciad myfyriwr",

	toolsTakeHomePageTitle: "Cyfrifiannell Cyflog Net",
	toolsTakeHomePageDescription:
		"Cyfrifwch eich cyflog net union ar ôl treth ac Yswiriant Gwladol gyda'r gyfrifiannell hwylus hon",
	toolsSavingsPageTitle: "Cyfrifiannell Twf Cynilion",
	toolsSavingsPageDescription:
		"Gwelwch sut bydd eich cynilion yn tyfu gyda llog cyfansawdd, blaendaliadau rheolaidd a chyfradd llog flynyddol sefydlog.",
	toolsStudentLoanPageTitle: "Cyfrifiannell Ad-dalu Benthyciad Myfyriwr",
	toolsStudentLoanPageDescription:
		"Darganfyddwch pa mor hir y bydd yn ei gymryd i ad-dalu eich benthyciad myfyriwr DU, faint y byddwch yn ei ad-dalu i gyd, ac a fydd eich benthyciad yn cael ei ddileu — yn seiliedig ar eich cyflog, cynllun a blwyddyn graddio.",

	optional: "dewisol",
	pluralYears: (n) => `${n} ${n === 1 ? "flwyddyn" : "blynedd"}`,
	pluralPlans: (n) => `${n} ${n === 1 ? "cynllun" : "cynllun"}`,

	thTaxYearHeading: "Blwyddyn dreth",
	thTaxYearAria: "Blwyddyn dreth",
	thCountryHeading: "Pa wlad rydych yn gweithio ynddi?",
	thCountryAria: "Gwlad",
	thCountryEngNiWales: "Lloegr, Gogledd Iwerddon neu Gymru",
	thCountryScotland: "Yr Alban",
	thSalaryHeading: "Eich cyflog",
	thSalaryAria: "Cyflog gros",
	thSalaryPlaceholder: "Er enghraifft: 45000",
	thFreqWeekly: "Wythnosol",
	thFreqFortnightly: "Bob pythefnos",
	thFreqMonthly: "Misol",
	thFreqAnnually: "Blynyddol",
	thPensionTitle: "Cyfraniad pensiwn",
	thPensionAria: "Cyfraniad pensiwn",
	thPensionIntro:
		"Mae pensiynau awtogofrestru yn lleihau eich cyflog net yn wahanol yn dibynnu ar y dull rhyddhad mae eich cyflogwr yn ei ddefnyddio.",
	thPensionNetPay: "Trefniant cyflog net",
	thPensionNetPayHelp:
		"Tynnu cyn treth incwm — mae rhyddhad treth yn awtomatig ar eich cyfradd ymylol.",
	thPensionRas: "Rhyddhad wrth y ffynhonnell",
	thPensionRasHelp:
		"Tynnu o gyflog net; mae'r darparwr yn hawlio rhyddhad cyfradd sylfaenol (20%) yn ôl.",
	thPensionPercentPlaceholder: "Er enghraifft: 5",
	thPensionAmountPlaceholder: "Er enghraifft: 200",
	thPensionPercentHelp:
		"Canran o'ch cyflog gros (a bonws) a delir i'ch pensiwn.",
	thPensionAmountHelp:
		"Swm a delir i'ch pensiwn ar yr un amlder â'ch cyflog uchod.",
	thBonusTitle: "Bonws blynyddol",
	thBonusAria: "Bonws blynyddol",
	thBonusIntro: "Bonws blynyddol un-tro, a delir mewn un mis.",
	thBonusPlaceholder: "Er enghraifft: 5000",
	thStudentLoanTitle: "Benthyciad myfyriwr",
	thStudentLoanPlan1: "Cynllun 1",
	thStudentLoanPlan2: "Cynllun 2",
	thStudentLoanPlan4: "Cynllun 4 (Yr Alban)",
	thStudentLoanPlan5: "Cynllun 5",
	thResultHeading: "Eich Cyflog Net",
	thResultMonthly: (f) => `${f} y mis`,
	thResultAnnual: (f) => `${f} y flwyddyn`,
	thBonusMonthHeading: "Cyflog net mis bonws",
	thBonusMonthSummary: (bonus) => `${bonus} ym mis y bonws`,
	thBonusMonthMonthly: (f) => `${f} ym mis y bonws`,
	thBonusMonthAnnual: (f) => `${f} y flwyddyn yn cynnwys y bonws.`,
	thBonusMonthNetOnTop: (netBonus, regular) =>
		`${netBonus} bonws net ar ben eich ${regular} arferol.`,
	thWorkingsHeading: "Sut cyfrifwyd hyn",
	thWorkingsSalary: "Eich cyflog",
	thWorkingsBonus: "Bonws blynyddol",
	thWorkingsTaxFree: "Swm di-dreth",
	thWorkingsPension: "Cyfraniad pensiwn",
	thWorkingsPensionCost: (method, cost) =>
		`${method} — yn costio ${cost} i chi o'ch cyflog net.`,
	thWorkingsNi: "Yswiriant Gwladol (YG)",
	thWorkingsIncomeTax: "Treth incwm",
	thBandBasicRate: "Cyfradd sylfaenol (20%)",
	thBandHigherRate: "Cyfradd uwch (40%)",
	thBandAdditionalRate: "Cyfradd ychwanegol (45%)",
	thBandStarterRate: "Cyfradd gychwynnol",
	thBandBasicRateScot: "Cyfradd sylfaenol",
	thBandIntermediateRate: "Cyfradd ganolradd",
	thBandHigherRateScot: "Cyfradd uwch",
	thBandAdvancedRate: "Cyfradd uwch ychwanegol",
	thBandTopRate: "Cyfradd uchaf",
	thWorkingsStudentLoan: "Benthyciad myfyriwr",
	thRasNote:
		"Sylwer: gyda rhyddhad wrth y ffynhonnell byddech yn arferol yn hawlio'r rhyddhad treth cyfradd uwch ychwanegol yn ôl drwy Hunanasesiad.",

	svStartingBalanceTitle: "Balans cychwynnol",
	svStartingBalanceHelp: "Faint sydd gennych wedi'i gynilo eisoes.",
	svStartingBalanceAria: "Balans cychwynnol mewn punnoedd",
	svStartingBalancePlaceholder: "Er enghraifft: 1000",
	svMonthlyDepositTitle: "Blaendal misol",
	svMonthlyDepositHelp:
		"Faint rydych yn bwriadu ei ychwanegu bob mis. Gadewch yn wag os nad ydych yn bwriadu ychwanegu unrhyw beth.",
	svMonthlyDepositAria: "Blaendal misol mewn punnoedd",
	svMonthlyDepositPlaceholder: "Er enghraifft: 100",
	svInterestRateTitle: "Cyfradd llog flynyddol",
	svInterestRateHelp:
		"Y gyfradd flynyddol (AER) mae eich cynilion yn ei ennill. Mae cyfrifon cynilo'r DU fel arfer yn hysbysebu'r ffigwr hwn.",
	svInterestRateAria: "Cyfradd llog flynyddol fel canran",
	svInterestRatePlaceholder: "Er enghraifft: 5",
	svTimePeriodTitle: "Cyfnod amser",
	svTimePeriodHelp: "Sawl blwyddyn rydych yn bwriadu cynilo ar eu cyfer.",
	svTimePeriodAria: "Cyfnod amser mewn blynyddoedd",
	svTimePeriodPlaceholder: "Er enghraifft: 10",
	svYearsUnit: "blynedd",
	svAssumptionNote:
		"Yn rhagdybio bod llog yn cyfansoddi'n fisol a'ch bod yn gwneud pob blaendal ar ddechrau'r mis. Nid yw treth ar log wedi'i chynnwys.",
	svFinalBalanceHeading: "Balans terfynol",
	svAfterYears: (years) =>
		`ar ôl ${years} ${years === 1 ? "flwyddyn" : "blynedd"}`,
	svYourMoney: "Eich arian",
	svStartingBalanceLine: "Balans cychwynnol",
	svTotalDeposits: "Cyfanswm blaendaliadau",
	svInterestEarned: "Llog a enillwyd",
	svBreakdownToggle: "Dangos dadansoddiad fesul blwyddyn",
	svTableYear: "Blwyddyn",
	svTableDeposits: "Blaendaliadau",
	svTableInterest: "Llog",
	svTableBalance: "Balans",
	svYearLabel: (year) => {
		if (Number.isInteger(year)) return `Blwyddyn ${year}`;
		return `Blwyddyn ${year.toFixed(2).replace(/\.?0+$/, "")}`;
	},

	slPlan1: "Cynllun 1",
	slPlan2: "Cynllun 2",
	slPlan4: "Cynllun 4",
	slPlan5: "Cynllun 5",
	slPostgrad: "Benthyciad Ôl-raddedig",
	slBalanceTitle: "Balans benthyciad presennol",
	slBalanceHelp:
		"Y swm rydych yn ei ddyled ar hyn o bryd. Gallwch ddod o hyd i hyn ar eich cyfrif ar-lein gyda'r Cwmni Benthyciadau Myfyrwyr.",
	slBalanceAria: "Balans benthyciad presennol mewn punnoedd",
	slBalancePlaceholder: "Er enghraifft: 35000",
	slYearGraduatedTitle: "Y flwyddyn y graddioch",
	slYearGraduatedHelp:
		"Rydych yn dechrau ad-dalu o'r Ebrill ar ôl i chi orffen eich cwrs. Os nad ydych wedi graddio eto, rhowch y flwyddyn rydych yn disgwyl ei wneud.",
	slYearGraduatedAria: "Y flwyddyn y graddioch",
	slYearGraduatedPlaceholder: (year) => `Er enghraifft: ${year}`,
	slPlanTitle: "Cynllun ad-dalu",
	slPlanHelpBefore:
		"Mae eich cynllun yn dibynnu ar bryd a ble y buoch yn astudio. Edrychwch ar eich ",
	slPlanHelpLink: "manylion cynllun ad-dalu",
	slPlanHelpAfter: " os nad ydych yn siŵr.",
	slPlanAria: "Cynllun ad-dalu",
	slSalaryTitle: "Cyflog blynyddol presennol",
	slSalaryHelp:
		"Eich incwm gros cyn treth a didyniadau eraill, gan gynnwys bonysau.",
	slSalaryAria: "Cyflog blynyddol presennol mewn punnoedd",
	slSalaryPlaceholder: "Er enghraifft: 35000",
	slSalaryGrowthTitle: "Twf cyflog blynyddol disgwyliedig",
	slSalaryGrowthHelp:
		"Faint rydych yn disgwyl i'ch cyflog godi bob blwyddyn, ar gyfartaledd.",
	slSalaryGrowthAria: "Twf cyflog blynyddol fel canran",
	slSalaryGrowthPlaceholder: "Er enghraifft: 5",
	slInflationTitle: "Chwyddiant blynyddol disgwyliedig",
	slInflationHelp:
		"Adolygir y trothwy ad-dalu bob Ebrill. Rydym yn rhagdybio ei fod yn tyfu yn unol â chwyddiant, felly mae ffigwr uwch yn golygu bod mwy o'ch cyflog yn aros o dan y trothwy.",
	slInflationAria: "Chwyddiant blynyddol fel canran",
	slInflationPlaceholder: "Er enghraifft: 3",
	slOverpaymentTitle: "Gordaliad misol",
	slOverpaymentHelp:
		"Taliad ychwanegol gwirfoddol y byddwch yn ei wneud bob mis ar ben y didyniad statudol. Gallwch wneud ad-daliadau gwirfoddol yn uniongyrchol i'r Cwmni Benthyciadau Myfyrwyr ar unrhyw adeg.",
	slOverpaymentAria: "Gordaliad misol mewn punnoedd",
	slOverpaymentPlaceholder: "Er enghraifft: 100",
	slAssumptionNote:
		"Amcangyfrifon yn seiliedig ar drothwyon a chyfraddau cynllun cyfredol. Mae llog Cynllun 2 yn graddio gydag incwm rhwng £29,385 a £52,485. Gall trothwyon a chyfraddau go iawn newid bob Ebrill.",
	slWithoutOverpayment: "Heb ordaliad",
	slWithOverpayment: "Gyda gordaliad",
	slPaidLabel: (formatted) => `${formatted} wedi'i dalu`,
	slPaidOffIn: (years) =>
		`Wedi'i dalu i ffwrdd mewn ${years} ${years === 1 ? "flwyddyn" : "blynedd"}`,
	slWrittenOffAfter: (years) =>
		`Wedi'i ddileu ar ôl ${years} ${years === 1 ? "flwyddyn" : "blynedd"}`,
	slForgivenIn: (formatted, year) => `${formatted} wedi'i ddileu yn ${year}`,
	slForgivenInYear: (year) => `wedi'i ddileu yn ${year}`,
	slOverpayingCostsMore: (more, writeOff) =>
		`Mae gordalu yn costio ${more} yn fwy i chi — heb hynny, byddai eich benthyciad wedi cael ei ddileu yn ${writeOff}.`,
	slSavingsTimeAndMoney: (years, money) =>
		`Rydych yn arbed ${years} ${years === 1 ? "flwyddyn" : "blynedd"} a ${money}.`,
	slSavingsTimeOnly: (years) =>
		`Rydych yn arbed ${years} ${years === 1 ? "flwyddyn" : "blynedd"}.`,
	slTotalPaidBack: "wedi'i dalu'n ôl i gyd",
	slYouRepaid: "Fe wnaethoch ad-dalu",
	slInterestAccrued: "Llog a gronnwyd",
	slForgivenAtWriteOff: "Wedi'i ddileu ar ôl dileu",
	slBreakdownToggle: "Dangos dadansoddiad fesul blwyddyn",
	slTableYear: "Blwyddyn",
	slTableSalary: "Cyflog",
	slTableRepayment: "Ad-daliad",
	slTableInterest: "Llog",
	slTableBalance: "Balans",
	slStatusStudying: "Yn astudio",
	slStatusPaidOff: "Wedi'i dalu",
	slStatusRepaying: "Yn ad-dalu",
	slEmptyState:
		"Rhowch eich manylion ar y chwith i weld eich rhagolwg ad-dalu.",
};

const sco: Strings = {
	siteName: "MoneyManual.org.uk",
	titleSuffix: " - MoneyManual.org.uk",
	siteTagline: "Walcome tae MoneyManual.org.uk",
	siteDescription:
		"Money Manual is an encyclopaedia for awthing aboot siller, finance an the economy.",
	home: "Hame",
	topics: "Subjecks",
	tools: "Tuils",
	seeAll: "See aw →",
	search: "Sairch",
	searchPageHeading: "Sairch on MoneyManual.org.uk",
	searchPlaceholder: "Sairch MoneyManual",
	findATopic: "Find a subjeck",
	heroHeading: "Information aboot siller, finance an the UK economy",
	heroSubheading:
		"Free guides tae help ye save siller, manage debt an unnerstaund yer finances.",
	homepageDescription:
		"Money Manual is an encyclopaedia for awthing tae dae wi siller, finance an the economy.",
	toolsHeading: "Tuils an Calculators",
	toolsSubheading: "A wheen o usefae finance tuils an siller calculators.",
	sitemap: "Steid map",
	searchTheSite: "Sairch the steid",
	footerTagline:
		"Free, plain-spoken guides tae siller, finance an the UK economy.",
	notFinancialAdvice: "Information ainly — no financial advice.",
	copyright: (year) => `© ${year} MoneyManual.org.uk`,
	resultsFound: (count, query) => `Fund ${count} results for "${query}"`,
	resultsNone: (query) => `Nae results fund for "${query}".`,
	notFoundTitle: "404",
	notFoundHeading: "Page no fund",
	notFoundBody: "We couldna find the page ye wis luikin for.",
	notFoundHomeLink: "Back tae hame",
	languageSwitcherLabel: "Leid",

	toolsTakeHomeName: "Tak-Hame Pey Calculator",
	toolsTakeHomeShortName: "Tak-hame pey",
	toolsTakeHomeDescription:
		"Wirk oot hoo muckle ye should earn efter taxes an ither contributions",
	toolsSavingsName: "Savins Growthie Calculator",
	toolsSavingsShortName: "Savins growthie",
	toolsSavingsDescription:
		"See hoo yer savins will growe wi compoond interest an regular deposits",
	toolsStudentLoanName: "Student Loan Repeyment Calculator",
	toolsStudentLoanShortName: "Student loan",
	toolsStudentLoanDescription:
		"Find oot hoo lang it'll tak tae pey back yer student loan",

	toolsTakeHomePageTitle: "Tak-Hame Pey Calculator",
	toolsTakeHomePageDescription:
		"Wirk oot yer exact tak-hame pey efter tax an Naitional Insurance wi this haundy calculator",
	toolsSavingsPageTitle: "Savins Growthie Calculator",
	toolsSavingsPageDescription:
		"See hoo yer savins will growe wi compoond interest, regular deposits an a fixed yearly interest rate.",
	toolsStudentLoanPageTitle: "Student Loan Repeyment Calculator",
	toolsStudentLoanPageDescription:
		"Find oot hoo lang it'll tak tae pey back yer UK student loan, hoo muckle ye'll pey back aw thegither, an gin yer loan'll be written aff — based on yer pey, plan an graduation year.",

	optional: "optional",
	pluralYears: (n) => `${n} year${n === 1 ? "" : "s"}`,
	pluralPlans: (n) => `${n} plan${n === 1 ? "" : "s"}`,

	thTaxYearHeading: "Tax year",
	thTaxYearAria: "Tax year",
	thCountryHeading: "Whit kintra dae ye wirk in?",
	thCountryAria: "Kintra",
	thCountryEngNiWales: "Ingland, Northren Ireland or Wales",
	thCountryScotland: "Scotland",
	thSalaryHeading: "Yer pey",
	thSalaryAria: "Gross pey",
	thSalaryPlaceholder: "For ensample: 45000",
	thFreqWeekly: "Weekly",
	thFreqFortnightly: "Fortnichtly",
	thFreqMonthly: "Monthly",
	thFreqAnnually: "Yearly",
	thPensionTitle: "Pension contribution",
	thPensionAria: "Pension contribution",
	thPensionIntro:
		"Auto-enrolment pensions cut yer tak-hame pey differently dependin on the relief method yer employer uses.",
	thPensionNetPay: "Net pey arrangement",
	thPensionNetPayHelp:
		"Taen aff afore income tax — tax relief is automatic at yer marginal rate.",
	thPensionRas: "Relief at soorce",
	thPensionRasHelp:
		"Taen aff o net pey; the provider claims back basic-rate (20%) relief.",
	thPensionPercentPlaceholder: "For ensample: 5",
	thPensionAmountPlaceholder: "For ensample: 200",
	thPensionPercentHelp:
		"Percentage o yer gross pey (an bonus) peyed intae yer pension.",
	thPensionAmountHelp:
		"Amoont peyed intae yer pension at the same frequency as yer pey abuin.",
	thBonusTitle: "Yearly bonus",
	thBonusAria: "Yearly bonus",
	thBonusIntro: "A wan-aff yearly bonus, peyed in a single month.",
	thBonusPlaceholder: "For ensample: 5000",
	thStudentLoanTitle: "Student loan",
	thStudentLoanPlan1: "Plan 1",
	thStudentLoanPlan2: "Plan 2",
	thStudentLoanPlan4: "Plan 4 (Scotland)",
	thStudentLoanPlan5: "Plan 5",
	thResultHeading: "Yer Tak-Hame Pey",
	thResultMonthly: (f) => `${f} monthly`,
	thResultAnnual: (f) => `${f} yearly`,
	thBonusMonthHeading: "Bonus-month tak-hame",
	thBonusMonthSummary: (bonus) => `${bonus} in the bonus month`,
	thBonusMonthMonthly: (f) => `${f} in the bonus month`,
	thBonusMonthAnnual: (f) => `${f} yearly includin the bonus.`,
	thBonusMonthNetOnTop: (netBonus, regular) =>
		`${netBonus} net bonus on tap o yer regular ${regular}.`,
	thWorkingsHeading: "Hoo this wis wirked oot",
	thWorkingsSalary: "Yer pey",
	thWorkingsBonus: "Yearly bonus",
	thWorkingsTaxFree: "Tax-free amoont",
	thWorkingsPension: "Pension contribution",
	thWorkingsPensionCost: (method, cost) =>
		`${method} — costs ye ${cost} fae yer tak-hame.`,
	thWorkingsNi: "Naitional Insurance (NI)",
	thWorkingsIncomeTax: "Income tax",
	thBandBasicRate: "Basic rate (20%)",
	thBandHigherRate: "Heicher rate (40%)",
	thBandAdditionalRate: "Additional rate (45%)",
	thBandStarterRate: "Stairter rate",
	thBandBasicRateScot: "Basic rate",
	thBandIntermediateRate: "Intermediate rate",
	thBandHigherRateScot: "Heicher rate",
	thBandAdvancedRate: "Advanced rate",
	thBandTopRate: "Tap rate",
	thWorkingsStudentLoan: "Student loan",
	thRasNote:
		"Note: wi relief at soorce ye'd usually claim back the extra heicher-rate tax relief by Self Assessment.",

	svStartingBalanceTitle: "Stairtin balance",
	svStartingBalanceHelp: "Hoo muckle ye hae saved awready.",
	svStartingBalanceAria: "Stairtin balance in poonds",
	svStartingBalancePlaceholder: "For ensample: 1000",
	svMonthlyDepositTitle: "Monthly deposit",
	svMonthlyDepositHelp:
		"Hoo muckle ye plan tae pit in ilka month. Lea blank gin ye'r no plannin tae pit onythin in.",
	svMonthlyDepositAria: "Monthly deposit in poonds",
	svMonthlyDepositPlaceholder: "For ensample: 100",
	svInterestRateTitle: "Yearly interest rate",
	svInterestRateHelp:
		"The yearly rate (AER) yer savins earn. UK savins accoonts usually advertise this figur.",
	svInterestRateAria: "Yearly interest rate as a percentage",
	svInterestRatePlaceholder: "For ensample: 5",
	svTimePeriodTitle: "Time period",
	svTimePeriodHelp: "Hoo mony years ye plan tae save for.",
	svTimePeriodAria: "Time period in years",
	svTimePeriodPlaceholder: "For ensample: 10",
	svYearsUnit: "years",
	svAssumptionNote:
		"Assumes interest compoonds monthly an that ye mak ilka deposit at the stairt o the month. Tax on interest isna includit.",
	svFinalBalanceHeading: "Final balance",
	svAfterYears: (years) => `efter ${years} year${years === 1 ? "" : "s"}`,
	svYourMoney: "Yer siller",
	svStartingBalanceLine: "Stairtin balance",
	svTotalDeposits: "Total deposits",
	svInterestEarned: "Interest earned",
	svBreakdownToggle: "Shaw year-by-year brakdoon",
	svTableYear: "Year",
	svTableDeposits: "Deposits",
	svTableInterest: "Interest",
	svTableBalance: "Balance",
	svYearLabel: (year) => {
		if (Number.isInteger(year)) return `Year ${year}`;
		return `Year ${year.toFixed(2).replace(/\.?0+$/, "")}`;
	},

	slPlan1: "Plan 1",
	slPlan2: "Plan 2",
	slPlan4: "Plan 4",
	slPlan5: "Plan 5",
	slPostgrad: "Postgraduate Loan",
	slBalanceTitle: "Current loan balance",
	slBalanceHelp:
		"The amoont ye'r owin the noo. Ye can find this on yer Student Loans Company online accoont.",
	slBalanceAria: "Current loan balance in poonds",
	slBalancePlaceholder: "For ensample: 35000",
	slYearGraduatedTitle: "Year ye graduatit",
	slYearGraduatedHelp:
		"Ye stairt peyin back the Aprile efter ye feenish yer course. Gin ye haena graduatit yet, pit in the year ye expect tae.",
	slYearGraduatedAria: "Year ye graduatit",
	slYearGraduatedPlaceholder: (year) => `For ensample: ${year}`,
	slPlanTitle: "Repeyment plan",
	slPlanHelpBefore: "Yer plan depends on whan an whaur ye studied. Check yer ",
	slPlanHelpLink: "repeyment plan details",
	slPlanHelpAfter: " gin ye'r no shair.",
	slPlanAria: "Repeyment plan",
	slSalaryTitle: "Current yearly pey",
	slSalaryHelp:
		"Yer gross income afore tax an ither deductions, includin bonuses.",
	slSalaryAria: "Current yearly pey in poonds",
	slSalaryPlaceholder: "For ensample: 35000",
	slSalaryGrowthTitle: "Expectit yearly pey growthie",
	slSalaryGrowthHelp:
		"Hoo muckle ye expect yer pey tae rise ilka year, on average.",
	slSalaryGrowthAria: "Yearly pey growthie as a percentage",
	slSalaryGrowthPlaceholder: "For ensample: 5",
	slInflationTitle: "Expectit yearly inflation",
	slInflationHelp:
		"The repeyment threshold is reviewed ilka Aprile. We assume it growes in line wi inflation, sae a heicher figur means mair o yer pey stays ablo the threshold.",
	slInflationAria: "Yearly inflation as a percentage",
	slInflationPlaceholder: "For ensample: 3",
	slOverpaymentTitle: "Monthly owerpeyment",
	slOverpaymentHelp:
		"Voluntary extra peyment ye'll mak ilka month on tap o the statutory deduction. Ye can mak voluntary repeyments straucht tae the Student Loans Company at ony time.",
	slOverpaymentAria: "Monthly owerpeyment in poonds",
	slOverpaymentPlaceholder: "For ensample: 100",
	slAssumptionNote:
		"Estimates based on current plan thresholds an rates. Plan 2 interest scales wi income atween £29,385 an £52,485. Real-warld thresholds an rates can chynge ilka Aprile.",
	slWithoutOverpayment: "Wioot owerpeyment",
	slWithOverpayment: "Wi owerpeyment",
	slPaidLabel: (formatted) => `${formatted} peyed`,
	slPaidOffIn: (years) => `Peyed aff in ${years} year${years === 1 ? "" : "s"}`,
	slWrittenOffAfter: (years) =>
		`Written aff efter ${years} year${years === 1 ? "" : "s"}`,
	slForgivenIn: (formatted, year) => `${formatted} forgien in ${year}`,
	slForgivenInYear: (year) => `forgien in ${year}`,
	slOverpayingCostsMore: (more, writeOff) =>
		`Owerpeyin costs ye ${more} mair — wioot it, yer loan wid hae been written aff in ${writeOff}.`,
	slSavingsTimeAndMoney: (years, money) =>
		`Ye save ${years} year${years === 1 ? "" : "s"} an ${money}.`,
	slSavingsTimeOnly: (years) =>
		`Ye save ${years} year${years === 1 ? "" : "s"}.`,
	slTotalPaidBack: "total peyed back",
	slYouRepaid: "Ye repeyed",
	slInterestAccrued: "Interest accrued",
	slForgivenAtWriteOff: "Forgien at write-aff",
	slBreakdownToggle: "Shaw year-by-year brakdoon",
	slTableYear: "Year",
	slTableSalary: "Pey",
	slTableRepayment: "Repeyment",
	slTableInterest: "Interest",
	slTableBalance: "Balance",
	slStatusStudying: "Studyin",
	slStatusPaidOff: "Peyed aff",
	slStatusRepaying: "Repeyin",
	slEmptyState:
		"Pit in yer details on the left tae see yer repeyment forecast.",
};

const DICT: Record<Locale, Strings> = {
	"en-gb": enGb,
	cy,
	sco,
};

export const t = <K extends keyof Strings>(
	locale: Locale,
	key: K,
): Strings[K] => DICT[locale][key];
