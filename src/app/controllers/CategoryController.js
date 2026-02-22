import * as Yup from 'yup';
import Category from '../models/Category.js';

class CategoryController {
  async store(request, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      // console.log(err);
      return response.status(400).json({ errors: err.errors });
    }


    const { name } = request.body;

    // console.log({name, price, category, filename});

    const exixtsCategory = await Category.findOne({ where: { name } });

    if (exixtsCategory) {
      return response.status(400).json({ error: 'Category already exists' });
    }

    const newCategory = await Category.create({
      name,
    });

    return response.status(201).json(newCategory);
  }
  async index(_request, response) {
    // console.log('Listando categorias', _request);
    const categories = await Category.findAll();

    return response.status(200).json(categories);
  }
}

export default new CategoryController();
