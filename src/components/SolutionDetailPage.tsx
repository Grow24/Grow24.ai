import React from 'react'
import { motion } from 'framer-motion'
import { Link, useParams } from '@tanstack/react-router'
import { useComingSoon } from '../contexts/ComingSoonContext'

interface SolutionDetail {
    id: string
    title: string
    description: string
    category: 'Goals' | 'Strategy' | 'Plan' | 'Project' | 'Operations'
    heroDescription: string
    overviewCards: {
        icon: JSX.Element
        title: string
        description: string
    }[]
    capabilities: {
        id: string
        title: string
        description: string
    }[]
    templates: {
        id: string
        title: string
        description: string
    }[]
    ctaMessage: string
    ctaSubtext: string
}

// Get color scheme based on category
const getCategoryColors = (category: string) => {
    switch (category) {
        case 'Goals':
        case 'Strategy':
            return {
                primary: 'bg-blue-500',
                primaryHover: 'bg-blue-600',
                primaryText: 'text-blue-600',
                primaryBorder: 'border-blue-500',
                headerBg: 'bg-blue-50',
                accent: 'blue'
            }
        case 'Plan':
        case 'Project':
            return {
                primary: 'bg-orange-500',
                primaryHover: 'bg-orange-600',
                primaryText: 'text-orange-600',
                primaryBorder: 'border-orange-500',
                headerBg: 'bg-orange-50',
                accent: 'orange'
            }
        case 'Operations':
            return {
                primary: 'bg-purple-500',
                primaryHover: 'bg-purple-600',
                primaryText: 'text-purple-600',
                primaryBorder: 'border-purple-500',
                headerBg: 'bg-purple-50',
                accent: 'purple'
            }
        default:
            return {
                primary: 'bg-emerald-500',
                primaryHover: 'bg-emerald-600',
                primaryText: 'text-emerald-600',
                primaryBorder: 'border-emerald-500',
                headerBg: 'bg-emerald-50',
                accent: 'emerald'
            }
    }
}

// Mock data - in production, this would come from an API or database
const solutionDetails: Record<string, SolutionDetail> = {
    'corp-strat-1': {
        id: 'corp-strat-1',
        title: 'Strategy Generation',
        description: 'Formulate where-to-play and how-to-win strategies.',
        category: 'Strategy',
        heroDescription: 'Generate where-to-play and how-to-win strategies aligned to goals and constraints.',
        overviewCards: [
            {
                icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                ),
                title: 'Analyze External Opportunities',
                description: 'Identify market trends, competitive landscape, and growth opportunities.'
            },
            {
                icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                ),
                title: 'Generate Strategy Options',
                description: 'Create actionable strategy options using SWOT, BCG, IE, and QSPM frameworks.'
            },
            {
                icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                ),
                title: 'Score and Select Strategy',
                description: 'Evaluate and select the right strategy mix versus competitors.'
            },
            {
                icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                ),
                title: 'Create Initiative Portfolio',
                description: 'Build a portfolio of initiatives per chosen strategy.'
            }
        ],
        capabilities: [
            { id: 'CT-01', title: 'SWOT Analysis Framework', description: 'Comprehensive strength, weakness, opportunity, and threat analysis.' },
            { id: 'CT-02', title: 'BCG Matrix Builder', description: 'Build and analyze your business portfolio using BCG matrix.' },
            { id: 'CT-03', title: 'IE Matrix Generator', description: 'Internal-External matrix for strategic positioning.' },
            { id: 'CT-04', title: 'QSPM Scoring', description: 'Quantitative Strategic Planning Matrix for decision making.' }
        ],
        templates: [
            { id: 'ST-01', title: 'Strategy Document Template', description: 'Comprehensive strategy documentation template.' },
            { id: 'ST-02', title: 'Strategic Roadmap', description: 'Visual roadmap for strategy implementation.' },
            { id: 'ST-03', title: 'Initiative Portfolio', description: 'Template for managing strategic initiatives.' }
        ],
        ctaMessage: 'Make strategic decisions measurable, repeatable and governed.',
        ctaSubtext: 'Transform your strategy formulation process with data-driven insights.'
    },
    'corp-goal-1': {
        id: 'corp-goal-1',
        title: 'Strategy Goalsetting',
        description: 'Define measurable objectives for sustained growth.',
        category: 'Goals',
        heroDescription: 'Set clear, measurable objectives aligned with your strategic vision and organizational goals.',
        overviewCards: [
            {
                icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                ),
                title: 'Measurable Objectives',
                description: 'Define clear, quantifiable goals with specific metrics and targets.'
            },
            {
                icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                ),
                title: 'Growth Targets',
                description: 'Set ambitious yet achievable growth targets across all business areas.'
            },
            {
                icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                ),
                title: 'Strategic Alignment',
                description: 'Ensure all goals align with your overall strategic vision and mission.'
            },
            {
                icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                ),
                title: 'Timeline Management',
                description: 'Set realistic timelines and milestones for goal achievement.'
            }
        ],
        capabilities: [
            { id: 'CT-01', title: 'OKR Framework', description: 'Objectives and Key Results methodology.' },
            { id: 'CT-02', title: 'SMART Goals Builder', description: 'Create Specific, Measurable, Achievable, Relevant, Time-bound goals.' },
            { id: 'CT-03', title: 'Goal Cascade', description: 'Cascade goals from organizational to team to individual levels.' }
        ],
        templates: [
            { id: 'ST-01', title: 'Goal Setting Template', description: 'Structured template for defining goals.' },
            { id: 'ST-02', title: 'Progress Tracking Dashboard', description: 'Monitor goal progress in real-time.' }
        ],
        ctaMessage: 'Transform goal setting into measurable, actionable outcomes.',
        ctaSubtext: 'Start achieving your strategic objectives with structured goal setting.'
    },
    'corp-plan-1': {
        id: 'corp-plan-1',
        title: 'Multi-Horizon Planning',
        description: 'Build stepwise plans, week + quarter - year.',
        category: 'Plan',
        heroDescription: 'Create comprehensive planning frameworks that span multiple time horizons for strategic execution.',
        overviewCards: [
            {
                icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                ),
                title: 'Weekly Planning',
                description: 'Break down quarterly goals into actionable weekly milestones.'
            },
            {
                icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                ),
                title: 'Quarterly Planning',
                description: 'Align quarterly objectives with annual strategic goals.'
            },
            {
                icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                ),
                title: 'Annual Planning',
                description: 'Set long-term vision and strategic direction for the year.'
            },
            {
                icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                ),
                title: 'Horizon Alignment',
                description: 'Ensure seamless alignment across all planning horizons.'
            }
        ],
        capabilities: [
            { id: 'CT-01', title: 'Planning Framework', description: 'Structured approach to multi-horizon planning.' },
            { id: 'CT-02', title: 'Timeline Management', description: 'Coordinate plans across different timeframes.' },
            { id: 'CT-03', title: 'Resource Allocation', description: 'Optimize resource distribution across horizons.' }
        ],
        templates: [
            { id: 'ST-01', title: 'Weekly Plan Template', description: 'Template for weekly planning and execution.' },
            { id: 'ST-02', title: 'Quarterly Roadmap', description: 'Quarterly planning and milestone tracking.' }
        ],
        ctaMessage: 'Transform planning into actionable, multi-horizon execution.',
        ctaSubtext: 'Build comprehensive plans that drive strategic success.'
    },
    'corp-ops-1': {
        id: 'corp-ops-1',
        title: 'KPI Monitoring',
        description: 'Monitor results against KPIs, targets, and activities.',
        category: 'Operations',
        heroDescription: 'Track and monitor key performance indicators in real-time to drive data-driven decision making.',
        overviewCards: [
            {
                icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                ),
                title: 'Real-time Dashboards',
                description: 'Monitor KPIs with live, interactive dashboards.'
            },
            {
                icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                ),
                title: 'KPI Tracking',
                description: 'Track performance metrics against targets and benchmarks.'
            },
            {
                icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                ),
                title: 'Performance Metrics',
                description: 'Comprehensive performance measurement and analysis.'
            },
            {
                icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                ),
                title: 'Automated Alerts',
                description: 'Get notified when KPIs deviate from targets.'
            }
        ],
        capabilities: [
            { id: 'CT-01', title: 'Dashboard Builder', description: 'Create custom KPI dashboards.' },
            { id: 'CT-02', title: 'Alert System', description: 'Automated alerts for KPI deviations.' },
            { id: 'CT-03', title: 'Reporting Engine', description: 'Generate comprehensive KPI reports.' }
        ],
        templates: [
            { id: 'ST-01', title: 'KPI Dashboard Template', description: 'Pre-built dashboard templates.' },
            { id: 'ST-02', title: 'Performance Report', description: 'Standardized performance reporting.' }
        ],
        ctaMessage: 'Make performance monitoring measurable, repeatable and governed.',
        ctaSubtext: 'Transform KPI tracking into actionable insights.'
    },
    'sales-goal-1': {
        id: 'sales-goal-1',
        title: 'Sales Goalsetting',
        description: 'Align qualities, targets, and tenures for sales productivity.',
        category: 'Goals',
        heroDescription: 'Set clear sales targets and align your team around measurable objectives for sustained revenue growth.',
        overviewCards: [
            {
                icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                ),
                title: 'Sales Targets',
                description: 'Define clear revenue targets and quota assignments for your sales team.'
            },
            {
                icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                ),
                title: 'Quota Setting',
                description: 'Set realistic and achievable quotas based on historical performance and market conditions.'
            },
            {
                icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                ),
                title: 'Performance Alignment',
                description: 'Align individual and team goals with organizational revenue objectives.'
            },
            {
                icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                ),
                title: 'Team Coordination',
                description: 'Coordinate goals across sales teams and territories for optimal coverage.'
            }
        ],
        capabilities: [
            { id: 'CT-01', title: 'Quota Management', description: 'Set and manage sales quotas effectively.' },
            { id: 'CT-02', title: 'Target Allocation', description: 'Distribute targets across teams and individuals.' },
            { id: 'CT-03', title: 'Performance Tracking', description: 'Monitor progress against sales goals.' }
        ],
        templates: [
            { id: 'ST-01', title: 'Sales Goal Template', description: 'Template for setting sales objectives.' },
            { id: 'ST-02', title: 'Quota Planning Sheet', description: 'Plan and allocate quotas effectively.' }
        ],
        ctaMessage: 'Transform sales goal setting into predictable revenue outcomes.',
        ctaSubtext: 'Align your sales team around clear, achievable targets.'
    },
    'sales-strat-1': {
        id: 'sales-strat-1',
        title: 'GTM Strategy',
        description: 'Define your go-to-market strategy with actionable tactics.',
        category: 'Strategy',
        heroDescription: 'Develop a comprehensive go-to-market strategy that drives customer acquisition and revenue growth.',
        overviewCards: [
            {
                icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                ),
                title: 'Market Entry',
                description: 'Identify and enter new markets with strategic planning.'
            },
            {
                icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                ),
                title: 'Channel Strategy',
                description: 'Define optimal sales channels and distribution methods.'
            },
            {
                icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                ),
                title: 'Pricing Strategy',
                description: 'Develop competitive pricing models that maximize revenue.'
            },
            {
                icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                ),
                title: 'Competitive Positioning',
                description: 'Position your offering against competitors effectively.'
            }
        ],
        capabilities: [
            { id: 'CT-01', title: 'Market Analysis', description: 'Analyze target markets and opportunities.' },
            { id: 'CT-02', title: 'Channel Planning', description: 'Plan optimal sales channels.' },
            { id: 'CT-03', title: 'Pricing Models', description: 'Develop effective pricing strategies.' }
        ],
        templates: [
            { id: 'ST-01', title: 'GTM Strategy Document', description: 'Comprehensive go-to-market strategy template.' },
            { id: 'ST-02', title: 'Channel Plan', description: 'Sales channel planning template.' }
        ],
        ctaMessage: 'Transform go-to-market strategy into measurable revenue growth.',
        ctaSubtext: 'Execute your GTM strategy with data-driven insights.'
    },
    'mkt-goal-1': {
        id: 'mkt-goal-1',
        title: 'Marketing Goalsetting',
        description: 'Translate growth targets and inspirational objectives sales.',
        category: 'Goals',
        heroDescription: 'Set clear marketing objectives that align with business growth targets and drive measurable results.',
        overviewCards: [
            {
                icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                ),
                title: 'Growth Targets',
                description: 'Define ambitious yet achievable growth targets for marketing initiatives.'
            },
            {
                icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                ),
                title: 'Campaign Objectives',
                description: 'Set clear objectives for each marketing campaign and initiative.'
            },
            {
                icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                ),
                title: 'ROI Goals',
                description: 'Establish ROI targets and return on marketing investment goals.'
            },
            {
                icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                ),
                title: 'Brand Objectives',
                description: 'Set goals for brand awareness, recognition, and positioning.'
            }
        ],
        capabilities: [
            { id: 'CT-01', title: 'Goal Framework', description: 'Structured approach to marketing goal setting.' },
            { id: 'CT-02', title: 'ROI Tracking', description: 'Track return on marketing investment.' },
            { id: 'CT-03', title: 'Campaign Planning', description: 'Plan campaigns aligned with goals.' }
        ],
        templates: [
            { id: 'ST-01', title: 'Marketing Goals Template', description: 'Template for setting marketing objectives.' },
            { id: 'ST-02', title: 'ROI Dashboard', description: 'Track marketing ROI and performance.' }
        ],
        ctaMessage: 'Transform marketing goals into measurable business impact.',
        ctaSubtext: 'Set and achieve marketing objectives that drive growth.'
    },
    'mkt-strat-1': {
        id: 'mkt-strat-1',
        title: 'GTM Strategy',
        description: 'Craft growth-oriented strategy to ignite growth.',
        category: 'Strategy',
        heroDescription: 'Develop marketing strategies that drive customer acquisition, engagement, and revenue growth.',
        overviewCards: [
            {
                icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                ),
                title: 'Market Strategy',
                description: 'Develop comprehensive market entry and expansion strategies.'
            },
            {
                icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                ),
                title: 'Brand Positioning',
                description: 'Position your brand effectively in the competitive landscape.'
            },
            {
                icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                ),
                title: 'Growth Tactics',
                description: 'Implement proven tactics to accelerate marketing growth.'
            },
            {
                icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                ),
                title: 'Customer Acquisition',
                description: 'Develop strategies to acquire and retain customers effectively.'
            }
        ],
        capabilities: [
            { id: 'CT-01', title: 'Strategy Development', description: 'Comprehensive marketing strategy planning.' },
            { id: 'CT-02', title: 'Brand Strategy', description: 'Develop and execute brand positioning.' },
            { id: 'CT-03', title: 'Growth Planning', description: 'Plan marketing initiatives for growth.' }
        ],
        templates: [
            { id: 'ST-01', title: 'Marketing Strategy Doc', description: 'Template for marketing strategy documentation.' },
            { id: 'ST-02', title: 'Brand Positioning Guide', description: 'Guide for brand positioning strategy.' }
        ],
        ctaMessage: 'Transform marketing strategy into measurable growth outcomes.',
        ctaSubtext: 'Execute marketing strategies that drive business results.'
    }
    // Add more solution details as needed - you can expand this with all solutions
}

export default function SolutionDetailPage() {
    const params = useParams({ strict: false })
    const solutionId = params.solutionId as string
    const solution = solutionDetails[solutionId || '']
    const { showComingSoon } = useComingSoon()

    console.log('SolutionDetailPage rendered with solutionId:', solutionId)
    console.log('All params:', params)
    console.log('Found solution:', solution)

    if (!solution) {
        return (
            <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Solution Not Found</h1>
                    <p className="text-gray-600 mb-4">Solution ID: {solutionId}</p>
                    <Link to="/solutions" className="text-emerald-600 hover:underline">
                        Back to Solutions
                    </Link>
                </div>
            </div>
        )
    }

    const colors = getCategoryColors(solution.category)

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 relative z-50">
            {/* Navigation Bar */}
            <div className="bg-slate-800 dark:bg-slate-900 text-white shadow-sm border-b border-slate-700">
                <div className="max-w-7xl mx-auto px-8 py-3">
                    <nav className="flex items-center gap-8 overflow-x-auto">
                        <a href="#overview" className="font-medium text-white hover:text-white/80 text-sm transition-colors whitespace-nowrap">Overview</a>
                        <a href="#capabilities" className="text-white/90 hover:text-white text-sm transition-colors whitespace-nowrap">Capabilities</a>
                        <a href="#templates" className="text-white/90 hover:text-white text-sm transition-colors whitespace-nowrap">Template & Outputs</a>
                        <a href="#testimonials" className="text-white/90 hover:text-white text-sm transition-colors whitespace-nowrap">Testimonials</a>
                        <a href="#resources" className="text-white/90 hover:text-white text-sm transition-colors whitespace-nowrap">Resources</a>
                        <a href="#implementation" className="text-white/90 hover:text-white text-sm transition-colors whitespace-nowrap">Implementation</a>
                    </nav>
                </div>
            </div>

            {/* Hero Section */}
            <section id="overview" className="bg-gray-50 dark:bg-slate-900 py-12 px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4"
                            >
                                {solution.title}
                            </motion.h1>
                            <p className="text-lg lg:text-xl text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                                {solution.heroDescription}
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <motion.button
                                    onClick={() => showComingSoon('request-demo', 'Request Demo', 'Enter your details to request a personalized demo for this solution.')}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-cta-green-500 hover:bg-cta-green-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-md"
                                >
                                    Request Demo
                                </motion.button>
                                <motion.button
                                    onClick={() => showComingSoon('download-guide', 'Download Guide', 'Enter your email to download this guide and access exclusive resources.')}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-info-gold-50 dark:bg-info-gold-900/20 border-2 border-info-gold-500 dark:border-info-gold-600 text-info-gold-700 dark:text-info-gold-300 px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-info-gold-100 dark:hover:bg-info-gold-900/30 transition-colors shadow-sm"
                                >
                                    Download Guide
                                </motion.button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-5 border border-gray-200 dark:border-gray-700">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm">Solution Details</h3>
                                <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                                    {solution.overviewCards.slice(0, 3).map((card, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                                            <span className="leading-relaxed">{card.title}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-5 border border-gray-200 dark:border-gray-700">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm">Core Features</h3>
                                <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                                    {solution.capabilities.slice(0, 3).map((cap, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                                            <span className="leading-relaxed">{cap.title}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Overview Section */}
            <section id="overview" className="py-16 px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {solution.overviewCards.map((card, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                            >
                                <div className="text-gray-700 dark:text-gray-300 mb-4">
                                    {card.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{card.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300">{card.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Capabilities Section */}
            <section id="capabilities" className="py-16 px-8 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Capabilities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {solution.capabilities.map((cap, idx) => (
                            <motion.div
                                key={cap.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`p-4 rounded-lg ${idx === 0 ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white'
                                    }`}
                            >
                                <div className="font-bold text-sm mb-2">{cap.id}</div>
                                <div className="text-xs">{cap.title}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Templates & Outputs Section */}
            <section id="templates" className="py-16 px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Templates & Outputs</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {solution.templates.map((template) => (
                                <div key={template.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                                    <div className="flex items-start gap-4">
                                        <div className={`${colors.primary} text-white px-3 py-1 rounded font-bold text-sm`}>
                                            {template.id}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">{template.title}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">{template.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                            <div className="text-center mb-4">
                                <div className={`${colors.primary} text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold`}>
                                    0%
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Solution Summary</h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">
                                {solution.description}
                            </p>
                            <button
                                onClick={() => showComingSoon('source-sheet', 'Access Source Sheet', 'Enter your email to access the source sheet for this solution.')}
                                className="w-full bg-cta-green-500 hover:bg-cta-green-600 text-white py-2 rounded-lg transition-colors"
                            >
                                Source Sheet
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gray-50 dark:bg-slate-900 py-16 px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{solution.ctaMessage}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-8">{solution.ctaSubtext}</p>
                    <div className="flex gap-4 justify-center">
                        <motion.button
                            onClick={() => showComingSoon('cta-request-demo', 'Request Demo', 'Enter your details to request a personalized demo.')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-cta-green-500 hover:bg-cta-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Request Demo
                        </motion.button>
                        <motion.button
                            onClick={() => showComingSoon('download-playbook', 'Download Playbook', 'Enter your email to download the playbook for this solution.')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-info-gold-50 dark:bg-info-gold-900/20 border-2 border-info-gold-500 dark:border-info-gold-600 text-info-gold-700 dark:text-info-gold-300 px-8 py-3 rounded-lg font-semibold hover:bg-info-gold-100 dark:hover:bg-info-gold-900/30 transition-colors"
                        >
                            Download Playbook
                        </motion.button>
                    </div>
                </div>
            </section>
        </div>
    )
}
