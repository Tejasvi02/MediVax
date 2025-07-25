const Vaccine = require('../models/vaccineModel');

exports.createVaccine = async (req, res) => {
  try {
    const v = new Vaccine(req.body);
    await v.save();
    res.status(201).json(v);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getVaccines = async (req, res) => {
  try {
    const list = await Vaccine.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateVaccine = async (req, res) => {
  try {
    const v = await Vaccine.findById(req.params.id);
    if (!v) return res.status(404).json({ message: 'Not found' });
    Object.assign(v, req.body);
    await v.save();
    res.json(v);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteVaccine = async (req, res) => {
  try {
    const v = await Vaccine.findById(req.params.id);
    if (!v) return res.status(404).json({ message: 'Not found' });
    await v.remove();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
