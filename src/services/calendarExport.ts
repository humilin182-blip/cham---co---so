import { Match } from '../types/football';

/**
 * Formats a Date object to RFC 5545 iCalendar UTC string format: YYYYMMDDTHHMMSSZ
 */
function formatDateToICS(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Generates an iCalendar (.ics) string for a football match
 */
export function generateICSContent(match: Match): string {
  const startDate = new Date(match.startTime);
  const endDate = new Date(startDate.getTime() + 105 * 60 * 1000); // ~105 mins including half-time

  const summary = `⚽ ${match.homeTeam.name} vs ${match.awayTeam.name}`;
  const description = `Trận đấu bóng đá trực tiếp ${match.round}: ${match.homeTeam.name} gặp ${match.awayTeam.name} tại SVĐ ${match.stadium}. Theo dõi trực tiếp và tỉ số tức thì trên CyberPitch Live.`;
  const location = `${match.stadium}, ${match.city}`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CyberPitch Live//Football Fixture Sync//VI',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:match-${match.id}@cyberpitch.live`,
    `DTSTAMP:${formatDateToICS(new Date())}`,
    `DTSTART:${formatDateToICS(startDate)}`,
    `DTEND:${formatDateToICS(endDate)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Trận đấu sắp diễn ra trong 15 phút nữa!',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

/**
 * Downloads the .ics file directly to the user device
 */
export function downloadMatchICS(match: Match): void {
  const icsContent = generateICSContent(match);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${match.homeTeam.shortName}-vs-${match.awayTeam.shortName}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Creates a direct Google Calendar add event URL
 */
export function getGoogleCalendarUrl(match: Match): string {
  const startDate = new Date(match.startTime);
  const endDate = new Date(startDate.getTime() + 105 * 60 * 1000);

  const startFormatted = formatDateToICS(startDate);
  const endFormatted = formatDateToICS(endDate);

  const title = encodeURIComponent(`⚽ ${match.homeTeam.name} vs ${match.awayTeam.name} [CyberPitch]`);
  const details = encodeURIComponent(
    `Trận đấu: ${match.homeTeam.name} vs ${match.awayTeam.name}\nVòng đấu: ${match.round}\nSân vận động: ${match.stadium}, ${match.city}\nCập nhật tỉ số trực tiếp trên CyberPitch Live.`
  );
  const location = encodeURIComponent(`${match.stadium}, ${match.city}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startFormatted}/${endFormatted}&details=${details}&location=${location}`;
}
