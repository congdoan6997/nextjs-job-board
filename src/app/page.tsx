import Image from "next/image";
import prisma from "@/lib/prisma";
import JobListItem from "@/components/JobListItem";
export default async function Home() {
  const jobs = await prisma.job.findMany({
    where: {
      approved: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <main className="m-auto my-10 max-w-5xl space-y-10 px-3">
      <div className="space-y-5 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Developer Jobs
        </h1>
        <p className="text-muted-foreground">Find your next developer job</p>
      </div>

      <section>
        <div className="space-y-4">
          {jobs.map((job) => (
            <JobListItem job={job} key={job.slug} />
          ))}
        </div>
      </section>
    </main>
  );
}
