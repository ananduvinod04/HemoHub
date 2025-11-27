import { Heart, Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-gray-50 dark:bg-gray-900">
      <div className="max-w-screen-2xl mx-auto px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-600" />
          <span className="text-lg font-semibold">Hemohub</span>
        </div>

        {/* Links */}
        <div className="flex gap-8 text-sm text-gray-700 dark:text-gray-300">
          <a href="/" className="hover:text-red-600 transition">Home</a>
          <a href="/about" className="hover:text-red-600 transition">About</a>
          <a href="/contact" className="hover:text-red-600 transition">Contact</a>
          <a href="/privacy" className="hover:text-red-600 transition">Privacy</a>
        </div>

        {/* Social Icons */}
        <div className="flex gap-5">
          <Facebook className="w-5 h-5 hover:text-red-600 cursor-pointer" />
          <Instagram className="w-5 h-5 hover:text-red-600 cursor-pointer" />
          <Twitter className="w-5 h-5 hover:text-red-600 cursor-pointer" />
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-xs py-3 text-gray-600 dark:text-gray-300 border-t">
        © {new Date().getFullYear()} Hemohub • Blood Donation System
      </div>
    </footer>
  );
}
