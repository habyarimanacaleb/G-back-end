const express = require("express");
const router = express.Router();
const Service = require("../models/seviceModel");
const isAdmin = require('../middlewares/IsAdmin');

// Create a new service
router.post("/", async (req, res) => {
  try {
    const service = new Service(req.body);
    // const id = req.params.id
    const existService = await Service.findOne({ name: req.body.name });
    if (existService) return res.status(403).json({ message: "Service Exist" });
    const saveService = await service.save();
    res.status(201).json(saveService);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id",isAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    // Validate request body (optional: you can add schema validation here)
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No update data provided" });
    }

    // Perform the update
    const updatedService = await Service.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedService) {
      return res.status(404).json({ message: "Service does not exist" });
    }

    // Send success response
    res.status(200).json(updatedService);
  } catch (err) {
    console.error(err); // Optional: Log the error for debugging
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
// Get all services
router.get("/", async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// get single service
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params.id;
    const service = await Service.findOne({ id });
    if(!service) return res.statusCode(403).json({message:'Service Not Found!'})
    res.status(200).json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//Delete service
//
// Route to delete all services
router.delete("/delete-all",isAdmin, async (req, res) => {
  try {
    const result = await Service.deleteMany({});
    if (result.deletedCount === 0)
      return res.status(404).json({ message: "No services found to delete" });

    res.status(200).json({
      message: `${result.deletedCount} service(s) deleted successfully`,
    });
  } catch (err) {
    console.error(err); // Optional: Log the error for debugging
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Route to delete services by creation time range
router.delete('/delete-by-time',isAdmin, async (req, res) => {
    try {
      const { startTime, endTime } = req.body;
  
      // Validate inputs
      if (!startTime || !endTime) {
        return res.status(400).json({ message: 'Both startTime and endTime are required' });
      }
  
      // Convert to Date objects
      const start = new Date(startTime);
      const end = new Date(endTime);
  
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
  
      // Delete services in the specified range
      const result = await Service.deleteMany({
        createdAt: { $gte: start, $lte: end }
      });
  
      // Check if any services were deleted
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'No services found in the specified range' });
      }
  
      // Respond with the result
      res.status(200).json({
        message: `${result.deletedCount} service(s) deleted successfully`
      });
    } catch (err) {
      console.error(err); // Optional: Log the error for debugging
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });
  //delete single service
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params; 
      const service = await Service.findByIdAndDelete(id);
      if (!service) {
        return res.status(404).json({ message: `Service with ID: ${id} not found!` });
      }
      res.status(200).json({ message: 'Service Deleted!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });

  module.exports = router;
