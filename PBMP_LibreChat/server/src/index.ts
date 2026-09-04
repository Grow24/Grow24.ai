import 'dotenv/config';
import app from './app';

const PORT = Number(process.env.PORT || 5201);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`PBMP_LibreChat API on http://localhost:${PORT}`);
});
