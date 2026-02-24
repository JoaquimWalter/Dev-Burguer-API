import bcrypt from 'bcrypt';
import * as Yup from 'yup';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import authConfig from './../../config/auth.js';

class SessionController {
  async store(request, response) {
    const schema = Yup.object({
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
    });

    const isValid = await schema.isValid(request.body, {
      abortEarly: false,
      strict: true,
    });

    if (!isValid) {
      return response.status(400).json({ message: 'Dados inválidos!' });
    }
    const { email, password } = request.body;

    const existingUser = await User.findOne({
      where: {
        email,
      },
    });

    if (!existingUser) {
      return response.status(400).json({ message: 'Dados inválidos!' });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password_hash,
    );

    if (!isPasswordCorrect) {
      return response.status(400).json({ message: 'Dados inválidos!' });
    }

    const token = jwt.sign(
      { id: existingUser.id, admin: existingUser.admin },
      authConfig.secret,
      {
        expiresIn: authConfig.expiresIn,
      },
    );

    return response.status(201).json({
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      admin: existingUser.admin,
      token,
    });
  }
}

export default new SessionController();
