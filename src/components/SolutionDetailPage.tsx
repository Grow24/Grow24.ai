import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useParams, useLocation } from '@tanstack/react-router'
import { useComingSoon } from '../contexts/ComingSoonContext'
import { use3DRotation } from '../lib/use3DRotation'
import { isValidSolutionId } from '../constants/solutions'

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

// 3D Detail Card Component
const DetailCard3D = ({ 
    children, 
    className,
    ...motionProps 
}: { 
    children: React.ReactNode
    className: string
    initial?: any
    animate?: any
    transition?: any
}) => {
    const { cardRef, rotateX, rotateY, style } = use3DRotation({ 
        intensity: 8, // Subtle rotation for detail cards
        perspective: 1000 
    })

    return (
        <motion.div
            ref={cardRef}
            {...motionProps}
            style={{
                ...style,
                rotateX,
                rotateY,
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
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
    const location = useLocation()
    // Fallback: extract solutionId from pathname if params.solutionId is undefined (e.g. TanStack Router param resolution)
    const solutionId = (params?.solutionId || location.pathname.replace(/^\/solutions\/?/, '').split('/')[0] || '') as string
    const solution = solutionDetails[solutionId || '']
    const { showComingSoon } = useComingSoon()
    const [scrolled, setScrolled] = useState(false)
    const [activeSection, setActiveSection] = useState('overview')
    const [hoveredTab, setHoveredTab] = useState<string | null>(null)

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY
            setScrolled(scrollY > 50)
            
            // Determine active section based on scroll position
            const sections = ['overview', 'capabilities', 'templates', 'testimonials', 'resources', 'implementation', 'corporate-goal']
            const headerOffset = 150 // Account for header + nav bar
            
            for (let i = sections.length - 1; i >= 0; i--) {
                const section = document.getElementById(sections[i])
                if (section) {
                    const sectionTop = section.offsetTop
                    const sectionHeight = section.offsetHeight
                    const scrollPosition = scrollY + headerOffset
                    
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        setActiveSection(sections[i])
                        break
                    }
                }
            }
        }

        // Initial check
        handleScroll()
        
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Double-check: if solution ID is not valid, show not found
    if (!solutionId || !isValidSolutionId(solutionId) || !solution) {
        return (
            <div className="min-h-screen pt-16 sm:pt-20 md:pt-24 pb-10 sm:pb-12 md:pb-16 flex items-center justify-center">
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

    // Helper function to get tab classes based on BCG style
    const getTabClasses = (sectionId: string) => {
        const isActive = activeSection === sectionId
        const isHovered = hoveredTab === sectionId
        
        if (isActive) {
            // Selected: Solid light green background with white text (like BCG's "OVERVIEW")
            return 'px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold text-sm transition-all duration-200 whitespace-nowrap'
        } else if (isHovered) {
            // Hovered: White background with green text and light green border (like BCG's "LATEST THINKING")
            return 'px-4 py-2 rounded-lg bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border-2 border-emerald-500 dark:border-emerald-400 font-medium text-sm transition-all duration-200 whitespace-nowrap'
        } else {
            // Default: White background with dark grey text and light grey border (like BCG's "EXPERTS")
            return 'px-4 py-2 rounded-lg bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 font-medium text-sm transition-all duration-200 whitespace-nowrap hover:border-emerald-400 dark:hover:border-emerald-500'
        }
    }

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'capabilities', label: 'Capabilities' },
        { id: 'templates', label: 'Template & Outputs' },
        { id: 'testimonials', label: 'Testimonials' },
        { id: 'resources', label: 'Resources' },
        { id: 'implementation', label: 'Implementation' },
        { id: 'corporate-goal', label: 'Corporate Goal' }
    ]

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 relative z-0">
            {/* Navigation Bar - Sticky */}
            <div className={`sticky top-[60px] sm:top-[70px] md:top-[80px] z-40 transition-all duration-300 ${
                scrolled 
                    ? 'bg-white/95 dark:bg-slate-900/95 shadow-lg border-b border-gray-200 dark:border-slate-700' 
                    : 'bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-slate-700'
            }`}>
                <div className="max-w-7xl mx-auto px-8 py-3">
                    <nav className="flex items-center gap-2 overflow-x-auto">
                        {tabs.map((tab) => (
                            <a 
                                key={tab.id}
                                href={`#${tab.id}`}
                                onClick={(e) => {
                                    e.preventDefault()
                                    const element = document.getElementById(tab.id)
                                    if (element) {
                                        // Use scrollIntoView with block: 'start' and account for sticky nav height
                                        const headerHeight = 80 // Approximate header height
                                        const navHeight = 60 // Approximate nav bar height
                                        const offset = headerHeight + navHeight
                                        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
                                        const offsetPosition = elementPosition - offset
                                        
                                        window.scrollTo({
                                            top: offsetPosition,
                                            behavior: 'smooth'
                                        })
                                    }
                                }}
                                className={getTabClasses(tab.id)}
                                onMouseEnter={() => setHoveredTab(tab.id)}
                                onMouseLeave={() => setHoveredTab(null)}
                            >
                                {tab.label}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Hero Section */}
            <section id="overview" className="bg-gray-50 dark:bg-slate-900 py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-8 scroll-mt-[120px] sm:scroll-mt-[130px] md:scroll-mt-[140px]">
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
                                    onClick={() => showComingSoon('request-demo', 'Request Demo', 'Enter your details to request a personalized demo for this solution.', { solutionId, solutionTitle: solution?.title })}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-cta-green-500 hover:bg-cta-green-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-md"
                                >
                                    Request Demo
                                </motion.button>
                                <motion.button
                                    onClick={() => showComingSoon('download-guide', 'Download Guide', 'Enter your email to download this guide and access exclusive resources.', { solutionId, solutionTitle: solution?.title })}
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
            <section id="overview" className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 scroll-mt-[120px] sm:scroll-mt-[130px] md:scroll-mt-[140px]">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {solution.overviewCards.map((card, idx) => (
                            <DetailCard3D
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
                            </DetailCard3D>
                        ))}
                    </div>
                </div>
            </section>

            {/* Capabilities Section */}
            <section id="capabilities" className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 bg-white dark:bg-slate-900 scroll-mt-[120px] sm:scroll-mt-[130px] md:scroll-mt-[140px]">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Capabilities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {solution.capabilities.map((cap, idx) => (
                            <DetailCard3D
                                key={cap.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`p-4 rounded-lg ${idx === 0 ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white'
                                    }`}
                            >
                                <div className="font-bold text-sm mb-2">{cap.id}</div>
                                <div className="text-xs">{cap.title}</div>
                            </DetailCard3D>
                        ))}
                    </div>
                </div>
            </section>

            {/* Templates & Outputs Section */}
            <section id="templates" className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 bg-gray-50 scroll-mt-[120px] sm:scroll-mt-[130px] md:scroll-mt-[140px]">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Templates & Outputs</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {solution.templates.map((template) => (
                                <DetailCard3D
                                    key={template.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`${colors.primary} text-white px-3 py-1 rounded font-bold text-sm`}>
                                            {template.id}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">{template.title}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">{template.description}</p>
                                        </div>
                                    </div>
                                </DetailCard3D>
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
                                onClick={() => showComingSoon('source-sheet', 'Access Source Sheet', 'Enter your email to access the source sheet for this solution.', { solutionId, solutionTitle: solution?.title })}
                                className="w-full bg-cta-green-500 hover:bg-cta-green-600 text-white py-2 rounded-lg transition-colors"
                            >
                                Source Sheet
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gray-50 dark:bg-slate-900 py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{solution.ctaMessage}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-8">{solution.ctaSubtext}</p>
                    <div className="flex gap-4 justify-center">
                        <motion.button
                            onClick={() => showComingSoon('cta-request-demo', 'Request Demo', 'Enter your details to request a personalized demo.', { solutionId, solutionTitle: solution?.title })}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-cta-green-500 hover:bg-cta-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Request Demo
                        </motion.button>
                        <motion.button
                            onClick={() => showComingSoon('download-playbook', 'Download Playbook', 'Enter your email to download the playbook for this solution.', { solutionId, solutionTitle: solution?.title })}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-info-gold-50 dark:bg-info-gold-900/20 border-2 border-info-gold-500 dark:border-info-gold-600 text-info-gold-700 dark:text-info-gold-300 px-8 py-3 rounded-lg font-semibold hover:bg-info-gold-100 dark:hover:bg-info-gold-900/30 transition-colors"
                        >
                            Download Playbook
                        </motion.button>
                    </div>
                </div>
            </section>

            {/* Corporate Goal Section */}
            <section id="corporate-goal" className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 bg-white dark:bg-slate-950 scroll-mt-[120px] sm:scroll-mt-[130px] md:scroll-mt-[140px]">
                <div className="max-w-7xl mx-auto">
                    {/* Solution Thumbnail Label */}
                    <div className="text-left mb-8">
                        <span className="text-xs text-gray-400 dark:text-gray-400 uppercase tracking-wider font-normal">SOLUTION THUMBNAIL</span>
                    </div>

                    {/* Title Section */}
                    <div className="text-center mb-20">
                        <h2 className="text-5xl lg:text-6xl font-bold text-blue-600 dark:text-blue-600 mb-4" style={{ color: '#2563eb' }}>Corporate Goal</h2>
                        <p className="text-xl lg:text-2xl text-blue-600 dark:text-blue-600" style={{ color: '#2563eb' }}>Set direction. Detect anomalies. Align the enterprise.</p>
                    </div>

                    {/* Diagram Container */}
                    <div className="flex justify-center items-center my-16 relative min-h-[750px]">
                        <div className="relative w-full max-w-4xl mx-auto" style={{ aspectRatio: '1/1', maxWidth: '800px' }}>
                            {/* External Factors */}
                            {/* Market - Left */}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-28 md:-translate-x-40 flex flex-col items-center z-10">
                                <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 dark:bg-gray-200 rounded-lg flex items-center justify-center mb-3 shadow-md border border-gray-300 dark:border-gray-400 p-3">
                                    <svg className="w-12 h-12 md:w-14 md:h-14 text-gray-800 dark:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <span className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-900">Market</span>
                            </div>

                            {/* Competition - Right */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-28 md:translate-x-40 flex flex-col items-center z-10">
                                <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 dark:bg-gray-200 rounded-lg flex items-center justify-center mb-3 shadow-md border border-gray-300 dark:border-gray-400 p-3">
                                    <svg className="w-12 h-12 md:w-14 md:h-14 text-gray-800 dark:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {/* Globe */}
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        {/* Gear icon inside globe */}
                                        <circle cx="12" cy="12" r="2" fill="currentColor" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v2M12 16v2M6 12h2M16 12h2M8.5 8.5l1.4 1.4M14.1 14.1l1.4 1.4M8.5 15.5l1.4-1.4M14.1 9.9l1.4-1.4" />
                                    </svg>
                                </div>
                                <span className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-900">Competition</span>
                            </div>

                            {/* Regulation - Bottom Right */}
                            <div className="absolute right-16 md:right-20 bottom-0 translate-y-24 md:translate-y-32 flex flex-col items-center z-10">
                                <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 dark:bg-gray-200 rounded-lg flex items-center justify-center mb-3 shadow-md border border-gray-300 dark:border-gray-400 p-3">
                                    <svg className="w-12 h-12 md:w-14 md:h-14 text-gray-800 dark:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {/* Document with gavel */}
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        {/* Gavel handle */}
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8l3-3m0 0l3 3m-3-3v12" />
                                    </svg>
                                </div>
                                <span className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-900">Regulation</span>
                            </div>

                            {/* Circular Lifecycle Diagram */}
                            <div className="relative w-full h-full mx-auto">
                                <svg viewBox="0 0 600 600" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                                    <defs>
                                        {/* Small triangular blue arrows - matching image style */}
                                        <marker id="arrowhead-blue" markerWidth="8" markerHeight="8" refX="7.5" refY="2.5" orient="auto" markerUnits="userSpaceOnUse">
                                            <polygon points="0 0, 8 2.5, 0 5" fill="#2563eb" stroke="none" />
                                        </marker>
                                    </defs>
                                    
                                    {/* Center point */}
                                    <g transform="translate(300, 300)">
                                        {/* Outer radius: 220, Inner radius: 120 */}
                                        {/* 8 segments, each 45 degrees */}
                                        {/* Starting from top (270° = -90° in standard coordinates) */}
                                        
                                        {/* Stage 1: Identify Goals (Top, 270° to 315°) - Blue */}
                                        <path d="M 0 -220 A 220 220 0 0 1 155.56 -155.56 L 86.42 -86.42 A 120 120 0 0 0 0 -120 Z" fill="#2563eb" stroke="white" strokeWidth="2.5" />
                                        <text x="70" y="-170" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" transform="rotate(-67.5 70 -170)">Identify Goals</text>
                                        
                                        {/* Stage 2: Conduct Assessment (315° to 360°/0°) - Green */}
                                        <path d="M 155.56 -155.56 A 220 220 0 0 1 220 0 L 120 0 A 120 120 0 0 0 86.42 -86.42 Z" fill="#10b981" stroke="white" strokeWidth="2.5" />
                                        <text x="190" y="-60" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" transform="rotate(-22.5 190 -60)">Conduct Assessment</text>
                                        
                                        {/* Stage 3: Choose Direction (0° to 45°) - Green */}
                                        <path d="M 220 0 A 220 220 0 0 1 155.56 155.56 L 86.42 86.42 A 120 120 0 0 0 120 0 Z" fill="#10b981" stroke="white" strokeWidth="2.5" />
                                        <text x="190" y="60" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" transform="rotate(22.5 190 60)">Choose Direction</text>
                                        
                                        {/* Stage 4: Define Strategy (45° to 90°) - Green */}
                                        <path d="M 155.56 155.56 A 220 220 0 0 1 0 220 L 0 120 A 120 120 0 0 0 86.42 86.42 Z" fill="#10b981" stroke="white" strokeWidth="2.5" />
                                        <text x="70" y="190" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" transform="rotate(67.5 70 190)">Define Strategy</text>
                                        
                                        {/* Stage 5: Build Plan (90° to 135°) - Green */}
                                        <path d="M 0 220 A 220 220 0 0 1 -155.56 155.56 L -86.42 86.42 A 120 120 0 0 0 0 120 Z" fill="#10b981" stroke="white" strokeWidth="2.5" />
                                        <text x="-70" y="190" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" transform="rotate(112.5 -70 190)">Build Plan</text>
                                        
                                        {/* Stage 6: Execute Projects (135° to 180°) - Blue */}
                                        <path d="M -155.56 155.56 A 220 220 0 0 1 -220 0 L -120 0 A 120 120 0 0 0 -86.42 86.42 Z" fill="#2563eb" stroke="white" strokeWidth="2.5" />
                                        <text x="-190" y="60" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" transform="rotate(157.5 -190 60)">Execute Projects</text>
                                        
                                        {/* Stage 7: Assess Outcome + Calibrate (180° to 225°) - Blue */}
                                        <path d="M -220 0 A 220 220 0 0 1 -155.56 -155.56 L -86.42 -86.42 A 120 120 0 0 0 -120 0 Z" fill="#2563eb" stroke="white" strokeWidth="2.5" />
                                        <text x="-190" y="-60" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" transform="rotate(202.5 -190 -60)">Assess Outcome + Calibrate</text>
                                        
                                        {/* Stage 8: Back to Identify Goals (225° to 270°) - Blue */}
                                        <path d="M -155.56 -155.56 A 220 220 0 0 1 0 -220 L 0 -120 A 120 120 0 0 0 -86.42 -86.42 Z" fill="#2563eb" stroke="white" strokeWidth="2.5" />
                                        
                                        {/* Arrows between segments - all blue, positioned at outer edge */}
                                        <path d="M 155.56 -155.56 A 230 230 0 0 1 230 0" fill="none" stroke="#2563eb" strokeWidth="2.5" markerEnd="url(#arrowhead-blue)" />
                                        <path d="M 230 0 A 230 230 0 0 1 155.56 155.56" fill="none" stroke="#2563eb" strokeWidth="2.5" markerEnd="url(#arrowhead-blue)" />
                                        <path d="M 155.56 155.56 A 230 230 0 0 1 0 230" fill="none" stroke="#2563eb" strokeWidth="2.5" markerEnd="url(#arrowhead-blue)" />
                                        <path d="M 0 230 A 230 230 0 0 1 -155.56 155.56" fill="none" stroke="#2563eb" strokeWidth="2.5" markerEnd="url(#arrowhead-blue)" />
                                        <path d="M -155.56 155.56 A 230 230 0 0 1 -230 0" fill="none" stroke="#2563eb" strokeWidth="2.5" markerEnd="url(#arrowhead-blue)" />
                                        <path d="M -230 0 A 230 230 0 0 1 -155.56 -155.56" fill="none" stroke="#2563eb" strokeWidth="2.5" markerEnd="url(#arrowhead-blue)" />
                                        <path d="M -155.56 -155.56 A 230 230 0 0 1 0 -230" fill="none" stroke="#2563eb" strokeWidth="2.5" markerEnd="url(#arrowhead-blue)" />
                                        
                                        {/* Inner Circle - Corporate */}
                                        <circle cx="0" cy="0" r="120" fill="#2563eb" />
                                        <text x="0" y="10" textAnchor="middle" fill="white" fontSize="26" fontWeight="bold" letterSpacing="0.5">Corporate</text>
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="text-center mt-20 mb-8">
                        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-700 mb-10 leading-relaxed max-w-4xl mx-auto" style={{ color: '#374151' }}>
                            Define corporate goals using evidence, environment awareness, and a closed-loop lifecycle.
                        </p>
                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600 dark:text-blue-600 tracking-tight" style={{ color: '#2563eb' }}>Lifecycle-driven Goal Setting</h3>
                    </div>
                </div>
            </section>
        </div>
    )
}
