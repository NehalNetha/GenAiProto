
import mongoose from "mongoose"

const MONGODB_URI = 'mongodb+srv://nihalnetha249:G3xPluCK3hJnlF0m@cluster0.h1rxl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB