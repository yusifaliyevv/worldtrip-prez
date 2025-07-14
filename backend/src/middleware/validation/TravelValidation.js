import Joi from "joi";

const travelSchema = Joi.object({
  fromCity: Joi.string().required(),
  toCity: Joi.string().required(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().greater(Joi.ref("startDate")).optional(),
  price: Joi.number().min(0).required(),
  seatsAvailable: Joi.number().integer().min(1).required(),
  description: Joi.string().optional().allow(""),
  image: Joi.any().optional().allow(""),
});

const travelValidation = (req, res, next) => {
  const { error } = travelSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

export default travelValidation;
