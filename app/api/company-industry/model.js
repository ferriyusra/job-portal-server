const mongoose = require('mongoose');

const { model, Schema } = mongoose;

const companyIndustrySchema = Schema({
    name: {
        type: String,
        minlength: [3, 'Panjang industri perusahaan minimal 3 karakter'],
        maxlength: [255, 'Panjang industri perusahaan maksimal 255 karakter'],
        required: [true, 'tipe industri perusahaan harus diisi']
    },

}, { timestamps: true });


module.exports = model('CompanyIndustry', companyIndustrySchema, 'company_industries');