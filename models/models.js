const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    nsites: {
        type: Number,
        required: true,
    },
    formula_pretty: {
        type: String,
        required: true,
    },
    volume: {
        type: mongoose.Decimal128,
        default: 0,
        required: true
    },
    density: {
        type: mongoose.Decimal128,
        default: 0,
        required: true,
    },
    symmetry__crystal_system: {
        type: String,
    },
    symmetry__symbol: {
        type: String,
    },
    symmetry__number: {
        type: Number,
    },
    symmetry__point_group: {
        type: String,
    },
    symmetry__symprec: {
        type: mongoose.Decimal128,
        default: 0.0,
        required: true,
    },
    symmetry__version: {
        type: String,
    },
    formation_energy_per_atom: {
        type: Number,
        default: 0,
        required: true,
    },
    energy_above_hull: {
        type: Number,
        default: 0,
        required: true,
    },
    is_stable: {
        type: Boolean,
        required: true
    },
    band_gap: {
        type: Number,
        required: true,
    },
    is_gap_direct: {
        type: Boolean,
        required: true
    },
    is_metal: {
        type: Boolean,
        required: true
    },
    ordering: {
        type: String,
        required: true
    },
    total_magnetization: {
        type: Number,
        null: true
    },
    universal_anisotropy: {
        type: Number,
        null: true
    },
    theoretical: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('Materials', materialSchema);
