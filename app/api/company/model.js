const mongoose = require('mongoose');

const { model, Schema } = mongoose;

const companySchema = Schema({

    company_name: {
        type: String,
        minlength: [3, 'Panjang Nama Perusahaan minimal 3 karakter'],
        maxlength: [255, 'Panjang Nama Perusahaan maksimal 255 karakter'],
        required: [true, 'Nama Perusahaan harus diisi']
    },

    employee_min: {
        type: String,
        required: [true, 'deskripsi perushaan harus diisi']
    },
    
    employee_max: {
        type: String,
        required: [true, 'deskripsi perushaan harus diisi']
    },

    company_description: {
        type: String,
        minlength: [3, 'Panjang deskripsi perushaan minimal 3 karakter'],
        required: [true, 'deskripsi perushaan harus diisi']
    },

    company_location: {
        type: String,
        minlength: [3, 'Panjang lokasi perusahaan minimal 3 karakter'],
        maxlength: [255, 'Panjang lokasi perusahaan maksimal 255 karakter'],
        required: [true, 'lokasi perusahaan harus diisi']
    },

   company_website_url: {
        type: String,
    },

    company_linkedin_url: {
        type: String,
    },

    company_instagram_url: {
        type: String,
    },

    is_registration_company: {
        type: Boolean,
        default: true,
    },

    company_industry: {
        type: Schema.Types.ObjectId,
        ref: 'CompanyIndustry'
    },

    user_company:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    company_image_url: String,

}, { timestamps: true });


module.exports = model('Company', companySchema);