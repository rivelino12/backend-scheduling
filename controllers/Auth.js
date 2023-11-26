import User from "../models/UserModel.js";
import argon2 from "argon2";

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email dan password kosong" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ msg: "Pengguna tidak ditemukan" });
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      return res.status(400).json({ msg: "Kata Sandi salah" });
    }

    req.session.userId = user.uuid;

    const { uuid, name, email: userEmail, role } = user;

    res.status(200).json({ uuid, name, email: userEmail, role });
  } catch (error) {
    console.error("Kesalahan saat login:", error);
    res.status(500).json({ msg: "Kesalahan Internal Server" });
  }
};

export const Me = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: "Mohon login ke akun Anda!" });
  }
  const user = await User.findOne({
    attributes: ["uuid", "name", "email", "role"],
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  res.status(200).json(user);
};

export const logOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: "Tidak dapat keluar" });
    res.status(200).json({ msg: "Anda telah keluar" });
  });
};
