const express = require("express");
const multer = require('multer');
const xml2js = require('xml2js');
const { parseFromFile } = require('../middlewares/upload_service');

const router = express.Router();
const storage = multer.memoryStorage();
const uploadFile = multer({ storage });

router.post('/', uploadFile.single('file'), async (req, res) => {
	const xml = req.file.buffer.toString();
    try {
        const parsedXML = await xml2js.parseStringPromise(xml, {
            explicitArray: false,
        });
        const data = JSON.parse(JSON.stringify(parsedXML));
    	const payments = data.root.row;
    	const batch = parseFromFile(payments, req.file.originalname);
    	return res.status(200).send(batch);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error parsing XML data');
        return;
    }
});

module.exports = router;