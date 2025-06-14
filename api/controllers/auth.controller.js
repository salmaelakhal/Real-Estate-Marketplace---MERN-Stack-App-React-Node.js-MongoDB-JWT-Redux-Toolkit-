import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Gestion erreur personnalisée (à adapter si besoin)
import { errorHandler } from "../utils/error.js";

// Inscription classique
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json("User created successfully");
  } catch (error) {
    next(error);
  }
};

// Connexion classique
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });

    if (!validUser) return next(errorHandler(404, "User not found"));

    const isPasswordValid = bcrypt.compareSync(password, validUser.password);
    if (!isPasswordValid) return next(errorHandler(401, "Wrong credentials!"));

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

// Connexion/Inscription via Google OAuth
export const googleAuth = async (req, res, next) => {
  const { email, name, googleId, photoUrl } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      // Si utilisateur existe, on le met à jour avec l'id Google et la photo au besoin
      user.googleId = googleId;
      user.photo = photoUrl;
      await user.save();
    } else {  
      // Si pas trouvé, on crée un nouvel utilisateur Google (avec un mot de passe vide ou random)
      user = new User({
        username: name,
        email,
        googleId,
        photo: photoUrl,
      });
      await user.save();
    }

    // Générer un token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    const { password, ...rest } = user._doc;

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
