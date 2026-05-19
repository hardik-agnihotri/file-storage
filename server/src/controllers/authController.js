import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const authController = {
  async register(req, res) {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ error: 'Email already registered' });

      const newUser = await User.create({ email, password, firstName, lastName });
      const token = signToken(newUser._id);

      return res.status(201).json({
        token,
        user: { id: newUser._id, email: newUser.email, firstName: newUser.firstName }
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ error: 'Provide email and password' });

      const user = await User.findOne({ email });
      if (!user || !(await user.correctPassword(password, user.password))) {
        return res.status(401).json({ error: 'Incorrect email or password' });
      }

      const token = signToken(user._id);
      return res.status(200).json({
        token,
        user: { id: user._id, email: user.email, firstName: user.firstName }
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};