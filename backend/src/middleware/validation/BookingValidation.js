import Joi from "joi";

const schema = Joi.object({
  travelCode: Joi.string().required(),
  numberOfPeople: Joi.number().integer().min(1).required()
});

const bookingValidation = (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

export default bookingValidation;
