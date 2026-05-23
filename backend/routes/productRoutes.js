const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const {
    getProducts,
    getProductById,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct,
    syncProducts,
    searchZohoItems,
    getFilters,
    getSmartFilters,
    getSampleCSV,
    importProducts,
    exportProducts,
    importImagesZip,
    createProductReview
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Set up multer for processing bulk uploads
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit for ZIPs
});

router.route('/sync-zoho').post(protect, authorize('SUPER_ADMIN'), syncProducts);
router.route('/search-zoho').get(protect, authorize('STAFF_PRODUCT', 'SUPER_ADMIN'), searchZohoItems);
router.route('/filters/smart').get(getSmartFilters);
router.route('/filters').get(getFilters);
router.route('/sample-csv').get(protect, authorize('STAFF_PRODUCT'), getSampleCSV);

// Bulk import & export operations
router.post('/import', protect, authorize('STAFF_PRODUCT'), upload.single('file'), importProducts);
router.post('/import-zip', protect, authorize('STAFF_PRODUCT'), upload.single('file'), importImagesZip);
router.get('/export', protect, authorize('STAFF_PRODUCT'), exportProducts);

router.route('/')
    .get(getProducts)
    .post(protect, authorize('STAFF_PRODUCT'), createProduct);
router.route('/slug/:slug').get(getProductBySlug);
router.route('/:id/reviews').post(protect, createProductReview);

router.route('/:id')
    .get(getProductById)
    .put(protect, authorize('STAFF_PRODUCT'), updateProduct)
    .delete(protect, authorize('SUPER_ADMIN'), deleteProduct);

module.exports = router;
