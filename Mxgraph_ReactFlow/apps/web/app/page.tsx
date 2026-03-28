import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Workflow, Database, BarChart3, Layers } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">HBMP Modeling Platform</h1>
        <p className="text-xl text-gray-600 mb-8">
          React Flow editor with mxGraph engine for business process modeling
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/prototype">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              🚀 Live Prototype
            </Button>
          </Link>
          <Link href="/projects">
            <Button variant="outline" size="lg">
              Get Started
            </Button>
          </Link>
          <Link href="/demo">
            <Button variant="outline" size="lg">
              View Demo
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5" />
              Process Modeling
            </CardTitle>
            <CardDescription>
              Create BPMN-style process flows with swimlanes and auto-layouts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Drag-and-drop editor with validation rules and export capabilities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Lineage
            </CardTitle>
            <CardDescription>
              Map data flows from sources to destinations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Track data transformations and dependencies across systems
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Dashboard Design
            </CardTitle>
            <CardDescription>
              Design dashboard layouts and widget compositions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Auto-arrange widgets and define drill-down relationships
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Architecture Maps
            </CardTitle>
            <CardDescription>
              Model system architectures with API contracts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Define services, APIs, and their connections with validation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5" />
              Flow Builder
            </CardTitle>
            <CardDescription>
              Salesforce-style workflow builder with execution engine
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Build executable flows with decision logic and real-time validation
            </p>
            <a href="http://localhost:5173" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block">
              <Button size="sm">Open Flow Builder</Button>
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Testing Tools Section */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 text-purple-800">🧪 Testing & Development Tools</h2>
        <p className="text-gray-700 mb-4">
          Test the core conversion engine and validate data flow between React Flow and mxGraph
        </p>
        <div className="grid md:grid-cols-3 gap-4 justify-center">
          <Link href="/test-conversion">
            <Button variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-100">
              🔄 RF → MX Conversion Test
            </Button>
          </Link>
          <Link href="/test-bidirectional">
            <Button variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-100">
              ↔️ Bidirectional Conversion Test
            </Button>
          </Link>
          <Link href="/xml-editor">
            <Button variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-100">
              📝 mxGraph XML Editor
            </Button>
          </Link>
        </div>
        <p className="text-xs text-gray-600 mt-3">
          Advanced XML editor with swimlanes, constraints, auto-sizing, and validation rules
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-8 text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">🚀 Live Prototype Ready</h2>
        <p className="text-lg text-gray-700 mb-6">
          Interactive React Flow editor with working drag-and-drop, validation, and export features
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-2 text-green-700">✅ Working Features</h3>
            <p className="text-sm text-gray-600">
              Drag-drop nodes, real-time validation, property editing, auto-layout
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-blue-700">🎨 Professional UI</h3>
            <p className="text-sm text-gray-600">
              Modern interface with React Flow canvas, minimap, and controls
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-purple-700">🔧 Demo Ready</h3>
            <p className="text-sm text-gray-600">
              Sample business process, interactive elements, export simulation
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Technical Architecture</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-2">Frontend Stack</h3>
            <p className="text-sm text-gray-600">
              React Flow, Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Backend Integration</h3>
            <p className="text-sm text-gray-600">
              mxGraph engine, Node.js/Express, Prisma ORM, MySQL database
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Key Capabilities</h3>
            <p className="text-sm text-gray-600">
              Validation engine, auto-layouts, SVG/PNG export, audit trails
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}