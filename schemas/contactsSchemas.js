const Joi = require("joi");

const baseSchema = {
  name: Joi.string().min(3).max(30),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
  phone: Joi.string()
    .regex(/^(\+\d{2})?(\d{10}|\d{3}-\d{3}-\d{2}-\d{2})/),
};

const createContactSchema = Joi.object({
  ...baseSchema,
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  phone: Joi.string()
    .regex(/^(\+\d{2})?(\d{10}|\d{3}-\d{3}-\d{2}-\d{2})$/)
    .required(),
});

const updateContactSchema = Joi.object({
  ...baseSchema,
})
  .min(1)
  .message("Must have one field");

  const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required().messages({
      "any.required": "Missing field favorite",
    }),
  });

module.exports = {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
};