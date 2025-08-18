function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.json({
        errors: error.details.map((detail) => detail.message),
      });
    }
    next();
  };
}

module.exports = validate;
