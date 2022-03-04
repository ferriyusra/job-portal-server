const mongoose = require('mongoose');

const { model, Schema } = mongoose;

const jobCategorySchema = Schema({
    name: {
        type: String,
        minlength: [3, 'Panjang kategori lowongan kerja minimal 3 karakter'],
        maxlength: [255, 'Panjang kategori lowongan kerja maksimal 255 karakter'],
        required: [true, 'kategori lowongan kerja harus diisi']
    },

}, { timestamps: true });


module.exports = model('JobCategory', jobCategorySchema, 'job_categories');