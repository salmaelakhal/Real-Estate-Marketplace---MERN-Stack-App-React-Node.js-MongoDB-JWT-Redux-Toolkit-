// 1. Importation des outils nécessaires
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
// 2. Contrôleur de création d'utilisateur



export const signup = async (req, res, next) => {
  // 3. Récupérer les infos envoyées par le client
  const { username, email, password } = req.body;

  // 4. Hacher le mot de passe
  const hashedPassword = bcrypt.hashSync(password, 10);

  // 5. Créer un objet utilisateur
  const newUser = new User({ username, email, password: hashedPassword });

  // 6. Sauvegarder dans MongoDB
  try {
    await newUser.save();
    res.status(201).json("User created successfully");
  } catch (error) {
    next(error);
  }
};

// Contrôleur de connexion (signin)
export const signin = async (req, res, next) => {
    // 1. Récupérer les infos envoyées par le client dans le body (email et password)
    const { email, password } = req.body;
  
    try {
      // 2. Vérifier si un utilisateur avec cet email existe dans la base MongoDB
      const validUser = await User.findOne({ email });
      
      // 3. Si aucun utilisateur n'est trouvé, renvoyer une erreur 404
      if (!validUser) {
        return next(errorHandler(404, "User not found"));
      }
  
      // 4. Comparer le mot de passe envoyé avec celui stocké (haché)
      const isPasswordValid = bcrypt.compareSync(password, validUser.password);
      
      // 5. Si les mots de passe ne correspondent pas, renvoyer une erreur 401
      if (!isPasswordValid) {
        return next(errorHandler(401, "Wrong credentials!"));
      }
  
      // 6. Si l'utilisateur est valide, générer un token JWT signé avec l'id de l'utilisateur
      const token = jwt.sign(
        { id: validUser._id },            // charge utile (payload) du token
        process.env.JWT_SECRET            // clé secrète pour signer le token
      );
  
      // 7. Exclure le mot de passe des données utilisateur avant de les envoyer au client
      const { password: pass, ...rest } = validUser._doc;
      // validUser._doc contient toutes les données de l'utilisateur MongoDB
  
      // 8. Envoyer un cookie contenant le token + la réponse JSON (infos utilisateur sans mot de passe)
      res
        .cookie("access_token", token, {
          httpOnly: true,                // le cookie ne sera pas accessible par JavaScript (sécurité XSS)
          // Optionnel : tu peux aussi ajouter "secure: true" et "sameSite" selon ton environnement
        })
        .status(200)                     // Statut HTTP OK
        .json(rest);                     // Envoyer les données utilisateur (sans mot de passe)
        
    } catch (error) {
      // 9. Si une erreur se produit (base de données, etc.), passer au middleware d'erreur
      next(error);
    }
  };
  
