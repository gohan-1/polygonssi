import express, { Request, Response, NextFunction, Application } from 'express';
import session from 'express-session';
import passport, { use } from 'passport';
import { MongoClient, ObjectId, Db } from 'mongodb';
import pug from 'pug';

const app: Application = express();

app.set('view engine', 'pug');
app.set('views', './pages');
app.use(session({
  secret: "adcc",
  resave: true,
  saveUninitialized: true
}));

declare global {
  namespace Express {
    interface User {
      _id: string;
    }
  }
}

const uri = 'mongodb+srv://root:root@cluster0.ufadsm8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const connectToDatabase = async () => {
  try {
    const client = await MongoClient.connect(uri);
    return client.db('learning'); // Replace 'yourDatabaseName' with the actual database name
  } catch (error) {
    console.error(error);
    process.exit(1); // Exit process with failure
  }
};

connectToDatabase().then((db: Db) => {
  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });

  app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.render('homepage', { message: 'please sign in' });
  });

  passport.serializeUser((user: Express.User, done: (err: any, id?: string) => void) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (userID: string, done: (err: any, user?: Express.User | false | null) => void) => {
    try {
      const user = await db.collection('users').findOne({ _id: new ObjectId(userID) });
      console.log('hii')
      console.log(user)
      done( user);
    } catch (error) {
      done(error, null);
    }
  });
});
