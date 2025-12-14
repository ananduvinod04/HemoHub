import { Heart, Facebook, Instagram, Twitter } from "lucide-react";
import { useState } from "react";
import About from "./modals/About";
import Privacy from "./modals/Privacy";
import Contact from "./modals/Contact";

export default function Footer() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <>
      <footer className="w-full border-t bg-gray-50 dark:bg-gray-900">
        <div className="max-w-screen-2xl mx-auto px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-600" />
            <span className="text-lg font-semibold">Hemohub</span>
          </div>

          {/* Links */}
          <div className="flex gap-8 text-sm text-gray-700 dark:text-gray-300">
            <button onClick={() => setAboutOpen(true)} className="hover:text-red-600 transition">
              About
            </button>
            <button onClick={() => setContactOpen(true)} className="hover:text-red-600 transition">
              Contact
            </button>
            <button onClick={() => setPrivacyOpen(true)} className="hover:text-red-600 transition">
              Privacy
            </button>
          </div>

          {/* Social Icons */}
          <div className="flex gap-5">
            <Facebook className="w-5 h-5 hover:text-red-600 cursor-pointer" />
            <Instagram className="w-5 h-5 hover:text-red-600 cursor-pointer" />
            <Twitter className="w-5 h-5 hover:text-red-600 cursor-pointer" />
          </div>
        </div>
      </footer>

      {/* Modals */}
      <About open={aboutOpen} onOpenChange={setAboutOpen} />
      <Contact open={contactOpen} onOpenChange={setContactOpen} />
      <Privacy open={privacyOpen} onOpenChange={setPrivacyOpen} />
    </>
  );
}
