import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Building2, User, ArrowRight, CheckCircle2 } from 'lucide-react';

export function SignupPage() {
  const [selectedType, setSelectedType] = useState<'applicant' | 'employer'>('applicant');
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate(`/signup/${selectedType}`);
  };

  const benefits = {
    applicant: [
      'Find flexible shifts near you',
      'Get paid quickly',
      'Build your professional profile',
      'No fees for applicants'
    ],
    employer: [
      'Find reliable workers instantly',
      'Manage multiple locations',
      'Track attendance seamlessly',
      'Simple billing and payments'
    ]
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="rounded-3xl p-10 shadow-2xl overflow-hidden relative" style={{ backgroundColor: '#ffffff' }}>
        {/* Background Decor */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full opacity-5 pointer-events-none" style={{ backgroundColor: '#0D2B1A' }} />

        <div className="text-center mb-10 relative">
          <h1 className="text-4xl font-extrabold mb-3 tracking-tight" style={{ color: '#0D2B1A' }}>
            Join ShiftMatch
          </h1>
          <p className="text-gray-500 font-medium">Choose how you would like to use our platform</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Applicant Choice */}
          <button
            onClick={() => setSelectedType('applicant')}
            className={`flex flex-col text-left p-6 rounded-3xl border-2 transition-all duration-300 relative group overflow-hidden ${selectedType === 'applicant'
                ? 'shadow-xl scale-105'
                : 'hover:border-gray-300'
              }`}
            style={selectedType === 'applicant'
              ? { borderColor: '#C8F435', backgroundColor: '#F5F5ED' }
              : { borderColor: '#E0E0E0', backgroundColor: '#ffffff' }
            }
          >
            {selectedType === 'applicant' && (
              <div className="absolute top-4 right-4 animate-in zoom-in duration-300">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#0D2B1A' }} />
              </div>
            )}
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 ${selectedType === 'applicant' ? 'bg-white shadow-sm' : 'bg-gray-50'
              }`}>
              <User className="w-7 h-7" style={{ color: '#0D2B1A' }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#000000' }}>I am an Applicant</h3>
            <p className="text-sm text-gray-500 font-medium mb-6">I want to find shifts and work flexibly.</p>

            <ul className="space-y-3 mt-auto">
              {benefits.applicant.map((benefit, i) => (
                <li key={i} className="flex items-center gap-2 text-xs font-bold" style={{ color: '#0D2B1A' }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#C8F435' }} />
                  {benefit}
                </li>
              ))}
            </ul>
          </button>

          {/* Employer Choice */}
          <button
            onClick={() => setSelectedType('employer')}
            className={`flex flex-col text-left p-6 rounded-3xl border-2 transition-all duration-300 relative group overflow-hidden ${selectedType === 'employer'
                ? 'shadow-xl scale-105'
                : 'hover:border-gray-300'
              }`}
            style={selectedType === 'employer'
              ? { borderColor: '#C8F435', backgroundColor: '#F5F5ED' }
              : { borderColor: '#E0E0E0', backgroundColor: '#ffffff' }
            }
          >
            {selectedType === 'employer' && (
              <div className="absolute top-4 right-4 animate-in zoom-in duration-300">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#0D2B1A' }} />
              </div>
            )}
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 ${selectedType === 'employer' ? 'bg-white shadow-sm' : 'bg-gray-50'
              }`}>
              <Building2 className="w-7 h-7" style={{ color: '#0D2B1A' }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#000000' }}>I am an Employer</h3>
            <p className="text-sm text-gray-500 font-medium mb-6">I want to hire workers and manage staffing.</p>

            <ul className="space-y-3 mt-auto">
              {benefits.employer.map((benefit, i) => (
                <li key={i} className="flex items-center gap-2 text-xs font-bold" style={{ color: '#0D2B1A' }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#C8F435' }} />
                  {benefit}
                </li>
              ))}
            </ul>
          </button>
        </div>

        <button
          onClick={handleContinue}
          className="w-full py-4 text-white rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 hover:brightness-90 active:scale-95 shadow-lg text-lg group"
          style={{ backgroundColor: '#0D2B1A' }}
        >
          Continue to Signup
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>

        <p className="mt-8 text-center text-sm font-medium text-gray-500">
          Already have an account?{' '}
          <NavLink to="/login" className="font-extrabold hover:underline" style={{ color: '#0D2B1A' }}>
            Sign in
          </NavLink>
        </p>
      </div>
    </div>
  );
}
