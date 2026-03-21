import 'dotenv/config';
import app from './app';
import { config } from './config/env';

const PORT = config.port;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API available at http://localhost:${PORT}/api`);
  console.log(`🌐 Accessible externally at http://0.0.0.0:${PORT}`);
});

