import { useEffect } from 'react';

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, background: '#333', color: 'white', padding: '1rem', borderRadius: 4 }}>
      {message}
    </div>
  );
}
