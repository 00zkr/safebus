const labels = {
  departure: 'Departure',
  near_stop: 'Near Stop',
  arrival: 'Arrival',
  delay: 'Delay'
};

export default function NotificationBadge({ type }) {
  return <span className={`notification-badge notification-${type}`}>{labels[type] || type}</span>;
}
