import { JobFilterValues } from "@/lib/validation";
import { Prisma } from "@prisma/client";
import JobListItem from "./JobListItem";

interface JobResultsProps {
  filterValues: JobFilterValues;
}

const JobResults = async ({
  filterValues: { q, type, location, remote },
}: JobResultsProps) => {
  const searchString = q
    ?.split(" ")
    .filter((word) => word.length > 0)
    .join(" & ");

  const searchFilter: Prisma.JobWhereInput = searchString
    ? {
        OR: [
          { title: { search: searchString } },
          { companyName: { search: searchString } },
          { type: { search: searchString } },
          { locationType: { search: searchString } },
          { location: { search: searchString } },
        ],
      }
    : {};

  const where: Prisma.JobWhereInput = {
    AND: [
      searchFilter,
      type ? { type: { equals: type } } : {},
      location ? { location: { equals: location } } : {},
      remote ? { locationType: { equals: "Remote" } } : {},
      { approved: true },
    ],
  };

  const jobs = await prisma?.job.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  if (!jobs || jobs.length === 0)
    return <p className="m-auto text-center">No jobs found</p>;
  //   console.log(jobs);
  return (
    <div className="flex-grow space-y-4">
      {jobs.map((job) => (
        <JobListItem key={job.id} job={job} />
      ))}
    </div>
  );
};

export default JobResults;
