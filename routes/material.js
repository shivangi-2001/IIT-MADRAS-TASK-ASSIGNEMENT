const express = require('express');
const routes = express.Router();
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });
const Controlllers = require('../controllers/conrollers');

routes.get('/', Controlllers.filtersResult)

routes.get('/all', Controlllers.materials_list)

routes.post('/uploads', upload.single('material'), Controlllers.upload_csv_to_db)

routes.post('/add_new_material', Controlllers.add_new_material)

routes.get('/export', Controlllers.export_csv_file)

module.exports = routes;