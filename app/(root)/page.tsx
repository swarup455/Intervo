import InterviewCard from "@/components/InterviewCard"
import { Button } from "@/components/ui/button"
import { getCurretUser } from "@/lib/actions/auth.actions"
import { getInterviewsByUserId, getLatestInterviews } from "@/lib/actions/general.action"

import Image from "next/image"
import Link from "next/link"

const page = async () => {
  const user = await getCurretUser();

  const [userInterviews, latestInterviews] = await Promise.all([
    await getInterviewsByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! })
  ]);

  const hasPastInterviews = userInterviews != undefined && userInterviews?.length > 0;
  const hasUpcomingInterviews = latestInterviews != undefined && latestInterviews?.length > 0;

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>
            Practice With AI-Powered Mock Interviews & Feedback
          </h2>
          <p className="text-lg">
            You will get real interview questions & instant feedback
          </p>
          <Button asChild className="btn-primary max-sm:w-full" >
            <Link href="/interview">
              Start an Interview
            </Link>
          </Button>
        </div>
        <Image src="/coding.png" alt="robo-dude" width={300} height={300} className="max-sm:hidden" />
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>
        <div className="interviews-section">
          {
            hasPastInterviews ? (
              userInterviews?.map((interview) => (
                <InterviewCard {...interview} key={interview.id} />
              ))
            ) : (
              <p>You have not taken any interviews yet</p>
            )
          }
        </div>
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2>Take an Interview</h2>
        <div className="interviews-section">
          {
            hasUpcomingInterviews ? (
              latestInterviews?.map((interview) => (
                <InterviewCard {...interview} key={interview.id} />
              ))
            ) : (
              <p>There are no new interviews available</p>
            )
          }
        </div>
      </section>
    </>
  )
}

export default page