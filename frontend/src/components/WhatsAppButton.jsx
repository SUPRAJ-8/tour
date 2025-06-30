import { FaWhatsapp } from 'react-icons/fa';
import './WhatsAppButton.css';

export default function WhatsAppButton() {
  const phone = '+9779840007310';
  const message = 'Hello, I would like to inquire about your tours.';
  const link = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={link}
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={28} />
    </a>
  );
}
