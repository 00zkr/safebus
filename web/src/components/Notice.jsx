export default function Notice({ type = 'success', children }) {
  if (!children) return null;

  return <div className={`notice notice-${type}`}>{children}</div>;
}
