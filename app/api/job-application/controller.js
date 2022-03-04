const JobApplication = require('./model');

async function index(req,res,next) {

    try {
        
        let user_candidate = req.user;
        let applications = await JobApplication.find(
            {
                user_candidate: user_candidate._id
            }
        )
        .populate({
            path: 'user_candidate',
            model: 'User',
            select: 'first_name last_name'
        })
        .populate({
            path: 'id_candidate_application',
            model: 'Candidate',
            select: '-user_candidate -__v',
            populate:{
                path: 'skills',
                model: "Skill",
                select: '-__v'
            }
        })
        .populate({
            path: 'user_candidate',
            model: 'User',
            select: 'first_name last_name'
        })
        .populate({
            path: 'job_id',
            model: 'Job',
            populate:{
                path: 'company_name',
                select: '-user_company -is_registration_company',
                populate:{
                    path: 'company_industry',
                    model: "CompanyIndustry",
                    select: '-__v'
                }

            }
        })
        .select('-__v')

        return res.status(200).json({
            code: 200,
            status: "OK",
            message: 'Success get applications',
            data: applications
        })

    } catch (err) {

        if (err && err.name === 'ValidationError') {
            return res.status(400).json({
                code: 400,
                status: "BAD REQUEST",
                message: err.message,
                fields: err.errors
            });
        }

        next(err)

    }

}


async function store(req,res,next) {

    try {
        
        let payload = req.body;
        let user_candidate = req.user;

        let sendApplication = new JobApplication({
            ...payload,
            user_candidate: user_candidate._id,
        });

        await sendApplication.save();

        return res.status(201).json({
            code: 200,
            status: "OK",
            message: 'Success send application',
            data: sendApplication
        });


    } catch (err) {

        if (err && err.name === 'ValidationError') {
            return res.status(400).json({
                code: 400,
                status: "BAD REQUEST",
                message: err.message,
                fields: err.errors
            });
        }

        next(err)
    }

}

async function update(req,res,next) {

    try {
        
        let payload = req.body;
        let user_candidate = req.user;
        let jobApplicationId = req.params.application_id;

        let updateApplication = await JobApplication.findOneAndUpdate(
            {
                _id: jobApplicationId
            },
            {
            ...payload,
            user_candidate: user_candidate._id,
            },
            {
                new: true,
                runValidators: true
            }
        );

        return res.status(201).json({
            code: 200,
            status: "OK",
            message: 'Success update application',
            data: updateApplication
        });


    } catch (err) {

        if (err && err.name === 'ValidationError') {
            return res.status(400).json({
                code: 400,
                status: "BAD REQUEST",
                message: err.message,
                fields: err.errors
            });
        }

        next(err)
    }

}

async function getApplicationForCompany (req, res,next){

    try {
        
        let user_company = req.user;
        console.log(user_company);
        let candidateApplications = await JobApplication.find(
            {
                id_user_company: user_company._id
            }
        )
        .populate({
            path: 'user_candidate',
            model: 'User',
            select: 'first_name last_name'
        })
        .populate({
            path: 'id_candidate_application',
            model: 'Candidate',
            select: '-user_candidate -__v',
            populate:{
                path: 'skills',
                model: "Skill",
                select: '-__v'
            }
        })
        .populate({
            path: 'user_candidate',
            model: 'User',
            select: 'first_name last_name'
        })
        .populate({
            path: 'job_id',
            model: 'Job',
            populate:{
                path: 'company_name',
                select: '-user_company -is_registration_company',
                populate:{
                    path: 'company_industry',
                    model: "CompanyIndustry",
                    select: '-__v'
                }

            }
        })
        .select('-__v')

        console.log(candidateApplications)


        if(candidateApplications.length > 0){
            return res.status(200).json({
                code: 200,
                status: "OK",
                message: 'Success get all candidates',
                data: candidateApplications
            });
        } else {
            return res.status(200).json({
                code: 200,
                status: "OK",
                message: 'No data available',
                data: candidateApplications
            });
        }


    } catch (err) {
        next(err);
    }

}


module.exports = {
    index,
    update,
    store,
    getApplicationForCompany,
}