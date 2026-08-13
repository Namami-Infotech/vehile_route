// const warehouseService = require("../services/warehouse.service");
// const { Client } = require("@googlemaps/google-maps-services-js");
// const googleMapsClient = new Client({});
// //ejs used

// async function listWarehouses(req, res, next) {
//   try {
//     const warehouses = await warehouseService.getAllWarehouses();
//     res.json(warehouses);
//   } catch (error) {
//     next(error);
//   }
// }

// // async function addWarehouse(req, res, next) {
// //   try {
// //     const { name, address, lat, lng, maxCapacity } = req.body;
// //     if (!name || lat == null || lng == null) {
// //       return res.status(400).json({ error: "name, lat, and lng are required" });
// //     }

// //     const warehouse = await warehouseService.createWarehouse({
// //       name,
// //       address,
// //       lat,
// //       lng,
// //       maxCapacity,
// //     });

// //     res.status(201).json(warehouse);
// //   } catch (error) {
// //     next(error);
// //   }
// // }

// async function addWarehouse(req, res, next) {
//   try {
//     const { name, address, maxCapacity } = req.body;

//     // 1. Validation: Name aur Address mandatory hain
//     if (!name || !address) {
//       return res.status(400).json({ error: "name and address are required" });
//     }

//     // 2. Google Geocoding API se Lat/Lng fetch karna (Name + Address ka query combination)
//     const geocodeResponse = await googleMapsClient.geocode({
//       params: {
//         address: `${name}, ${address}`,
//         key: process.env.GOOGLE_MAPS_API_KEY, // Apni Google API Key yahan rakhein
//       },
//     });

//     const results = geocodeResponse.data.results;

//     if (!results || results.length === 0) {
//       return res.status(400).json({
//         error: "Unable to find coordinates for the given name and address",
//       });
//     }

//     // 3. Location coordinates extract karna
//     const { lat, lng } = results[0].geometry.location;

//     // 4. Warehouse DB mein save karna
//     const warehouse = await warehouseService.createWarehouse({
//       name,
//       address,
//       lat,
//       lng,
//       maxCapacity,
//     });

//     res.status(201).json(warehouse);
//   } catch (error) {
//     next(error);
//   }
// }

// module.exports = {
//   listWarehouses,
//   addWarehouse,
// };
const warehouseService = require("../services/warehouse.service");
const { Client } = require("@googlemaps/google-maps-services-js");
const googleMapsClient = new Client({});

async function listWarehouses(req, res, next) {
  try {
    const warehouses = await warehouseService.getAllWarehouses();
    res.json(warehouses);
  } catch (error) {
    next(error);
  }
}

async function addWarehouse(req, res, next) {
  try {
    const { name, address, maxCapacity } = req.body;

    // 1. Validation: Name aur Address mandatory hain
    if (!name || !address) {
      return res.status(400).json({ error: "name and address are required" });
    }

    // 2. API Key Check
    if (!process.env.GOOGLE_MAPS_API_KEY) {
      return res
        .status(500)
        .json({ error: "Google Maps API Key is not configured" });
    }

    // 3. Google Geocoding API Call (First attempt with Name + Address)
    let geocodeResponse = await googleMapsClient.geocode({
      params: {
        address: `${name}, ${address}`,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    let results = geocodeResponse.data.results;

    // Fallback: Agar Name+Address se location na mile, toh sirf Address se try karein
    if (!results || results.length === 0) {
      geocodeResponse = await googleMapsClient.geocode({
        params: {
          address: address,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      });
      results = geocodeResponse.data.results;
    }

    if (!results || results.length === 0) {
      return res.status(400).json({
        error: "Unable to find coordinates for the given address",
      });
    }

    // 4. Location coordinates extract karna
    const { lat, lng } = results[0].geometry.location;

    // 5. Warehouse DB mein save karna
    const warehouse = await warehouseService.createWarehouse({
      name,
      address,
      lat,
      lng,
      maxCapacity,
    });

    res.status(201).json(warehouse);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listWarehouses,
  addWarehouse,
};
