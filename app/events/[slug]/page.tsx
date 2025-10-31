import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import { getSimilarEventsbySlug } from "@/lib/actions/event.actions";
import { cacheLife } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({ icon, alt, label }: { icon: string, alt: string, label: string }) => (
    <div className="flex-row-gap-2 items-center">
        <Image src={icon} alt={alt} width={17} height={17} />
        <span>{label}</span>
    </div>
);

const EventAgenda = ({ agenda }: { agenda: string[] }) => (
    <div className="agenda">
        <h2>Event Agenda</h2>
        <ul>
            {agenda.map((item: string, index: number) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
    </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
    <div className="tags flex-row-gap-2 flex-wrap">
        {tags.map((tag: string, index: number) => (
            <div key={index} className="pill font-semibold">{tag}</div>
        ))}
    </div>
);

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }>}) => {  

  "use cache"  ;
  cacheLife("hours")
  const { slug } = await params;  

  const response = await fetch(`${BASE_URL}/api/events/${slug}`);
  const { event } = await response.json();
  if(!event) return notFound();

  const bookings = 10

  const similarEvents = await getSimilarEventsbySlug({ slug });

  return (
    <section id="event">
        <div className="header">
            <h1>Event Description</h1>
            <p>{event.description}</p>
        </div>

        <div className="details">
            {/* Left Section */}
            <div className="content">
                <Image src={event.image} alt={event.title} className="banner" width={800} height={800} />

                <section className="flex-col-gap-2">
                    <h2>Overview</h2>
                    <p>{event.overview}</p>
                </section>

                <section className="flex-col-gap-2">
                    <h2>Event Details</h2>
                    <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={event.date} />
                    <EventDetailItem icon="/icons/clock.svg" alt="clock" label={event.time} />
                    <EventDetailItem icon="/icons/pin.svg" alt="pin" label={event.location} />
                    <EventDetailItem icon="/icons/mode.svg" alt="mode" label={event.mode} />
                    <EventDetailItem icon="/icons/audience.svg" alt="audience" label={event.audience} />
                </section>

                <EventAgenda agenda={event.agenda} />

                <section className="flex-col-gap-2">
                    <h2>About the Organizer</h2>
                    <p>{event.organizer}</p>
                </section>

                <EventTags tags={event.tags} />
                
            </div>

            {/* Right Section */}
            <aside className="booking">
                <div className="signup-card">
                    <h2>Book Your Spot</h2>
                    {bookings > 0 ? (
                        <p className="text-sm">Join {bookings} people who have already booked their spot!</p>
                    ) : (
                        <p className="text-sm">Be the first to book your spot!</p>
                    )}
                    <BookEvent eventId={event._id} slug={event.slug} />
                </div>
            </aside>
        </div>

        <div className="flex-col-gap-4 w-full pt-10">
            <h2>Similar Events</h2>
            <div className="events">
                {similarEvents.length > 0 && similarEvents.map((similarEvent: IEvent) => (
                    <EventCard key={similarEvent.title} {...similarEvent} />
                ))}
            </div>
        </div>
    </section>
  )
}

export default EventDetailsPage