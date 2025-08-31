import { Github, Twitter, Linkedin, Instagram } from "lucide-react";

interface LinkItem {
  label: string;
  href: string;
}

interface SocialItem {
  label: string;
  href: string;
  icon: JSX.Element;
}

interface FooterProps {
  companyName?: string;
  links?: LinkItem[];
  social?: SocialItem[];
  className?: string;
}

export default function Footer({
  companyName = "Room Bridge",
  links = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Contact", href: "/contact" },
  ],
  social = [],
  className = "",
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className={`bg-gradient-to-br from-cyan-900 to-blue-600 text-white ${className}`}>
      <div className="max-w-full px-16 mx-auto py-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div className="flex-1 min-w-0">
            <a href="/" className="inline-flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold">
                {companyName.split(" ").map(s => s[0]).slice(0,2).join("")}
              </div>
              <span className="text-4xl font-semibold">{companyName}</span>
            </a>
            <p className="mt-3 text-base text-gray-600 dark:text-gray-300 max-w-prose">
              Your Housing Partner for experience the bliss of living for experience the bliss of living for experience the bliss of living 
            </p>
          </div>


          <nav aria-label="footer" className="mt-4 flex-none">
            <ul className="flex flex-col md:flex-row md:space-x-8 space-y-3 md:space-y-0">
              <Github size={24} className="text-gray-600 dark:text-gray-300 hover:text-indigo-500" />
              <Twitter size={24} className="text-gray-600 dark:text-gray-300 hover:text-indigo-500" />
              <Linkedin size={24} className="text-gray-600 dark:text-gray-300 hover:text-indigo-500" />
              <Instagram size={24} className="text-gray-600 dark:text-gray-300 hover:text-indigo-500" />
            </ul>
          </nav>

          <div className="flex-1 md:flex-none">
            <div className="flex items-center gap-4">
              {social.length > 0 ? (
                social.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    aria-label={s.label}
                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {s.icon}
                  </a>
                ))
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400"></div>
              )}
            </div>

            <form className="mt-2 flex items-center max-w-md" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="footer-email" className="sr-only">Email</label>
              <input
                id="footer-email"
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 text-sm rounded-l-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-3 py-2 text-sm rounded-r-md bg-indigo-600 text-white hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 dark:border-gray-800 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">© {year} {companyName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
