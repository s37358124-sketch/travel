import React from "react";
import { 
  IconBrandFacebook, 
  IconBrandTwitter, 
  IconBrandLinkedin, 
  IconBrandInstagram,
  IconGlobe
} from "@tabler/icons-react";

export default function Footer() {
  return (
    <footer className="bg-midnight text-white py-16 w-full">
      <div className="w-full px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Support Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-3 text-white/80">
              <li><a href="#help" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#support" className="hover:text-white transition-colors">Contact Support</a></li>
              <li><a href="#documentation" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#training" className="hover:text-white transition-colors">Training</a></li>
              <li><a href="#api" className="hover:text-white transition-colors">API Reference</a></li>
              <li><a href="#security" className="hover:text-white transition-colors">Security</a></li>
            </ul>
          </div>
          {/* Hosting Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Hosting</h4>
            <ul className="space-y-3 text-white/80">
              <li><a href="#features" className="hover:text-white transition-colors">Property Management</a></li>
              <li><a href="#restaurant" className="hover:text-white transition-colors">Restaurant Management</a></li>
              <li><a href="#automation" className="hover:text-white transition-colors">Automation Tools</a></li>
              <li><a href="#analytics" className="hover:text-white transition-colors">Analytics Dashboard</a></li>
              <li><a href="#resources" className="hover:text-white transition-colors">Hosting Resources</a></li>
              <li><a href="#community" className="hover:text-white transition-colors">Community Forum</a></li>
              <li><a href="#responsibly" className="hover:text-white transition-colors">Hosting Responsibly</a></li>
            </ul>
          </div>
          {/* Traavii Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Traavii</h4>
            <ul className="space-y-3 text-white/80">
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#careers" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#newsroom" className="hover:text-white transition-colors">Newsroom</a></li>
              <li><a href="#investors" className="hover:text-white transition-colors">Investors</a></li>
              <li><a href="#partners" className="hover:text-white transition-colors">Partners</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-pickled-bluewood pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between w-full">
            {/* Left side - Copyright and Legal */}
            <div className="text-santas-gray text-center md:text-left mb-4 md:mb-0">
              <p>&copy; 2024 Traavii. All rights reserved.</p>
              <div className="flex items-center space-x-4 mt-2 justify-center md:justify-start">
                <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                <span>•</span>
                <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
                <span>•</span>
                <a href="#sitemap" className="hover:text-white transition-colors">Sitemap</a>
                <span>•</span>
                <a href="#company" className="hover:text-white transition-colors">Company details</a>
              </div>
            </div>
            
            {/* Right side - Language, Currency, Social */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-santas-gray">
                <IconGlobe className="h-4 w-4" />
                <span>English (US)</span>
              </div>
              <div className="flex items-center space-x-2 text-santas-gray">
                <span>$</span>
                <span>USD</span>
              </div>
              <div className="flex items-center space-x-4">
                <a 
                  href="#" 
                  className="w-10 h-10 bg-pickled-bluewood rounded-full flex items-center justify-center hover:bg-comet transition-all duration-300"
                >
                  <IconBrandFacebook className="h-5 w-5 text-white" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-pickled-bluewood rounded-full flex items-center justify-center hover:bg-comet transition-all duration-300"
                >
                  <IconBrandTwitter className="h-5 w-5 text-white" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-pickled-bluewood rounded-full flex items-center justify-center hover:bg-comet transition-all duration-300"
                >
                  <IconBrandLinkedin className="h-5 w-5 text-white" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-pickled-bluewood rounded-full flex items-center justify-center hover:bg-comet transition-all duration-300"
                >
                  <IconBrandInstagram className="h-5 w-5 text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}