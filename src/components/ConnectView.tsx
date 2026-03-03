import React from 'react';
import { MapPin, Phone, Mail, Globe, Send, MessageSquare, Map as MapIcon } from 'lucide-react';

export function ConnectView() {
  const schoolAddress = "Primary School Nakeebpur Second, Nakeebpur, Uttar Pradesh, India";
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            <div className="space-y-6">
              <ContactItem 
                icon={<MapPin className="text-emerald-600" />} 
                label="Our Location" 
                value={schoolAddress} 
                action={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(schoolAddress)}`, '_blank')}
              />
              <ContactItem 
                icon={<Phone className="text-blue-600" />} 
                label="Phone Number" 
                value="+91 12345 67890" 
                action={() => window.location.href = 'tel:+911234567890'}
              />
              <ContactItem 
                icon={<Mail className="text-orange-600" />} 
                label="Email Address" 
                value="info@nakeebpursecond.edu.in" 
                action={() => window.location.href = 'mailto:info@nakeebpursecond.edu.in'}
              />
            </div>
          </div>

          <div className="bg-emerald-600 p-8 rounded-3xl text-white shadow-xl shadow-emerald-600/20">
            <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
            <p className="text-emerald-50 text-sm mb-6 leading-relaxed">
              Stay updated with our latest news, events, and academic achievements through our social media channels.
            </p>
            <div className="flex gap-4">
              <SocialBtn icon={<Globe size={20} />} label="Website" />
              <SocialBtn icon={<Send size={20} />} label="Telegram" />
              <SocialBtn icon={<MessageSquare size={20} />} label="WhatsApp" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-black/5 shadow-sm h-[500px] flex flex-col">
          <div className="p-4 flex justify-between items-center">
            <h4 className="font-bold flex items-center gap-2">
              <MapIcon size={18} className="text-emerald-600" />
              Find Us on Map
            </h4>
            <button 
              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(schoolAddress)}`, '_blank')}
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              Open in Google Maps
            </button>
          </div>
          <div className="flex-1 rounded-2xl overflow-hidden bg-black/5 relative">
            <iframe 
              src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&q=${encodeURIComponent(schoolAddress)}`}
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            ></iframe>
            {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
              <div className="absolute inset-0 bg-black/5 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
                <MapPin size={48} className="text-black/20 mb-4" />
                <p className="text-sm font-bold text-black/40 mb-2">Google Maps Embed</p>
                <p className="text-xs text-black/30 mb-6">Please configure GOOGLE_MAPS_API_KEY in secrets to see the interactive map.</p>
                <button 
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(schoolAddress)}`, '_blank')}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20"
                >
                  View on Google Maps
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactItem({ icon, label, value, action }: { icon: React.ReactNode, label: string, value: string, action: () => void }) {
  return (
    <div className="flex gap-4 group cursor-pointer" onClick={action}>
      <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center transition-all group-hover:bg-emerald-50">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-black/40">{label}</p>
        <p className="text-sm font-bold text-black/80 group-hover:text-emerald-600 transition-colors">{value}</p>
      </div>
    </div>
  );
}

function SocialBtn({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all border border-white/10">
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}
