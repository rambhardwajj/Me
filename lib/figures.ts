/**
 * The headline numbers, each written once. Every badge, tile, case page, receipt and card on /uber reads them from here,
 * and so do the sentences on the main site, so the same fact can never show two values.
 * Source: Ram's résumé (24 Nov 2026). `sold` is Ram's own statement; it is not on the résumé.
 */
export const FIG = {
  /** Synappses, at Newral */
  mrr: '$3K to $10K',
  mrrFrom: '$3K',
  mrrTo: '$10K',
  users: '5K to 70K',
  usersFrom: '5K',
  usersTo: '70K',
  /** unBothrrd */
  sales: '₹7.2L',
  /** TruCost */
  drivers: '100',
  sold: '₹2.5L',
  /** LeetCase */
  leetUsers: '150+',
} as const;
