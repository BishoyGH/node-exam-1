import mongoose from 'mongoose';
export default function dbConnection() {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
      console.log('Connected to database 🎉');
    })
    .catch((err) => {
      console.log('Database Connection Error 💥: ', err);
    });
}
