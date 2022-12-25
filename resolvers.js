import { Company, Job } from "./db.js";

function rejectIf(condition) {
  if (condition) {
    throw new Error("Unauthorized!");
  }
}
function notFound(condition) {
  if (condition) {
    throw new Error("Not found!");
  }
}

export const resolvers = {
  Query: {
    job: (_root, { id }) => Job.findById(id),
    jobs: () => Job.findAll(),
    company: (_root, { id }) => Company.findById(id),
  },
  Mutation: {
    createJob: (_root, { input }, { user }) => {
      console.log("user", user);

      rejectIf(!user);
      return Job.create({ ...input, companyId: user.companyId });
    },
    deleteJob: async (_root, { id }, { user }) => {
      rejectIf(!user);
      const job = await Job.findById(id);
      notFound(!job);
      rejectIf(job.companyId !== user.companyId);
      return Job.delete(id);
    },
    updateJob: async (_root, { input }, { user }) => {
      rejectIf(!user);
      const job = await Job.findById(input.id);
      console.log("job", job);
      notFound(!job);
      rejectIf(job.companyId !== user.companyId);
      return Job.update({ ...input, companyId: user.companyId });
    },
  },
  Company: {
    jobs: (company) => Job.findAll((job) => job.companyId === company.id),
  },
  Job: {
    company: (job) => Company.findById(job.companyId),
  },
};
