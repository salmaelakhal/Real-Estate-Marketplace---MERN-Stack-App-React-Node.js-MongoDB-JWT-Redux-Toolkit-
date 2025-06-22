// 1. Importation des outils nécessaires
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"; // ✅ tu as cette ligne déjà
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
  const { email, password } = req.body;
  console.log("📩 Requête reçue avec :", req.body);

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      console.log("❌ Utilisateur non trouvé");
      return next(errorHandler(404, "User not found"));
    }

    const isPasswordValid = bcrypt.compareSync(password, validUser.password);
    if (!isPasswordValid) {
      console.log("🔐 Mot de passe incorrect");
      return next(errorHandler(401, "Wrong credentials!"));
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    const { password: pass, ...rest } = validUser._doc;

    console.log("✅ Connexion réussie. Token généré.");
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    console.error("💥 Erreur dans signin():", error);
    next(error);
  }
};
 
  export const google = async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = user._doc;
        res
          .cookie("access_token", token, { httpOnly: true })
          .status(200)
          .json(rest);
      } else {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);
          const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
          const newUser = new User({
          username:
            req.body.name.split(" ").join("").toLowerCase() +
            Math.random().toString(36).slice(-4),
          email: req.body.email,
          password: hashedPassword,
          avatar: req.body.photo,
        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = newUser._doc;
        res
          .cookie("access_token", token, { httpOnly: true })
          .status(200)
          .json(rest);
      }
    } catch (error) {
      next(error);
    }
  };



  export const signout = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "No user is logged in",
      });
    }

    try {
      res.clearCookie("access_token").status(200).json({
        success: true,
        message: "User has been logged out successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }
  };
  
