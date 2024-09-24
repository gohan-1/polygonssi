"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const mongodb_1 = require("mongodb");
const app = (0, express_1.default)();
app.set("view engine", "pug");
app.set("views", "./pages");
app.use(
  (0, express_session_1.default)({
    secret: "adcc",
    resave: true,
    saveUninitialized: true,
  }),
);
const uri =
  "mongodb+srv://root:root@cluster0.ufadsm8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const connectToDatabase = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const client = yield mongodb_1.MongoClient.connect(uri);
      return client.db("learning"); // Replace 'yourDatabaseName' with the actual database name
    } catch (error) {
      console.error(error);
      process.exit(1); // Exit process with failure
    }
  });
connectToDatabase().then((db) => {
  app.listen(3000, () => {
    console.log("Server started on port 3000");
  });
  app.get("/", (req, res, next) => {
    res.render("homepage", { message: "please sign in" });
  });
  passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport_1.default.deserializeUser((userID, done) =>
    __awaiter(void 0, void 0, void 0, function* () {
      try {
        const user = yield db
          .collection("users")
          .findOne({ _id: new mongodb_1.ObjectId(userID) });

        done(user);
      } catch (error) {
        done(error, null);
      }
    }),
  );
});
