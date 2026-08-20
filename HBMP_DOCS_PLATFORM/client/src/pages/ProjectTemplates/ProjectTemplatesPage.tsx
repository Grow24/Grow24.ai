import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { templatesApi } from '@/api/templates.api';
import { projectsApi } from '@/api/projects.api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ProjectTemplatesPage() {
  const { projectId } = useParams<{ projectId: string }>();

  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.getById(projectId!),
    enabled: !!projectId,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['templates'],
    queryFn: () => templatesApi.getAll(),
  });

  const templates = data?.templates ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Templates</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {project ? `Document templates available for ${project.name}` : 'Document templates'}
        </p>
      </div>

      {isLoading && <div>Loading templates...</div>}

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {(error as { message?: string })?.message || 'Failed to load templates. Make sure the Docs API is running.'}
        </div>
      )}

      {!isLoading && !error && templates.length === 0 && (
        <div className="text-muted-foreground">No templates found. Seed the Docs database and retry.</div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <CardDescription>{template.code}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <Badge variant="secondary">Level {template.level}</Badge>
              <Badge variant={template.isActive ? 'success' : 'secondary'}>
                {template.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
