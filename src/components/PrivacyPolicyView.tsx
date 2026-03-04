import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export function PrivacyPolicyView() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-black/5">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
            <Shield size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight">Privacy Policy</h2>
            <p className="text-black/40">Last updated: March 2026</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="text-blue-600" size={20} />
              <h3 className="text-xl font-bold m-0">Introduction</h3>
            </div>
            <p className="text-black/60 leading-relaxed">
              At Primary School Nakeebpur 2nd, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information when you use our school management application.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="text-blue-600" size={20} />
              <h3 className="text-xl font-bold m-0">Information We Collect</h3>
            </div>
            <ul className="list-disc pl-6 space-y-2 text-black/60">
              <li><strong>Student Data:</strong> Names, grades, roll numbers, and academic records.</li>
              <li><strong>Staff Data:</strong> Names, roles, and contact information for school administration.</li>
              <li><strong>Admission Data:</strong> Information provided during the online admission process.</li>
              <li><strong>Usage Data:</strong> Basic information about how you interact with the app to improve performance.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="text-blue-600" size={20} />
              <h3 className="text-xl font-bold m-0">How We Use Your Data</h3>
            </div>
            <p className="text-black/60 leading-relaxed">
              Your data is used solely for educational and administrative purposes within Primary School Nakeebpur 2nd. We do not sell or share your personal information with third-party advertisers.
            </p>
          </section>

          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <h4 className="text-blue-800 font-bold mb-2">Data Security</h4>
            <p className="text-blue-700/80 text-sm m-0">
              We implement industry-standard security measures to protect your data from unauthorized access or disclosure. All administrative access is password-protected.
            </p>
          </div>

          <section>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <p className="text-black/60 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact the school administration at:
              <br />
              <strong>Email:</strong> admin@nakeebpurschool.edu
              <br />
              <strong>Address:</strong> Nakeebpur, Uttar Pradesh, India
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
