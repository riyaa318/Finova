/** Seed notifications. `hoursAgo` is turned into a real timestamp when the store is first created. */
export const generateNotifications = ({ salaryAmount, salaryId } = {}) => [
  { type: 'budget', title: 'Shopping budget exceeded', message: 'You have used more than 100% of your Shopping budget in the last 30 days.', hoursAgo: 2, read: false, link: '/budgets' },
  { type: 'payment', title: 'Payment received', message: `Salary of ${salaryAmount ?? '\u20B972,500'} was credited to your account.`, hoursAgo: 26, read: false, link: salaryId ? `/transactions/${salaryId}` : '/transactions' },
  { type: 'budget', title: 'Entertainment budget almost used', message: 'You have used 95% of your Entertainment budget. Consider slowing down this month.', hoursAgo: 50, read: false, link: '/budgets' },
  { type: 'goal', title: 'Goal milestone reached', message: 'Emergency Fund is past the 60% mark. Keep going!', hoursAgo: 96, read: true, link: '/goals' },
  { type: 'large', title: 'Large transaction detected', message: 'A payment of \u20B914,000 to Rent - Lakeview Residency was processed.', hoursAgo: 150, read: true, link: '/transactions' },
  { type: 'report', title: 'Your monthly report is ready', message: 'See how your income, spending and savings compare with last month.', hoursAgo: 220, read: true, link: '/analytics' },
  { type: 'goal', title: 'Skill Upgrade Fund completed', message: 'You reached 100% of your Skill Upgrade Fund goal. Nicely done.', hoursAgo: 340, read: true, link: '/goals' },
];
