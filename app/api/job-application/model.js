const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const jobApplicationSchema = Schema({


    user_candidate: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    id_candidate_application: {
        type: Schema.Types.ObjectId,
        ref: 'Candidate'
    },

    id_user_company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },

    company_name: {
        type: Schema.Types.ObjectId,
        ref: 'Company' 
    },

    job_id: {
        type: Schema.Types.ObjectId,
        ref: 'Job' 
    },

    is_apply: {
        type: Boolean,
        default: false,
    },

    status: {
        type: String,
        enum: ['review', 'process', 'hiring'],
    }


}, {timestamps: true,});

module.exports = model('JobApplication', jobApplicationSchema, 'job_application');