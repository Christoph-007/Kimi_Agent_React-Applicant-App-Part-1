import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Building2, User, ArrowRight, CheckCircle2 } from 'lucide-react';

export function SignupPage() {
  const [selectedType, setSelectedType] = useState<'applicant' | 'employer'>('applicant');
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate(`/register/${selectedType}`);
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
    <div className="animate-fade-up">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-forest-900 tracking-tightest mb-4">
          Join ShiftMatch
        </h1>
        <p className="text-gray-500 font-medium max-w-sm mx-auto">Select your account type to get started with the best shifts and workers.</p>
      </div>

      {/* Selection Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Applicant Choice */}
        <button
          onClick={() => setSelectedType('applicant')}
          className={`flex flex-col text-left p-8 rounded-[2rem] border-2 transition-all duration-300 relative group overflow-hidden ${selectedType === 'applicant'
              ? 'border-forest-900 bg-cream-100 shadow-xl'
              : 'border-gray-100 bg-white hover:border-forest-200 hover:shadow-card-hover'
            }`}
        >
          {selectedType === 'applicant' && (
            <div className="absolute top-6 right-6 animate-fade-in">
              <div className="bg-forest-900 rounded-full p-1 shadow-lg">
                <CheckCircle2 className="w-5 h-5 text-lime" />
              </div>
            </div>
          )}
          
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${selectedType === 'applicant' ? 'bg-white shadow-md' : 'bg-gray-50 border border-gray-100'
            }`}>
            <User className={`w-8 h-8 transition-colors ${selectedType === 'applicant' ? 'text-forest-900' : 'text-gray-400'}`} />
          </div>
          
          <h3 className="text-xl font-extrabold text-forest-900 mb-2">I am an Applicant</h3>
          <p className="text-sm text-gray-500 mb-6 font-medium leading-relaxed">I want to find flexible shifts and build my professional profile.</p>

          <div className="space-y-3 mt-auto">
            {benefits.applicant.map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-gray-700 font-semibold">
                <div className="w-2 h-2 rounded-full flex-shrink-0 bg-lime shadow-[0_0_8px_rgba(200,244,53,0.5)]" />
                {benefit}
              </div>
            ))}
          </div>
        </button>

        {/* Employer Choice */}
        <button
          onClick={() => setSelectedType('employer')}
          className={`flex flex-col text-left p-8 rounded-[2rem] border-2 transition-all duration-300 relative group overflow-hidden ${selectedType === 'employer'
              ? 'border-forest-900 bg-cream-100 shadow-xl'
              : 'border-gray-100 bg-white hover:border-forest-200 hover:shadow-card-hover'
            }`}
        >
          {selectedType === 'employer' && (
            <div className="absolute top-6 right-6 animate-fade-in">
              <div className="bg-forest-900 rounded-full p-1 shadow-lg">
                <CheckCircle2 className="w-5 h-5 text-lime" />
              </div>
            </div>
          )}
          
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3 ${selectedType === 'employer' ? 'bg-white shadow-md' : 'bg-gray-50 border border-gray-100'
            }`}>
            <Building2 className={`w-8 h-8 transition-colors ${selectedType === 'employer' ? 'text-forest-900' : 'text-gray-400'}`} />
          </div>
          
          <h3 className="text-xl font-extrabold text-forest-900 mb-2">I am an Employer</h3>
          <p className="text-sm text-gray-500 mb-6 font-medium leading-relaxed">I want to hire reliable workers and manage staffing efficiently.</p>

          <div className="space-y-3 mt-auto">
            {benefits.employer.map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-gray-700 font-semibold">
                <div className="w-2 h-2 rounded-full flex-shrink-0 bg-lime shadow-[0_0_8px_rgba(200,244,53,0.5)]" />
                {benefit}
              </div>
            ))}
          </div>
        </button>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        className="btn-primary w-full py-4.5 text-lg shadow-btn hover:scale-[1.01] active:scale-[0.98]"
      >
        Get Started as {selectedType === 'applicant' ? 'Applicant' : 'Employer'}
        <ArrowRight className="w-5 h-5" />
      </button>

      {/* Sign In Link */}
      <p className="mt-8 text-center text-sm font-medium text-gray-500">
        Already part of the community?{' '}
        <NavLink to="/login" className="font-extrabold text-forest-900 hover:text-forest-700 hover:underline transition-colors">
          Sign In Here
        </NavLink>
      </p>
    </div>
  );
}
