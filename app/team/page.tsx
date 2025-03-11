import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { teamHeads } from "@/lib/team-heads"

export default function TeamPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-card py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl animate-slide-up">
              <span className="heading-gradient animate-glow">Our Team</span>
            </h1>
            <p
              className="mb-0 text-lg text-muted-foreground md:text-xl animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              Meet the dedicated individuals who make ACM BITS Pilani Hyderabad Chapter possible.
            </p>
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="section-padding">
        <div className="container">
          <h2 className="mb-10 text-center text-3xl font-bold blue-accent inline-block animate-slide-up">
            Chapter Leadership
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger-animation">
            {teamHeads.map((member, index) => (
              <Card key={index} className="overflow-hidden hover-lift hover-glow animate-fade-in">
                <div className="aspect-square relative">
                  <Image
                    src={member.image || "/placeholder.svg?height=300&width=300"}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="mb-1 text-xl font-bold">{member.name}</h3>
                  <p className="text-muted-foreground">{member.designation}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section className="section-padding bg-muted">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl animate-slide-up">Get Involved</h2>
            <p className="mb-8 text-muted-foreground animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Interested in collaborating with the ACM BITS Pilani Hyderabad Chapter? We're always looking for
              passionate individuals to work with us.
            </p>
            <div className="rounded-lg bg-card p-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <h3 className="mb-4 text-xl font-semibold">How to Get Involved</h3>
              <ul className="mb-6 space-y-2 text-left">
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span>Attend our orientation sessions at the beginning of each semester</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span>Participate actively in our events and workshops</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span>Volunteer for event organization and management</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span>Collaborate on technical projects and research</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

