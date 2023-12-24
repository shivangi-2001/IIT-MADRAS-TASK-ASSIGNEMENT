const express = require('express');
const routes = express.Router();
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });
const Controlllers = require('../controllers/conrollers');
const Materials = require('../models/models');

routes.get('/', Controlllers.filtersResult)

routes.get('/all', Controlllers.materials_list)

routes.get('/search', Controlllers.searchResult)

routes.post('/uploads', upload.single('material'), Controlllers.upload_csv_to_db)

routes.get('/add_new_material', async (req, res) => {
    res.render('add_form.ejs')
})

routes.post('/add_new_material', Controlllers.add_new_material)

routes.get('/export', Controlllers.export_csv_file)

module.exports = routes;