'use client'

import { useState } from 'react'
import { Plus, Search, Filter, MoreVertical } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Project {
  id: string
  name: string
  description: string
  diagramCount: number
  lastModified: string
  type: 'process' | 'data' | 'dashboard' | 'architecture'
}

// Mock data - will be replaced with API calls
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Customer Onboarding Process',
    description: 'BPMN model for new customer registration and KYC',
    diagramCount: 3,
    lastModified: '2024-01-15',
    type: 'process'
  },
  {
    id: '2',
    name: 'Data Pipeline Architecture',
    description: 'ETL processes for customer data integration',
    diagramCount: 5,
    lastModified: '2024-01-14',
    type: 'data'
  },
  {
    id: '3',
    name: 'Executive Dashboard',
    description: 'KPI visualization and drill-down structure',
    diagramCount: 2,
    lastModified: '2024-01-13',
    type: 'dashboard'
  }
]

const getTypeColor = (type: Project['type']) => {
  switch (type) {
    case 'process': return 'bg-blue-100 text-blue-800'
    case 'data': return 'bg-green-100 text-green-800'
    case 'dashboard': return 'bg-purple-100 text-purple-800'
    case 'architecture': return 'bg-orange-100 text-orange-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || project.type === selectedType
    return matchesSearch && matchesType
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Projects</h1>
          <Link href="/projects/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </Link>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedType('all')}>
                All Types
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSelectedType('process')}>
                Process Models
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedType('data')}>
                Data Lineage
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedType('dashboard')}>
                Dashboards
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedType('architecture')}>
                Architecture
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">
                    <Link 
                      href={`/projects/${project.id}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {project.name}
                    </Link>
                  </CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className={getTypeColor(project.type)}>
                      {project.type}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {project.diagramCount} diagram{project.diagramCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Link href={`/projects/${project.id}/edit`}>
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500">
                Last modified: {new Date(project.lastModified).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No projects found</p>
          <Link href="/projects/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create your first project
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}