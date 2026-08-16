import { NextResponse } from 'next/server';
import { db } from '@/db/connect';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

const normalizeGoogleEvent = (event: any) => {
  const startDate = event.start?.dateTime || event.start?.date;
  const endDate = event.end?.dateTime || event.end?.date;

  return {
    id: `google-${event.id}`,
    title: event.summary || 'Google Event',
    start: startDate ? new Date(startDate).toISOString() : new Date().toISOString(),
    end: endDate ? new Date(endDate).toISOString() : null,
    allDay: !event.start?.dateTime,
    notes: event.description || event.location || '',
    color: '#4285F4',
    source: 'google',
  };
};

async function fetchGoogleCalendarEvents(accessToken: string) {
  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events?singleEvents=true&orderBy=startTime',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch Google Calendar events');
  }

  const data = await response.json();
  return (data.items || []).map(normalizeGoogleEvent);
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const localCalendar = await db.calendar.findUnique({
      where: { userId: parseInt(session.user.id) },
      include: { events: true },
    });

    if (!localCalendar) {
      const newCalendar = await db.calendar.create({
        data: {
          userId: parseInt(session.user.id),
          title: 'My Calendar',
        },
      });

      if (session.provider === 'google' && session.accessToken) {
        const googleEvents = await fetchGoogleCalendarEvents(session.accessToken);
        return NextResponse.json({ events: googleEvents });
      }

      return NextResponse.json({ events: [] });
    }

    const localEvents = localCalendar.events.map((event) => ({
      id: `${event.id}`,
      title: event.title,
      start: new Date(event.start).toISOString(),
      end: event.end ? new Date(event.end).toISOString() : null,
      allDay: event.allDay,
      notes: event.notes || '',
      color: event.color || '#3788d8',
      source: 'local',
    }));

    if (session.provider === 'google' && session.accessToken) {
      const googleEvents = await fetchGoogleCalendarEvents(session.accessToken);
      return NextResponse.json({ events: [...localEvents, ...googleEvents] });
    }

    return NextResponse.json({ events: localEvents });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, start, end, allDay, notes, color } = body;

    const calendar = await db.calendar.findUnique({
      where: { userId: parseInt(session.user.id) },
    });

    if (!calendar) {
      return NextResponse.json(
        { error: 'Calendar not found' },
        { status: 404 }
      );
    }

    const event = await db.event.create({
      data: {
        title,
        start: new Date(start),
        end: end ? new Date(end) : null,
        allDay,
        notes,
        calendarId: calendar.id,
        color: color || '#3788d8',
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
