// 1. Importation des outils nécessaires
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// 2. Contrôleur de création d'utilisateur
export const signup = async (req, res) => {
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
        res.status(500).json(error.message);
    }

};
