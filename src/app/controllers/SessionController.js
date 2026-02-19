import bcrypt from 'bcrypt';
import * as Yup from 'yup';
import User from '../models/User.js';

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

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password_hash);
    
    if (!isPasswordCorrect) {
      return response.status(400).json({ message: 'Dados inválidos!' });
    }

    return response.status(201).json({ 
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        admin: existingUser.admin,
    });
  }
}

export default new SessionController();
