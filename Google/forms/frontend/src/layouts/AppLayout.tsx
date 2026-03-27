import { Routes, Route } from 'react-router-dom';
import Forms from '../pages/Forms';

export default function AppLayout() {
  return (
    <div className="h-screen w-full">
      <Routes>
        <Route path="/" element={<Forms />} />
        <Route path="/tools/forms" element={<Forms />} />
      </Routes>
    </div>
  );
}
