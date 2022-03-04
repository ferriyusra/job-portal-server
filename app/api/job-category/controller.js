const JobCategory = require("./model");


async function index(req, res, next) {
    try {

        let jobCategory = await JobCategory.find().select('-__v');
        return res.status(200).json({
            code: 200,
            status: "OK",
            message: 'Success get all job category',
            data: jobCategory
        });
    } catch (err) {
        next(err)
    }
}

async function store(req, res, next) {

    try {

        let payload = req.body;

        let jobCategory = new JobCategory(payload);

        await jobCategory.save();

        return res.status(201).json({
            code: 200,
            status: "OK",
            message: 'Success create job category',
            data: jobCategory
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

        let jobCategoryId = req.params.id;


        let jobCategory = await JobCategory.findOneAndUpdate(
            {
                _id: jobCategoryId
            },
            payload,
            {
                new: true,
                runValidators: true
            }
        )

        if (jobCategory) {
            return res.status(201).json({
                code: 200,
                status: "OK",
                message: 'Success update job category',
                data: jobCategory
            });

        } else {
            return res.status(404).json({
                code: 404,
                status: "NOT FOUND",
                message: 'Id job category not found',
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

        let jobCategoryId = req.params.id;

        let jobCategory = await JobCategory.findOneAndDelete(
            {
                _id: jobCategoryId
            },
        )

        if (jobCategory) {
            return res.status(200).json({
                code: 200,
                status: "OK",
                message: 'Success delete job category',
                data: jobCategory
            });

        } else {
            return res.status(404).json({
                code: 404,
                status: "NOT FOUND",
                message: 'Id job category not found',
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