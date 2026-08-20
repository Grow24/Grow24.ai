import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        This Docs Platform URL does not match a known page.
      </p>
      <Link to="/projects" className="mt-6 text-sm font-medium text-blue-700 hover:underline">
        Back to My Projects
      </Link>
    </div>
  );
}
