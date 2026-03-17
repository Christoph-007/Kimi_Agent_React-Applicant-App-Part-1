import { NavLink } from 'react-router-dom';
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Search
} from 'lucide-react';
import { useState } from 'react';

// Hero Section
function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const categories = ['All Categories', 'Food Service', 'Retail', 'Logistics', 'Healthcare', 'Hospitality'];

  return (
    <section className="relative bg-forest-900 min-h-[600px] flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-lime rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-lime rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Find Your Perfect
          <span className="text-lime"> Shift Job</span>
          <br />Today
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Connect with top employers looking for flexible workers. Browse thousands of shift-based jobs in food service, retail, logistics, and more.
        </p>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto bg-white rounded-full p-2 flex flex-col sm:flex-row gap-2 shadow-xl">
          <div className="flex-1 flex items-center px-4 py-2">
            <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search jobs, skills, or companies..."
              className="flex-1 outline-none text-gray-700 placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <NavLink
            to="/jobs"
            className="bg-lime text-forest-900 px-8 py-3 rounded-full font-semibold hover:bg-lime-400 transition-colors flex items-center justify-center gap-2"
          >
            Search
            <ArrowRight className="w-4 h-4" />
          </NavLink>
        </div>


      </div>
    </section>
  );
}

// Stats Section
function StatsSection() {
  const stats = [
    { value: '45k+', label: 'Active Job Seekers', description: 'Find your next opportunity' },
    { value: '15min+', label: 'Quick Application', description: 'Apply in minutes, not hours' },
    { value: '2000+', label: 'Partner Employers', description: 'Top companies hiring now' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-forest-900 mb-2">{stat.value}</div>
              <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
              <div className="text-gray-500">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorksSection() {
  const steps = [
    {
      number: '1',
      title: 'Create Your Account',
      description: 'Sign up in minutes with your basic information. Set your preferences for job types, locations, and availability.',
    },
    {
      number: '2',
      title: 'Complete Your Profile',
      description: 'Add your skills, experience, and upload your resume. A complete profile increases your chances of getting hired.',
    },
    {
      number: '3',
      title: 'Apply & Get Hired',
      description: 'Browse jobs, apply with one click, and start working. Get paid for every shift you complete.',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-forest-900 mb-4">
            Get Things Done with Minimal Effort
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Our platform makes it easy to find flexible work that fits your schedule
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-shadow h-full">
                <div className="w-12 h-12 bg-forest-100 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-forest-700">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-8 h-8 text-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      text: "The career page we've built in ShiftMatch gives candidates a great first impression of the company.",
      author: 'Aminul Islam',
      role: 'Co-Founder, GC Innovation Hub',
    },
    {
      text: "It's really easy to use. It makes us look professional and I love the way you can customize your job posts and make them your own. Simple to use and straightforward.",
      author: 'Saiful Talukdar',
      role: 'Co-Founder, GC Innovation Hub',
    },
  ];

  return (
    <section className="py-20 bg-lime-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-forest-900 mb-4">
            Why teams love ShiftMatch's Hiring Software
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            ShiftMatch's Customers share a passion for nurturing company culture. We all agree hiring can be more meaningful and personal.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-card">
              <p className="text-gray-600 mb-6 leading-relaxed">{testimonial.text}</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-forest-100 rounded-full flex items-center justify-center">
                  <span className="text-forest-700 font-bold">{testimonial.author[0]}</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// FAQ Section
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(1);

  const faqs = [
    {
      question: 'Where can I view store locations and hours?',
      answer: 'You can view all store locations and their operating hours on our platform. Each job listing includes detailed location information and shift timings.',
    },
    {
      question: 'Where is my order?',
      answer: "Depending on the delivery option you selected at checkout, we'll email you a tracking link after your order has been shipped. Follow this link to check the status of your order. We can also send you notifications about any important updates regarding your order – just make sure you've opted into notifications.",
    },
    {
      question: 'How do I apply for a job?',
      answer: 'Simply create an account, complete your profile, and browse available jobs. Click "Apply Now" on any job listing to submit your application.',
    },
    {
      question: 'What documents do I need?',
      answer: 'Most employers require a valid ID, proof of address, and relevant certifications for the role. Check the job description for specific requirements.',
    },
    {
      question: 'How do I get paid?',
      answer: 'Payments are processed directly through our platform. Once you complete a shift and your attendance is approved, payment will be transferred to your registered account.',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-forest-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500">
            Onboard your own talent pool to ShiftMatch, invite them to projects, sign contracts and kick off the projects simpler than ever.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-5 pb-5">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


// Footer
function Footer() {
  const footerLinks = {
    Support: ['How it Work', 'Features', 'Pricing', 'Download'],
    'Useful Links': ['About', 'Services', 'Blog', 'Contact'],
    Support2: ['FAQS', 'Term & Conditions', 'Privacy policy', 'Help Center'],
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <NavLink to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-forest-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-semibold text-lg text-forest-900">ShiftMatch</span>
            </NavLink>
            <p className="text-gray-500 mb-6 max-w-sm">
              Onboard your own talent pool to ShiftMatch, invite them to projects, sign contracts and kick off the projects simpler than ever.
            </p>
            <div className="flex gap-4">
              {['facebook', 'instagram', 'twitter', 'linkedin'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-forest-100 transition-colors"
                >
                  <span className="text-gray-600 capitalize text-xs">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-gray-900 mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-500 hover:text-forest-700 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} ShiftMatch. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// Main Landing Page
export function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-forest-900/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <NavLink to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-forest-900 font-bold text-sm">S</span>
              </div>
              <span className="font-semibold text-lg text-white">ShiftMatch</span>
            </NavLink>

            <div className="hidden md:flex items-center gap-8">
              <NavLink to="/" className="text-white hover:text-lime transition-colors">Home</NavLink>
              <NavLink to="/jobs" className="text-gray-300 hover:text-white transition-colors">Find Jobs</NavLink>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Find Candidates</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a>
            </div>

            <div className="flex items-center gap-4">
              <NavLink
                to="/login"
                className="hidden sm:block text-white hover:text-lime transition-colors"
              >
                Sign In
              </NavLink>
              <NavLink
                to="/signup/applicant"
                className="bg-lime text-forest-900 px-5 py-2 rounded-full font-medium hover:bg-lime-400 transition-colors"
              >
                Get Started
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Sections */}
      <div className="pt-16">
        <HeroSection />
        <StatsSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FAQSection />
        <Footer />
      </div>
    </div>
  );
}
