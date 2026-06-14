import React, { useState } from 'react';
import { Sparkles, ArrowRight, User, GraduationCap, Brain, Compass, HelpCircle, X, Plus } from 'lucide-react';

export default function WelcomeForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    age: '',
    education: '',
    course: '',
    skills: '',
    interests: '',
    favoriteSubjects: '',
    careerGoals: '',
    workStyle: '',
    location: '',
    additionalInfo: ''
  });

  // Keep track of tags list for Skills and Interests to make them super premium
  const [skillsList, setSkillsList] = useState(
    formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : []
  );
  const [skillInput, setSkillInput] = useState('');

  const [interestsList, setInterestsList] = useState(
    formData.interests ? formData.interests.split(',').map(s => s.trim()).filter(Boolean) : []
  );
  const [interestInput, setInterestInput] = useState('');

  // Handle typing input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Add a skill tag
  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = skillInput.trim();
      if (val && !skillsList.includes(val)) {
        const newList = [...skillsList, val];
        setSkillsList(newList);
        setFormData(prev => ({ ...prev, skills: newList.join(', ') }));
        setSkillInput('');
      }
    }
  };

  const handleAddSkillButton = () => {
    const val = skillInput.trim();
    if (val && !skillsList.includes(val)) {
      const newList = [...skillsList, val];
      setSkillsList(newList);
      setFormData(prev => ({ ...prev, skills: newList.join(', ') }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const newList = skillsList.filter(s => s !== skillToRemove);
    setSkillsList(newList);
    setFormData(prev => ({ ...prev, skills: newList.join(', ') }));
  };

  // Add an interest tag
  const handleAddInterest = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = interestInput.trim();
      if (val && !interestsList.includes(val)) {
        const newList = [...interestsList, val];
        setInterestsList(newList);
        setFormData(prev => ({ ...prev, interests: newList.join(', ') }));
        setInterestInput('');
      }
    }
  };

  const handleAddInterestButton = () => {
    const val = interestInput.trim();
    if (val && !interestsList.includes(val)) {
      const newList = [...interestsList, val];
      setInterestsList(newList);
      setFormData(prev => ({ ...prev, interests: newList.join(', ') }));
      setInterestInput('');
    }
  };

  const handleRemoveInterest = (interestToRemove) => {
    const newList = interestsList.filter(i => i !== interestToRemove);
    setInterestsList(newList);
    setFormData(prev => ({ ...prev, interests: newList.join(', ') }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const workStyleOptions = [
    { label: 'Remote', value: 'Remote' },
    { label: 'Hybrid', value: 'Hybrid' },
    { label: 'On-site', value: 'On-site' },
    { label: 'No Preference / Flexible', value: 'Flexible' }
  ];

  const educationLevels = [
    'High School / Secondary',
    'Undergraduate Student',
    'Graduate / Master\'s',
    'Postgraduate / Ph.D.',
    'Working Professional (Retraining)',
    'Self-taught / Alternative Education'
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12 overflow-y-auto max-h-full custom-scrollbar">
      {/* Welcome Title */}
      <div className="text-center mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-top-4 duration-300">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-900/60 dark:text-indigo-400 text-xs font-semibold mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          AI-Powered Insights
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-indigo-655 to-purple-650 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-300 font-sans">
          AI Career Recommendation Assistant
        </h2>
        <p className="mt-3 text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base">
          Discover the best career path based on your skills, interests, education, and goals. Fill in your profile below to get started.
        </p>
      </div>

      {/* Main Card Form */}
      <div className="glass rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden animate-in fade-in duration-300">
        {/* Glow effect */}
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -left-24 -bottom-24 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

        <form onSubmit={handleSubmit} className="relative space-y-6">
          {/* Section 1: Demographics & Education */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2">
              <User className="h-4 w-4 text-indigo-500" />
              Personal & Education Profile
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-450 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-455 dark:focus:bg-slate-950"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-450 mb-1.5">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="e.g. 21"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-450 dark:focus:bg-slate-950"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-450 mb-1.5">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. Toronto, Canada"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-455 dark:focus:bg-slate-950"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Education Level */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-450 mb-1.5">
                  Education Level <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-450 dark:focus:bg-slate-950"
                >
                  <option value="" disabled>Select your education level</option>
                  {educationLevels.map((lvl) => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>

              {/* Current Course/Stream */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-450 mb-1.5">
                  Current Course / Stream <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  placeholder="e.g. Computer Science, High School Science Stream"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-455 dark:focus:bg-slate-950"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Skills & Interests */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2">
              <GraduationCap className="h-4 w-4 text-purple-500" />
              Skills & Academic Interests
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Skills Tag Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-450 mb-1.5">
                  Skills <span className="text-red-500">*</span>
                  <span className="text-[10px] text-slate-400 font-normal ml-1.5">(Press Enter or comma to add)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder={skillsList.length === 0 ? "e.g. Python, SQL, Writing" : "Add more skills..."}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-4 pr-10 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-455 dark:focus:bg-slate-950"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkillButton}
                    className="absolute right-2 top-2 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-indigo-650 dark:hover:bg-slate-800"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {/* Skills Badges */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {skillsList.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium border border-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/60"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {skillsList.length === 0 && (
                    <span className="text-xs text-slate-400 dark:text-slate-500 italic mt-1">No skills added yet.</span>
                  )}
                </div>
                {/* Fallback hidden or synced field */}
                <input type="hidden" required name="skills" value={formData.skills} />
              </div>

              {/* Interests Tag Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-450 mb-1.5">
                  Interests <span className="text-red-500">*</span>
                  <span className="text-[10px] text-slate-400 font-normal ml-1.5">(Press Enter or comma to add)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyDown={handleAddInterest}
                    placeholder={interestsList.length === 0 ? "e.g. Design, Psychology, Data Analytics" : "Add more interests..."}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-4 pr-10 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-455 dark:focus:bg-slate-950"
                  />
                  <button
                    type="button"
                    onClick={handleAddInterestButton}
                    className="absolute right-2 top-2 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-indigo-650 dark:hover:bg-slate-800"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {/* Interests Badges */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {interestsList.map((interest) => (
                    <span
                      key={interest}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 font-medium border border-purple-100 dark:bg-purple-950/40 dark:text-purple-350 dark:border-purple-900/60"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => handleRemoveInterest(interest)}
                        className="text-purple-400 hover:text-purple-600 dark:hover:text-purple-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {interestsList.length === 0 && (
                    <span className="text-xs text-slate-400 dark:text-slate-500 italic mt-1">No interests added yet.</span>
                  )}
                </div>
                {/* Fallback hidden or synced field */}
                <input type="hidden" required name="interests" value={formData.interests} />
              </div>
            </div>

            {/* Favorite Subjects */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-450 mb-1.5">
                Favorite Subjects <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                name="favoriteSubjects"
                value={formData.favoriteSubjects}
                onChange={handleInputChange}
                placeholder="e.g. Mathematics, Art & Design, Modern History"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-455 dark:focus:bg-slate-950"
              />
            </div>
          </div>

          {/* Section 3: Professional Goals */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2">
              <Brain className="h-4 w-4 text-emerald-500" />
              Career Aspirations
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Career Goals */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-450 mb-1.5">
                  Career Goals / Vision <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  name="careerGoals"
                  value={formData.careerGoals}
                  onChange={handleInputChange}
                  placeholder="e.g. Build green tech, lead digital product teams, design games"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-455 dark:focus:bg-slate-950"
                />
              </div>

              {/* Preferred Work Style */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-450 mb-1.5">
                  Preferred Work Style <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  name="workStyle"
                  value={formData.workStyle}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-455 dark:focus:bg-slate-950"
                >
                  <option value="" disabled>Select work style</option>
                  {workStyleOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-450 mb-1.5 flex items-center justify-between">
                <span>Additional Information / Context</span>
                <span className="text-[10px] text-slate-400 font-normal font-sans">(Optional)</span>
              </label>
              <textarea
                name="additionalInfo"
                rows="3"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                placeholder="Mention any limitations, willingness to relocate, certifications, or specific constraints that the AI should consider."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-455 dark:focus:bg-slate-950"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end">
            <button
              type="submit"
              disabled={skillsList.length === 0 || interestsList.length === 0}
              className="shine-btn w-full md:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-650 via-indigo-600 to-purple-650 px-8 py-3.5 text-sm font-semibold text-white transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-650/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none"
            >
              <span>Get Career Recommendations</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
