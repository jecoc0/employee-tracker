// This is the central hub to bring all routes together

const express = require('express');
const router = express.Router();

router.use(require('./employeeRoutes'));
router.use(require('./roleRoutes'));

module.exports = router;