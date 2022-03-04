const CompanyIndustry = require("./model");


async function index(req, res, next) {
    try {

        let companyIndustries = await CompanyIndustry.find().select('-__v');
        return res.status(200).json({
            code: 200,
            status: "OK",
            message: 'Success get all company Industries',
            data: companyIndustries
        });
    } catch (err) {
        next(err)
    }
}

async function store(req, res, next) {

    try {

        let payload = req.body;

        let companyIndustry = new CompanyIndustry(payload);

        await companyIndustry.save();

        return res.status(201).json({
            code: 200,
            status: "OK",
            message: 'Success create company industry',
            data: companyIndustry
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

async function update(req, res, next) {

    try {

        let payload = req.body;

        let companyIndustryId = req.params.id;


        let companyIndustry = await CompanyIndustry.findOneAndUpdate(
            {
                _id: companyIndustryId
            },
            payload,
            {
                new: true,
                runValidators: true
            }
        )

        if (companyIndustryId) {
            return res.status(201).json({
                code: 200,
                status: "OK",
                message: 'Success update company industry',
                data: companyIndustry
            });

        } else {
            return res.status(404).json({
                code: 404,
                status: "NOT FOUND",
                message: 'Id industry not found',
            });
        }


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

async function destroy(req, res, next) {

    try {

        let companyIndustryId = req.params.id;

        let companyIndustry = await CompanyIndustry.findOneAndDelete(
            {
                _id: companyIndustryId
            },
        )

        if (companyIndustry) {
            return res.status(200).json({
                code: 200,
                status: "OK",
                message: 'Success delete company industry',
                data: companyIndustry
            });

        } else {
            return res.status(404).json({
                code: 404,
                status: "NOT FOUND",
                message: 'Id company industry not found',
            });
        }

    } catch (err) {

        next(err)
    }

}


module.exports = {
    index,
    store,
    update,
    destroy
}