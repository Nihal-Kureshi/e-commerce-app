import Joi from 'joi';

// Validation schemas
export const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
  }),

  placeOrder: Joi.object({
    items: Joi.array().items(
      Joi.object({
        productId: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().positive().required(),
      })
    ).min(1).required(),
    total: Joi.number().positive().required(),
  }),

  productQuery: Joi.object({
    category: Joi.string().optional(),
    search: Joi.string().min(1).max(100).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    offset: Joi.number().integer().min(0).optional(),
  }),
};

// Validation middleware
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({
        message: 'Validation error',
        details: errorMessage,
      });
    }
    
    next();
  };
};

// Query validation middleware
export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query);
    
    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({
        message: 'Invalid query parameters',
        details: errorMessage,
      });
    }
    
    next();
  };
};