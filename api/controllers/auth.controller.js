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

export const signin = async (req, res, next) => {
  // 1. Récupérer les infos envoyées par le client
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    const isPasswordValid = bcrypt.compareSync(password, validUser.password);
    if (!isPasswordValid) {
      return next(errorHandler(401, "Wrong credentials!"));
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
