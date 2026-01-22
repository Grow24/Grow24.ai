// Common types for the application

export interface PBMPPhase {
  name: 'Plan' | 'Build' | 'Measure' | 'Progress'
  description: string
  color: string
}

export interface SolutionData {
  id: string
  name: string
  title: string
  description: string
  color: string
  features: string[]
  category: string
  column: string
}

export interface ResourceData {
  id: string
  title: string
  description: string
  contentType: string
  topic: string
  deliveryType: string
  role: string
  journeyStage: string
  duration: number
  difficulty: string
  tags: string[]
}

export interface UserData {
  id: string
  email: string
  firstName?: string
  lastName?: string
  avatar?: string
  role: 'USER' | 'ADMIN' | 'ENTERPRISE_ADMIN'
}

export type SolutionColumn = 'GOALS' | 'STRATEGY' | 'PLAN' | 'PROJECT' | 'OPERATIONS'
export type ContentType =
  | 'ARTICLE'
  | 'VIDEO'
  | 'WEBINAR'
  | 'CASE_STUDY'
  | 'WHITEPAPER'
  | 'TEMPLATE'
  | 'TOOL'
  | 'FRAMEWORK'
  | 'INTERACTIVE_GUIDE'
  | 'PODCAST'

export type DeliveryType =
  | 'SELF_PACED'
  | 'INSTRUCTOR_LED'
  | 'LIVE_SESSION'
  | 'WORKSHOP'
  | 'ONE_ON_ONE'
  | 'GROUP_COACHING'
  | 'HYBRID'

export type ResourceRole =
  | 'EXECUTIVE'
  | 'MANAGER'
  | 'INDIVIDUAL_CONTRIBUTOR'
  | 'ENTREPRENEUR'
  | 'STUDENT'
  | 'CONSULTANT'
  | 'ALL_ROLES'

export type JourneyStage =
  | 'AWARENESS'
  | 'CONSIDERATION'
  | 'DECISION'
  | 'IMPLEMENTATION'
  | 'OPTIMIZATION'
  | 'SCALING'
