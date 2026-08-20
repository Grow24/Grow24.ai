import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '@/api/projects.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export default function ProjectSettingsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.getById(projectId!),
    enabled: !!projectId,
  });

  useEffect(() => {
    if (!project) return;
    setName(project.name || '');
    setClientName(project.clientName || '');
    setDescription(project.description || '');
  }, [project]);

  const updateMutation = useMutation({
    mutationFn: () =>
      projectsApi.update(projectId!, {
        name: name.trim(),
        clientName: clientName.trim(),
        description: description.trim(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Settings saved', description: 'Project details were updated.' });
    },
    onError: (err: { message?: string }) => {
      toast({
        title: 'Could not save',
        description: err.message || 'Failed to update project settings.',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  if (error || !project) {
    return (
      <div className="text-red-600">
        {(error as { message?: string })?.message || 'Project not found'}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Update the project name and client details.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Project details</CardTitle>
          <CardDescription>These values appear on the dashboard and project list.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim()) {
                toast({ title: 'Project name is required', variant: 'destructive' });
                return;
              }
              updateMutation.mutate();
            }}
          >
            <div className="space-y-2">
              <label htmlFor="settings-name" className="text-sm font-medium">
                Project name
              </label>
              <Input id="settings-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label htmlFor="settings-client" className="text-sm font-medium">
                Client name
              </label>
              <Input
                id="settings-client"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="settings-description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="settings-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
