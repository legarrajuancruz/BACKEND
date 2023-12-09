import passport from "passport";
import passportLocal from "passport-local";
//import userModel from "../services/dao/models/user.model.js";
import GitHubStrategy from "passport-github2";
import { createHash, isValidPassword } from "../utils.js";
import jwtStrategy from "passport-jwt";
import { PRIVATE_KEY } from "../utils.js";
import UserService from "../services/dao/mongoManager/userManagerMongo.js";
import { cartService } from "../services/factory.js";

const US = new UserService();

//ESTRATEGIA
const localStrategy = passportLocal.Strategy;

const JwtStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;

const initializedPassport = () => {
  /*==================================
  |          PASSPORT JWT            |
  ==================================*/

  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY,
      },
      async (jwt_payload, done) => {
        console.log("Entrando a passport Strategy con JWT");
        try {
          console.log(jwt_payload);
          return done(null, jwt_payload.user);
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );

  /*==================================
  |        GITHUB STRATEGY           |
  ==================================*/

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.f8057949f24966a3",
        clientSecret: "8b7427ad9b19a1b7c34876c57e24053ece3e9328",
        callbackUrl: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("Profile del usuario");
        console.log(profile);

        try {
          const user = await US.leerUsuarios({ email: profile._json.email });
          console.log("Usuario encontrado para login");
          console.log({ user });

          if (!user) {
            console.warn(
              "El suaurio no existe en la base de datos " + profile._json.email
            );
            let newUser = {
              first_name: profile._json.name,
              last_name: ``,
              age: ``,
              email: profile._json.email,
              password: ``,
              loggedBy: "Github",
              role: "user",
            };
            const result = await US.crearUsuario(newUser);
            done(null, result);
          } else {
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  /*===================================
  |        LOCAL STRATEGY             |
  ===================================*/
  //LOGIN
  passport.use(
    "login",
    new localStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          const user = await US.login(username);

          if (!user) {
            console.warn("Usuario no encontrado con ese nombre: " + username);
            return done(null, false);
          }
          // Validacion de el password
          if (!isValidPassword(user, password)) {
            return done(null, false);
          }
          user.last_connection = Date.now();
          user.save();

          console.log("Usuario encontrado para login:");
          console.log(user);

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
          const exist = await US.login(email);

          if (exist) {
            return done(null, false, {
              status: "400",
              message: "Usuario ya registrado",
            });
          }

          const usuarioNuevo = {
            first_name,
            last_name,
            email,
            age,
            password,
          };

          if (usuarioNuevo.password === "adminCod3r123") {
            usuarioNuevo.password = createHash(password);

            const result = await US.crearUsuario(usuarioNuevo);
            return done(null, result);
          }
          if (usuarioNuevo.password === "premium") {
            usuarioNuevo.password = createHash(password);

            const result = await US.crearUsuario(usuarioNuevo);
            return done(null, result);
          }
          usuarioNuevo.password = createHash(password);
          const result = await US.crearUsuario(usuarioNuevo);

          return done(null, result);
        } catch (error) {
          return;
          done("Error registrando al usuario" + error);
        }
      }
    )
  );

  /*=====================================
  |    Serializacion y Dessealizacion    |
  ======================================*/

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await US.login(id);
      done(null, user);
    } catch (error) {
      console.error("Error deserializando el usuario: " + error);
    }
  });
};

/*======================
  |    cookieExtractor    |
  =======================*/

const cookieExtractor = (req) => {
  let token = null;
  console.log("Entrando a Cookie Extractor");
  if (req && req.cookies) {
    console.log("Cookies presentes: ");
    console.log(req.cookies);
    token = req.cookies["jwtCookieToken"];
    console.log("Token obtenido desde Cookie:");
    console.log(token);
  }
  return token;
};

export default initializedPassport;
