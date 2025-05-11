import mongoose from 'mongoose';

const dbConnection = async () => {
    try 
    {
        console.log(`Connecting to MongoDB at: ${process.env.MONGO_URI}`);
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } 
    catch (error) 
    {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
};

export  {dbConnection}; 
