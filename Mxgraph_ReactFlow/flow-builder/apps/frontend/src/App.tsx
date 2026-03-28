import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import FlowBuilder from './pages/FlowBuilder';
import SimpleFlowBuilder from './pages/SimpleFlowBuilder';
import WorkingFlowBuilder from './pages/WorkingFlowBuilder';
import WhiteboardPage from './pages/WhiteboardPage';
import WhiteboardListPage from './pages/WhiteboardListPage';
import { CollaborationDemo } from './pages/CollaborationDemo';
import Navigation from './components/Navigation';

export default function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/flows/:flowId" element={<FlowBuilder />} />
        <Route path="/simple" element={<SimpleFlowBuilder />} />
        <Route path="/working" element={<WorkingFlowBuilder />} />
        <Route path="/builder" element={<FlowBuilder />} />
        <Route path="/whiteboards" element={<WhiteboardListPage />} />
        <Route path="/whiteboard/:id" element={<WhiteboardPage />} />
        <Route path="/collaboration" element={<CollaborationDemo />} />
        <Route path="*" element={<Navigate to="/builder" />} />
      </Routes>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'white',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }
        }}
      />
    </>
  );
}
