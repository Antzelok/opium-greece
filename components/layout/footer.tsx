import Link from "next/link";
import { IoIosMailUnread } from "react-icons/io";
import { FaInstagram } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "SHOP",
      links: [
        { label: "Men", href: "/men" },
        { label: "Women", href: "/women" },
        { label: "Niche", href: "/niche" },
        { label: "Best Sellers", href: "/best-sellers" },
        { label: "Discovery Box", href: "/discovery-box" },
      ],
    },
    {
      title: "INFO",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Stores", href: "/stores" },
        { label: "Shipping", href: "/shipping" },
        { label: "Returns", href: "/returns" },
      ],
    },
    {
      title: "LEGAL",
      links: [
        { label: "Terms & Conditions", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Cookie Policy", href: "/cookies" },
      ],
    },
  ];

  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t border-white/5">
      <div className="container mx-auto px-6">
        {/* Main Grid: 1 στήλη στο mobile, 2 στο tablet (md), 4 στο desktop (lg) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-serif tracking-[0.3em] text-[#C5A25D]">
              OPIUM
            </h2>
            <p className="text-neutral-400 text-md leading-relaxed max-w-xs font-light">
              Luxury made accessible. Extrait de Parfum with 40% oil
              concentration.
            </p>
            <div className="space-y-3">
              <a
                href="mailto:opiumgreece2021@gmail.com"
                className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors text-sm font-light"
              >
                <IoIosMailUnread className="h-5 w-5" />
                opiumgreece2021@gmail.com
              </a>
              <a
                href="https://instagram.com/opium.greece"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors text-sm font-light"
              >
                <FaInstagram className="h-5 w-5" />
                @opium.greece
              </a>
            </div>
          </div>

          {/* Links Sections: Χρησιμοποιούμε sub-grid για το mobile */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-1 lg:grid-cols-3 lg:col-span-3">
            {footerSections.map((section) => (
              <div key={section.title} className="space-y-6">
                <h3 className="text-[13px] font-bold tracking-[0.2em] text-neutral-200 uppercase">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-neutral-400 hover:text-white transition-colors text-sm font-light"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex justify-center items-center border-t  pt-8 gap-6">
          <p className="text-neutral-400 text-[11px] tracking-[0.3em] uppercase text-center md:text-left">
            © {currentYear} OPIUM GREECE. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
