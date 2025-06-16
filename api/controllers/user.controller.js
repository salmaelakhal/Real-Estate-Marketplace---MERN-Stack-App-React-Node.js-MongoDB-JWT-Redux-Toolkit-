import User from "../models/user.model.js";

export const test = (req, res) => {
  res.json({
    message: "Welcome to the User API",
    status: "success",
  });
};

// PUT /api/users/update/:id
// export const updateUser = async (req, res) => {
//   try {
//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.id,
//       {
//         $set: {
//           username: req.body.username,
//           email: req.body.email,
//           password: req.body.password,
//           avatar: req.body.avatar,
//         },
//       },
//       { new: true } // Retourne le user mis à jour
//     );

//     res.status(200).json(updatedUser);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Erreur lors de la mise à jour", error: err });
//   }
// };
