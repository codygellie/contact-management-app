const express = require('express');
const ContactController = require('../controllers/ContactController');

const router = express.Router();

router.get('/', ContactController.getContacts);
router.post('/', ContactController.createContact);
router.put('/:id', ContactController.updateContact);
router.delete('/:id', ContactController.deleteContact);

module.exports = router;