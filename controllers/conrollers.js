const Materials = require('../models/models');
const csv_json = require('csvtojson');
const fs = require('fs');
const export_csv = require('fast-csv');

const ValidateInput = require('../middlware/validate_input');
const { STATUS_CODES } = require('http');


module.exports.filtersResult = async (req, res) => {
    try {
        const { formula, shape, sortby, stable, symmetry, minEnergy, maxEnergy, symbol } = req.query;

        const filter = {}
        if (formula) filter.formula_pretty = { $regex: new RegExp(`.*${formula}.*`, 'i') };
        if (shape) filter.symmetry__crystal_system = { $regex: new RegExp(shape, 'i') }
        if (symbol) filter.symmetry__symbol = { $regex: new RegExp(symbol, 'i') };
        if (symmetry) filter.symmetry__number = { $eq: symmetry }
        if (stable) filter.is_stable = stable === 'true'

        if (minEnergy && maxEnergy) {
            filter.energy_above_hull = { $gt: parseFloat(minEnergy), $lt: parseFloat(minEnergy) }
        } else if (minEnergy) {
            filter.energy_above_hull = { $gt: parseFloat(minEnergy) }
        } else if (maxEnergy) {
            filter.energy_above_hull = { $lt: parseFloat(maxEnergy) }
        }
        console.log(filter)
        const sort = {}
        if (sortby) {
            sort_array = sortby.split(',')
            if (sort_array.length > 0) {
                sort_array.forEach(value => {
                    sort[value] = 1
                })
            } else {
                sort[nsites] = 1;
            }
        }
        else sort.nsites = 1;

        console.log(sort)

        const materials = await Materials.find(filter).sort(sort)
        const totalResponse = await Materials.countDocuments(filter).sort(sort)

        const response = {
            statusCode: STATUS_CODES[200],
            message: "Successfully",
            total_Output: totalResponse,
            material: materials
        }
        res.status(200).json(response)
        // res.render('import.ejs', { materials: materials })
    } catch (error) {
        res.status(500).send(`Internal Server Error ${error}`)
        console.error(`Internal Server Error ${error}`)
    }
}

module.exports.materials_list = async (req, res) => {
    try {
        // Rendering the all the materials list present in Database
        const materials = await Materials.find({})
        const response_body = {
            statusCode: STATUS_CODES[200],
            message: "Successfully, rendering",
            material: materials
        }
        res.status(200).json(response_body)
        // res.render('import.ejs', { materials: materials })
    } catch (error) {
        res.status(500).send(`Internal Server Error ${error}`)
        console.error(`Internal Server Error ${error}`)
    }
}

module.exports.upload_csv_to_db = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const jsonObjects = await csv_json().fromFile(req.file.path);
        jsonObjects.map(item => {
            item.is_stable = item.is_stable.toLowerCase(),
                item.is_gap_direct = item.is_gap_direct.toLowerCase(),
                item.is_metal = item.is_metal.toLowerCase(),
                item.theoretical = item.theoretical.toLowerCase()

            if (item.universal_anisotropy.toLowerCase() === 'null') {
                item.universal_anisotropy = null;
            }
            if (item.total_magnetization.toLowerCase() === 'null') {
                item.total_magnetization = null;
            }
            return item;
        })

        for (let json_data of jsonObjects) {
            const ValidateJsonObject = ValidateInput.validate(json_data)
            if (ValidateJsonObject.error) {
                console.log(ValidateJsonObject.error.details.map(detail => detail.message));
                return res.status(400).send(`validation Error at new Material ${ValidateJsonObject.error}`)
            }
        }
        await Materials.insertMany(jsonObjects)
        res.status(201).json({ statusCode: STATUS_CODES[201], message: "Successufully add to database" })
        // res.redirect('/');
    } catch (error) {
        console.error('Error exporting CSV:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports.add_new_material = async (req, res) => {
    try {
        const validate_new_data = ValidateInput.validate(req.body)
        if (validate_new_data.error) {
            return res.status(400).send(`validation Error at new Material ${validate_new_data.error}`)
        }
        const new_material = new Materials({
            ...req.body
        })
        await new_material.save()
        res.status(201).json({ statusCode: STATUS_CODES[201], message: "New Materials is added succesffully!" })

    } catch (error) {
        console.error('Error exporting CSV:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports.export_csv_file = async (req, res) => {
    try {
        const data = []
        const materials = await Materials.find()
        materials.forEach((res) => {
            const jsonobj = {
                nsites: res.nsites,
                formula_pretty: res.formula_pretty,
                volume: res.volume,
                density: res.density,
                symmetry__crystal_system: res.symmetry__crystal_system,
                symmetry__symbol: res.symmetry__symbol,
                symmetry__number: res.symmetry__number,
                symmetry__point_group: res.symmetry__point_group,
                symmetry__symprec: res.symmetry__symprec,
                symmetry__version: res.symmetry__version,
                formation_energy_per_atom: res.formation_energy_per_atom,
                energy_above_hull: res.energy_above_hull,
                is_stable: res.is_stable,
                band_gap: res.band_gap,
                is_gap_direct: res.is_gap_direct,
                is_metal: res.is_metal,
                ordering: res.ordering,
                total_magnetization: res.total_magnetization,
                universal_anisotropy: res.universal_anisotropy,
                theoretical: res.theoretical
            };
            data.push(jsonobj);
        });
        const file = fs.createWriteStream("export_data.csv");

        export_csv
            .write(data, { headers: true })
            .pipe(file)
            .on('finish', () => {
                console.log('export_data.csv written successfully');
                return res.status(200).send({ statusCode:STATUS_CODES[200], successful: 'Completed',message: 'successfully exported' });
            });

    } catch (error) {
        console.error('Error exporting CSV:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}