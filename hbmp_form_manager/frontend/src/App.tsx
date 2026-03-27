import { useState } from 'react';
import { AdminPanel } from './components/AdminPanel';
import { TestDashboard } from './components/TestDashboard';

function App() {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);

  if (selectedTest) {
    return <AdminPanel testName={selectedTest} onBack={() => setSelectedTest(null)} />;
  }

  return <TestDashboard onSelectTest={setSelectedTest} />;
}

export default App;


