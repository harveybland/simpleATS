const core = require('../core/core');
const schemas = require('../core/schemas/schemas');


// Gets all applications for a jobid
core.app.get('/api/applications/:jobid', async function (req, resp) {
    try {
        schemas.ApplicantsModel.find({ jobid: req.params.jobid }).then(result => {
            resp.status(200).json(result);
        })
        .catch(error => {
            resp.status('200').json('error');
        })
    }
    catch {
        resp.status('200').json('error')
    }
});


// apply for a job
core.app.post('/api/apply/:jobid', async function (req, resp) {
    try {
        schemas.ApplicantsModel.create(req.body)
            .then(result => {
                resp.status(200).json(result);
            })
            .catch(error => {
                resp.status('200').json('error');
            })
    }
    catch {
        resp.status('200').json('error')
    }
});


//Applicant status
  core.app.get('/api/applicantStatus/:jobid', async function (req, resp) {
    try {
      const applicantStatus = await schemas.ApplicantsModel.aggregate([
        {
          $match:
          {
            jobid: core.mongoose.Types.ObjectId(req.params.jobid)
          }
        },
        { $lookup: 
            {
                from: 'applicantStatus',
                localField: 'applicationStatusId',
                foreignField: '_id',
                as: 'applicantStatus'
            }
            },
            { $project: {
                firstname: 1,
                applicationStatus: { "$arrayElemAt": [ "$applicantStatus.status", 0] }
            }}
      ]);
      resp.status(200).json(applicantStatus);
    }
    catch {
      resp.status('404').json('error')
    }
  });