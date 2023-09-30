import passport from "passport";
import passportLocal from "passport-local";
import UserManager from "../dao/mongoManager/userManagerMongo.js";
import GitHubStrategy from "passport-github2";
import { createHash, isValidPassword } from "../utils.js";
import jwtStrategy from "passport-jwt";
import { PRIVATE_KEY } from "../utils.js";

const UM = new UserManager();

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
          const user = await UM.leerUsuarios({ email: profile._json.email });
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
            };
            const result = await UM.crearUsuario(newUser);
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

  /*=====================================
  |    Serializacion y Dessealizacion    |
  ======================================*/

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await UM.buscarID(id);
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
