import * as Yup from 'yup';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
class ProductController {
  async store(request, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category_id: Yup.number().required(),
      offer: Yup.boolean(),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      // console.log(err);
      return response.status(400).json({ errors: err.errors });
    }
    const { name, price, category_id, offer } = request.body;
    const { filename } = request.file;

    // console.log({name, price, category_id, filename});

    const newProduct = await Product.create({
      name,
      price,
      category_id,
      path: filename,
      offer,
    });

    return response.status(201).json(newProduct);
  }

  async update(request, response) {
    const schema = Yup.object({
      name: Yup.string(),
      price: Yup.number(),
      category_id: Yup.number(),
      offer: Yup.boolean(),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      // console.log(err);
      return response.status(400).json({ errors: err.errors });
    }
    const { name, price, category_id, offer } = request.body;
    const { id } = request.params;

    let path;
    if (request.file) {
      const { filename } = request.file;
      path = filename;
    }

    // console.log({name, price, category_id, filename});

    await Product.update(
      {
        name,
        price,
        category_id,
        path,
        offer,
      },
      {
        where: {
          id,
        },
      },
    );

    return response.status(201).json({ message: "Produto atualizado com sucesso!" });
  }
  async index(_request, response) {
    // console.log('Listando produtos', _request);
    const products = await Product.findAll({
      include: {
        model: Category,
        as: 'category',
        attributes: ['id', 'name'],
      },
    });

    return response.status(200).json(products);
  }
}

export default new ProductController();
