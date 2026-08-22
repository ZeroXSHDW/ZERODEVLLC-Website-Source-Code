import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-black/50 backdrop-blur-md text-white p-4 text-xs flex justify-between items-center z-50">
      <div>
        <p>&copy; 2026 ZeroDevLLC. Registered in Ireland.</p>
        <p>
          Registered Office: [Insert Irish Address] | CRO: [Insert CRO Number]
        </p>
      </div>
      <div className="flex gap-4">
        <Link href="/privacy" className="hover:underline">
          Privacy Policy
        </Link>
        <Link href="/terms" className="hover:underline">
          Terms of Service
        </Link>
        <Link href="/disclosure" className="hover:underline">
          Disclosure
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
