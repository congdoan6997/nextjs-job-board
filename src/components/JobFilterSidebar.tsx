import { JobFilterSchema, JobFilterValues } from "@/lib/validation";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { jobTypes } from "@/lib/job-types";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import FormSubmitButton from "./FormSubmitButton";
async function filterJobs(formData: FormData) {
  "use server";
  const values = Object.fromEntries(formData.entries());

  const { q, type, location, remote } = JobFilterSchema.parse(values);

  const searchParams = new URLSearchParams({
    ...(q && { q: q.trim() }),
    ...(type && { type }),
    ...(location && { location }),
    ...(remote && { remote: "true" }),
  });

  redirect(`/?${searchParams.toString()}`);
}

interface JobFilterProps {
  defaultValues: JobFilterValues;
}
const JobFilterSidebar = async ({ defaultValues }: JobFilterProps) => {
  const distinctLocations = (await prisma.job
    .findMany({
      where: { approved: true },
      select: { location: true },
      distinct: ["location"],
    })
    .then((locations) =>
      locations.map(({ location }) => location).filter(Boolean),
    )) as string[];
  //   console.log(distinctLocations);
  return (
    <aside className="p4 sticky top-0 h-fit rounded-lg border bg-background p-4 md:w-[260px]">
      <form action={filterJobs}>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              type="text"
              name="q"
              defaultValue={defaultValues.q}
              placeholder="Title, company, etc..."
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Type</Label>
            <Select name="type" defaultValue={defaultValues.type}>
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                {/* <SelectItem value="">All types</SelectItem> */}
                {jobTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Location</Label>
            <Select name="location" defaultValue={defaultValues.location}>
              <SelectTrigger>
                <SelectValue placeholder="All locations" />
              </SelectTrigger>
              <SelectContent>
                {distinctLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="remote"
              name="remote"
              defaultChecked={defaultValues.remote}
            />
            <Label htmlFor="remote">Remote jobs</Label>
          </div>
          <FormSubmitButton className="w-full">Filter jobs</FormSubmitButton>
        </div>
      </form>
    </aside>
  );
};

export default JobFilterSidebar;
