const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Carbon footprint factors (replace with accurate values from reliable sources)
const factors = {
  acUsagePerHour: 1000, // Joules per hour per kW (adjust based on AC model)
  refrigeratorUsagePerHour: 500, // Joules per hour per liter (adjust based on refrigerator size)
  fuelBurnPerLiter: 10000000, // Joules per liter of fuel (adjust based on fuel type)
  treeCarbonStorage: 20000000, // Joules of CO2 sequestered per kg of tree (adjust based on tree species)
  woodBurningPerKg: 15000000, // Joules per kg of wood burned (adjust based on wood type)
  coolBurningPerKg: 8000000, // Joules per kg of coal burned (adjust based on coal type)
};

// API endpoint for calculating carbon footprint
app.post('/footprint', (req, res) => {
  const { acHours, refrigeratorHours, fuelLiters, treesCut, woodKg, coalKg } = req.body;

  // Input validation (consider using a library like Joi for more robust validation)
  if (!acHours || !refrigeratorHours || !fuelLiters || !treesCut || !woodKg || !coalKg) {
    return res.status(400).json({ message: 'Missing required data' });
  }

  if (acHours < 0 || refrigeratorHours < 0 || fuelLiters < 0 || treesCut < 0 || woodKg < 0 || coalKg < 0) {
    return res.status(400).json({ message: 'Invalid input values (negative values not allowed)' });
  }

  // Calculate footprint components in Joules
  const acFootprint = acHours * factors.acUsagePerHour;
  const refrigeratorFootprint = refrigeratorHours * factors.refrigeratorUsagePerHour;
  const fuelFootprint = fuelLiters * factors.fuelBurnPerLiter;
  const deforestationFootprint = treesCut * -factors.treeCarbonStorage; // Negative value as trees absorb CO2
  const woodBurningFootprint = woodKg * factors.woodBurningPerKg;
  const coalBurningFootprint = coalKg * factors.coolBurningPerKg;

  // Calculate total footprint in Joules
  const totalJoules = acFootprint + refrigeratorFootprint + fuelFootprint + deforestationFootprint + woodBurningFootprint + coalBurningFootprint;

  // Convert Joules to a more user-friendly unit (e.g., kg CO2 equivalent)
  // You can implement conversion based on the conversion factor for CO2 (e.g., 4.184 J/cal and emission factor for fuel combustion)
  const totalConsumption = totalJoules; //* conversion factor */ // Replace with actual conversion

  res.json({ message: 'Carbon footprint calculated successfully', totalConsumption });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
