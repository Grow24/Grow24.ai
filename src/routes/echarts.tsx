import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'

export const Route = createFileRoute('/echarts')({
  component: EChartsPage,
})

function ChartCard({
  title,
  children,
  className = '',
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-700 bg-slate-900/80 overflow-hidden shadow-xl ${className}`}
    >
      <div className="px-4 py-3 border-b border-slate-700 bg-slate-800/50">
        <h2 className="text-base font-semibold text-slate-100">{title}</h2>
      </div>
      <div className="p-3 flex items-center justify-center min-h-[280px]">{children}</div>
    </div>
  )
}

function useChart(
  option: echarts.EChartsOption | null,
  theme: 'dark' | 'light' = 'dark'
) {
  const chartRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current || !option) return
    const chart = echarts.init(chartRef.current, theme)
    instanceRef.current = chart
    chart.setOption(option)
    const onResize = () => chart.resize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      chart.dispose()
      instanceRef.current = null
    }
  }, [theme])

  useEffect(() => {
    if (instanceRef.current && option) {
      instanceRef.current.setOption(option)
    }
  }, [option])

  return chartRef
}

function LineChart() {
  const option: echarts.EChartsOption = {
    xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], boundaryGap: false },
    yAxis: { type: 'value' },
    series: [
      { name: 'Series A', type: 'line', smooth: true, data: [120, 132, 101, 134, 90, 230, 210] },
      { name: 'Series B', type: 'line', smooth: true, data: [220, 182, 191, 234, 290, 330, 310] },
    ],
    grid: { left: '12%', right: '8%', top: '12%', bottom: '15%' },
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
  }
  const ref = useChart(option)
  return <div ref={ref} className="w-full h-[260px]" />
}

function BarChart() {
  const option: echarts.EChartsOption = {
    xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
    yAxis: { type: 'value' },
    series: [
      { name: 'Sales', type: 'bar', data: [65, 78, 90, 81, 96, 105] },
      { name: 'Target', type: 'bar', data: [60, 72, 85, 80, 90, 100] },
    ],
    grid: { left: '12%', right: '8%', top: '12%', bottom: '15%' },
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
  }
  const ref = useChart(option)
  return <div ref={ref} className="w-full h-[260px]" />
}

function PieChart() {
  const option: echarts.EChartsOption = {
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', right: 10, top: 'center' },
    series: [
      {
        name: 'Share',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        data: [
          { value: 1048, name: 'Search' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union' },
          { value: 300, name: 'Video' },
        ],
        emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } },
      },
    ],
  }
  const ref = useChart(option)
  return <div ref={ref} className="w-full h-[260px]" />
}

function ScatterChart() {
  const option: echarts.EChartsOption = {
    xAxis: { type: 'value', name: 'X' },
    yAxis: { type: 'value', name: 'Y' },
    series: [
      {
        type: 'scatter',
        symbolSize: 12,
        data: [
          [10, 20], [15, 35], [20, 25], [25, 45], [30, 30], [35, 55], [40, 40], [45, 60], [50, 50],
          [55, 70], [60, 55], [70, 65], [75, 80], [80, 72], [90, 85],
        ],
      },
    ],
    grid: { left: '12%', right: '12%', top: '12%', bottom: '15%' },
    tooltip: { trigger: 'item' },
  }
  const ref = useChart(option)
  return <div ref={ref} className="w-full h-[260px]" />
}

function RadarChart() {
  const option: echarts.EChartsOption = {
    radar: {
      indicator: [
        { name: 'Sales', max: 100 },
        { name: 'Admin', max: 100 },
        { name: 'Tech', max: 100 },
        { name: 'Support', max: 100 },
        { name: 'Dev', max: 100 },
      ],
    },
    series: [
      {
        type: 'radar',
        data: [
          { value: [80, 70, 90, 75, 85], name: 'Team A' },
          { value: [60, 82, 70, 90, 65], name: 'Team B' },
        ],
      },
    ],
    legend: { bottom: 0 },
    tooltip: {},
  }
  const ref = useChart(option)
  return <div ref={ref} className="w-full h-[260px]" />
}

function FunnelChart() {
  const option: echarts.EChartsOption = {
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'funnel',
        left: '15%',
        width: '70%',
        minSize: '20%',
        maxSize: '100%',
        sort: 'descending',
        gap: 2,
        label: { show: true, position: 'inside' },
        data: [
          { value: 60, name: 'Visit' },
          { value: 40, name: 'Inquiry' },
          { value: 20, name: 'Order' },
          { value: 10, name: 'Payment' },
        ],
      },
    ],
  }
  const ref = useChart(option)
  return <div ref={ref} className="w-full h-[260px]" />
}

function GaugeChart() {
  const option: echarts.EChartsOption = {
    series: [
      {
        type: 'gauge',
        progress: { show: true, width: 12 },
        axisLine: { lineStyle: { width: 12 } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        anchor: { show: true, size: 20 },
        title: { offsetCenter: [0, '75%'], fontSize: 14 },
        detail: { valueAnimation: true, offsetCenter: [0, '45%'], fontSize: 24, formatter: '{value}%' },
        data: [{ value: 68, name: 'Score' }],
      },
    ],
  }
  const ref = useChart(option)
  return <div ref={ref} className="w-full h-[260px]" />
}

function AnimatedBarTimelineChart() {
  const [monthIndex, setMonthIndex] = useState(0)
  const directionRef = useRef<1 | -1>(1)

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
  const dataset: number[][] = [
    [45, 52, 61, 48, 72],
    [50, 55, 64, 52, 78],
    [58, 60, 70, 59, 82],
    [62, 65, 74, 63, 88],
    [68, 70, 80, 69, 94],
    [72, 76, 85, 74, 99],
    [78, 82, 90, 80, 105],
    [85, 88, 96, 86, 112],
  ]
  const categories = ['Leads', 'Demos', 'Proposals', 'Closures', 'Renewals']

  const currentValues = dataset[monthIndex]

  const option: echarts.EChartsOption = {
    title: {
      text: `Month: ${months[monthIndex]}`,
      textStyle: { color: '#e5e7eb', fontSize: 12 },
      left: 'center',
      top: 8,
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: { color: '#9ca3af' },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#9ca3af' },
      splitLine: { lineStyle: { color: '#1f2937' } },
    },
    series: [
      {
        name: 'Pipeline',
        type: 'bar',
        data: currentValues,
        label: { show: true, position: 'top', color: '#e5e7eb', fontSize: 10 },
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#22c55e' },
            { offset: 0.5, color: '#22c55e' },
            { offset: 1, color: '#0f766e' },
          ]),
          shadowBlur: 18,
          shadowColor: 'rgba(16, 185, 129, 0.6)',
          shadowOffsetY: 4,
        },
        universalTransition: { enabled: true },
        animationDuration: 700,
        animationDurationUpdate: 900,
        animationEasing: 'cubicOut',
        animationEasingUpdate: 'cubicInOut',
        animationDelay: (idx: number) => idx * 80,
        animationDelayUpdate: (idx: number) => idx * 80,
      },
      {
        name: 'Pulse',
        type: 'effectScatter',
        coordinateSystem: 'cartesian2d',
        zlevel: 2,
        symbolSize: 14,
        rippleEffect: {
          brushType: 'stroke',
          scale: 3.8,
          period: 2,
        },
        itemStyle: {
          color: '#22c55e',
          shadowBlur: 18,
          shadowColor: 'rgba(52, 211, 153, 0.9)',
        },
        data: currentValues.map((v, idx) => [categories[idx], v]),
      },
    ],
    grid: { left: '10%', right: '6%', top: 40, bottom: 30 },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const first = Array.isArray(params) ? params[0] : params
        const name = first?.axisValueLabel ?? ''
        const val = first?.data ?? ''
        return `${months[monthIndex]}<br/>${name}: ${val}`
      },
    },
  }

  const ref = useChart(option)

  useEffect(() => {
    const id = window.setInterval(() => {
      setMonthIndex((prev) => {
        const next = prev + directionRef.current
        if (next >= months.length - 1 || next <= 0) {
          directionRef.current = (directionRef.current * -1) as 1 | -1
        }
        return Math.min(Math.max(next, 0), months.length - 1)
      })
    }, 1400)
    return () => window.clearInterval(id)
  }, [months.length])

  return <div ref={ref} className="w-full h-[260px]" />
}

function EChartsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-10 sm:py-12 md:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-50">ECharts</h1>
          <p className="mt-2 text-slate-400">
            Different chart types powered by Apache ECharts.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          <ChartCard title="Line Chart">
            <LineChart />
          </ChartCard>
          <ChartCard title="Bar Chart">
            <BarChart />
          </ChartCard>
          <ChartCard title="Pie Chart">
            <PieChart />
          </ChartCard>
          <ChartCard title="Scatter Chart">
            <ScatterChart />
          </ChartCard>
          <ChartCard title="Radar Chart">
            <RadarChart />
          </ChartCard>
          <ChartCard title="Funnel Chart">
            <FunnelChart />
          </ChartCard>
          <ChartCard title="Gauge Chart" className="lg:col-span-2 xl:col-span-1">
            <GaugeChart />
          </ChartCard>
          <ChartCard title="Animated Bar Timeline" className="lg:col-span-2">
            <AnimatedBarTimelineChart />
          </ChartCard>
        </div>
      </div>
    </main>
  )
}

export default EChartsPage
