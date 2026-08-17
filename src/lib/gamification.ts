// lib/gamification.ts
// Badge definitions and leaderboard utilities

export type Badge = 
  | 'first_contribution'
  | 'contributor_5'
  | 'contributor_25'
  | 'contributor_100'
  | 'validator_10'
  | 'validator_50'
  | 'early_adopter'
  | 'health_champion'

export interface BadgeInfo {
  id: Badge
  name: string
  emoji: string
  description: string
  requirement: string
}

export const BADGES: Record<Badge, BadgeInfo> = {
  first_contribution: {
    id: 'first_contribution',
    name: 'First Contribution',
    emoji: '🌟',
    description: 'Submitted your first product to the database',
    requirement: '1 contribution',
  },
  contributor_5: {
    id: 'contributor_5',
    name: 'Contributor',
    emoji: '🙌',
    description: 'Contributed 5 products to the database',
    requirement: '5 contributions',
  },
  contributor_25: {
    id: 'contributor_25',
    name: 'Top Contributor',
    emoji: '🏆',
    description: 'Contributed 25 products to the database',
    requirement: '25 contributions',
  },
  contributor_100: {
    id: 'contributor_100',
    name: 'India Champion',
    emoji: '🇮🇳',
    description: 'Contributed 100 products - helping millions!',
    requirement: '100 contributions',
  },
  validator_10: {
    id: 'validator_10',
    name: 'Quality Checker',
    emoji: '✅',
    description: 'Validated 10 products',
    requirement: '10 validations',
  },
  validator_50: {
    id: 'validator_50',
    name: 'Quality Master',
    emoji: '🔍',
    description: 'Validated 50 products',
    requirement: '50 validations',
  },
  early_adopter: {
    id: 'early_adopter',
    name: 'Early Adopter',
    emoji: '🚀',
    description: 'Joined during launch phase',
    requirement: 'Joined before 2025',
  },
  health_champion: {
    id: 'health_champion',
    name: 'Health Champion',
    emoji: '💚',
    description: 'Made 100 health scans',
    requirement: '100 scans',
  },
}

export function calculateBadges(contributions: number, validations: number): Badge[] {
  const earned: Badge[] = []
  
  // Contribution badges
  if (contributions >= 1) earned.push('first_contribution')
  if (contributions >= 5) earned.push('contributor_5')
  if (contributions >= 25) earned.push('contributor_25')
  if (contributions >= 100) earned.push('contributor_100')
  
  // Validation badges
  if (validations >= 10) earned.push('validator_10')
  if (validations >= 50) earned.push('validator_50')
  
  return earned
}

export function getImpactMessage(contributions: number): string {
  if (contributions === 0) return 'Start contributing to help Indians eat healthier!'
  if (contributions < 5) return `You've helped ${contributions * 1000}+ people make better food choices!`
  if (contributions < 25) return `Your contributions are helping ${contributions * 1000}+ Indians!`
  if (contributions < 100) return `Amazing! You've impacted ${contributions * 1000}+ lives!`
  return `India Champion! Your database contributions help millions!`
}