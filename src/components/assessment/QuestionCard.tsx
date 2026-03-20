type Question = {
  question_text: string;
  test_domain: string;
  dimension: string;
};

type Props = {
  question: Question;
};

const domainIcons: Record<string, string> = {
  "Personality": "🧠",
  "Cognitive": "💡",
  "Social": "👥",
  "Emotional": "❤️",
  "Motivation": "🎯",
  "Learning": "📚",
  "Interest": "⭐",
};

const domainColors: Record<string, string> = {
  "Personality": "from-purple-500 to-purple-600",
  "Cognitive": "from-blue-500 to-blue-600",
  "Social": "from-pink-500 to-pink-600",
  "Emotional": "from-red-500 to-red-600",
  "Motivation": "from-green-500 to-green-600",
  "Learning": "from-yellow-500 to-yellow-600",
  "Interest": "from-indigo-500 to-indigo-600",
};

export default function QuestionCard({ question }: Props) {
  const icon = domainIcons[question.test_domain] || "📋";
  const colorGradient = domainColors[question.test_domain] || "from-slate-500 to-slate-600";

  return (
    <div className="relative mb-8">
      {/* Decorative background blur */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${colorGradient} rounded-3xl blur opacity-10`} />
      
      <div className="relative bg-white rounded-3xl shadow-lg p-8 sm:p-10 border border-slate-100 transition-all duration-300 hover:shadow-xl">
        {/* Domain Badge */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${colorGradient} text-white text-sm font-semibold shadow-md`}>
            <span className="text-lg">{icon}</span>
            <span>{question.test_domain}</span>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span>{question.dimension}</span>
          </div>
        </div>

        {/* Question Text */}
        <div className="relative">
          {/* Quote decoration */}
          <div className="absolute -left-4 -top-2 text-6xl text-slate-200 font-serif leading-none select-none">
            "
          </div>
          
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-800 leading-relaxed relative z-10">
            {question.question_text}
          </h2>

          <div className="absolute -right-4 -bottom-2 text-6xl text-slate-200 font-serif leading-none select-none">
            "
          </div>
        </div>

        {/* Bottom decorative element */}
        <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
          <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Read carefully and choose honestly
          </span>
          <div className="flex-1 h-px bg-gradient-to-l from-slate-200 to-transparent" />
        </div>
      </div>
    </div>
  );
}