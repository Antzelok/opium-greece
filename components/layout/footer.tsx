import Link from "next/link";
import { IoIosMailUnread } from "react-icons/io";
import { FaInstagram, FaFacebookF, FaTiktok, FaGoogle } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "SHOP",
      links: [
        { label: "Men", href: "/men" },
        { label: "Women", href: "/women" },
        { label: "Niche", href: "/niche" },
        { label: "Unisex", href: "/unisex" },
        { label: "Mystery Box", href: "/mystery-box" },
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
    <footer className="bg-black text-white pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand & Socials Section */}
          <div className="space-y-8">
            <h2 className="text-3xl font-serif tracking-[0.2em] text-[#C5A25D]">
              OPIUM
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-xs font-light">
              Luxury made accessible. Extrait de Parfum with 40% oil
              concentration. The essence of unforgettable scent.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              {[
                {
                  icon: FaInstagram,
                  href: "https://instagram.com/opium.greece",
                },
                { icon: FaFacebookF, href: "https://www.facebook.com/Opiumgr" },
                {
                  icon: FaTiktok,
                  href: "https://www.tiktok.com/@opium.greece",
                },
                {
                  icon: FaGoogle,
                  href: "https://www.google.com/search?q=opium+greece&oq=&sourceid=chrome&ie=UTF-8",
                },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 flex items-center justify-center rounded-full border border-white/10 text-neutral-400 hover:border-[#C5A25D] hover:text-[#C5A25D] transition-all duration-300"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            {/* Email Contact */}
            <a
              href="mailto:opiumgreece2021@gmail.com"
              className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors text-sm font-light pt-4"
            >
              <IoIosMailUnread className="h-5 w-5 text-[#C5A25D]" />
              opiumgreece2021@gmail.com
            </a>
          </div>

          {/* Links Sections */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-1 lg:grid-cols-3 lg:col-span-3">
            {footerSections.map((section) => (
              <div key={section.title} className="space-y-6">
                <h3 className="text-[11px] font-bold tracking-[0.25em] text-white uppercase">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-neutral-500 hover:text-[#C5A25D] transition-all text-xs font-light uppercase tracking-wide"
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
        <div className="flex flex-col md:flex-row justify-center items-center border-t border-white/5 pt-10 gap-6">
          <p className="text-neutral-500 text-[11px] tracking-[0.3em]">
            © {currentYear} OPIUM GREECE. ALL RIGHTS RESERVED.
          </p>
        </div>
        <div className="flex justify-center items-center gap-4">
          <Link
            href="/privacy"
            className="text-neutral-500 hover:text-white text-[10px] tracking-[0.2em] transition-colors"
          >
            PRIVACY
          </Link>
          <Link
            href="/terms"
            className="text-neutral-500 hover:text-white text-[10px] tracking-[0.2em] transition-colors"
          >
            TERMS
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
