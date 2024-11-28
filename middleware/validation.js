const { z } = require("zod");
// i am using ZOD valdattion here to validate the longi and lati and other inputs
const schoolSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

const coordinatesSchema = z
  .object({
    latitude: z.string().transform(Number),
    longitude: z.string().transform(Number),
  })
  .refine(
    (data) => {
      const lat = Number(data.latitude);
      const lon = Number(data.longitude);
      return (
        !isNaN(lat) &&
        !isNaN(lon) &&
        lat >= -90 &&
        lat <= 90 &&
        lon >= -180 &&
        lon <= 180
      );
    },
    {
      message: "Invalid coordinates",
    }
  );
const validateSchoolInput = async (req, res, next) => {
  try {
    await schoolSchema.parseAsync(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: error.errors });
  }
};

const validateCoordinates = async (req, res, next) => {
  try {
    await coordinatesSchema.parseAsync(req.query);
    next();
  } catch (error) {
    res.status(400).json({ error: error.errors });
  }
};

module.exports = { validateSchoolInput, validateCoordinates };
