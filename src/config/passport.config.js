import passport from "passport";
import passportLocal from "passport-local";
import UserManager from "../dao/mongoManager/userManagerMongo.js";
import { createHash, isValidPassword } from "../utils.js";

const UM = new UserManager();

//ESTRATEGIA
const localStrategy = passportLocal.Strategy;

const initializedPassport = () => {
  //LOGIN
  passport.use(
    "login",
    new localStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          const user = await UM.login(username);
          console.log("Usuario encontrado para login:");
          console.log(user);
          if (!user) {
            console.warn("User doesn't exists with username: " + username);
            return done(null, false);
          }
          // Validacion de el password
          if (!isValidPassword(user, password)) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //REGISTER
  passport.use(
    "register",
    new localStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          const exist = await UM.leerUsuarios(email);

          if (exist) {
            return res
              .status(400)
              .send({ status: "error", message: "Usuario ya registrado" });
          }
          const user = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };
          const result = await UM.crearUsuario(user);
          console.log(result);

          return done(null, result);
        } catch (error) {
          return done("Error registrando al usuario" + error);
        }
      }
    )
  );
  //serializacion
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await userModel.findById(id);
      done(null, user);
    } catch (error) {
      console.error("Error deserializando el usuario: " + error);
    }
  });
};

export default initializedPassport;
