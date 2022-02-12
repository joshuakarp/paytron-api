import app from './app';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.PORT) {
  console.log('No port specified in .env - exiting');
  process.exit(1);
}
const PORT = parseInt(process.env.PORT);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});