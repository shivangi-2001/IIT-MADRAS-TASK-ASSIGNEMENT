const Joi = require('joi');

const ValidateInput = Joi.object({
    nsites: Joi.number().required(),
    formula_pretty: Joi.string().required(),
    volume: Joi.number().precision(15).required().default(0),
    density: Joi.number().precision(15).required().default(0),
    symmetry__crystal_system: Joi.string().allow(null),
    symmetry__symbol: Joi.string().allow(null),
    symmetry__number: Joi.number(),
    symmetry__point_group: Joi.string(),
    symmetry__symprec: Joi.number().precision(15).required().default(0),
    symmetry__version: Joi.string(),
    formation_energy_per_atom: Joi.number().default(0).required(),
    energy_above_hull: Joi.number().default(0).required(),
    band_gap: Joi.number().default(0).required(),
    is_stable: Joi.boolean().required(),
    is_gap_direct: Joi.boolean().required(),
    is_metal: Joi.boolean().required().allow(null),
    ordering: Joi.string().required(),
    total_magnetization: Joi.number().precision(15).allow(null),
    universal_anisotropy: Joi.number().precision(15).allow(null).required(),
    theoretical: Joi.boolean().required().allow(null)
})

module.exports = ValidateInput