const Hospital = require('../models/hospitalModel');

exports.createHospital = async (req, res) => {
  try {
    const h = new Hospital(req.body);
    await h.save();
    res.status(201).json(h);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getHospitals = async (req, res) => {
  try {
    const list = await Hospital.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateHospital = async (req, res) => {
  try {
    const h = await Hospital.findById(req.params.id);
    if (!h) return res.status(404).json({ message: 'Not found' });
    Object.assign(h, req.body);
    await h.save();
    res.json(h);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteHospital = async (req, res) => {
  try {
    const h = await Hospital.findById(req.params.id);
    if (!h) return res.status(404).json({ message: 'Not found' });
    await h.remove();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
