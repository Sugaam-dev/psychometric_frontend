type Props = {
  onSelect: (score: number) => void;
  disabled?: boolean;
  selectedValue?: number | null;
};

const options = [
  { 
    label: "Strongly Disagree", 
    value: 1,
    emoji: "😟",
    color: "from-red-500 to-red-600",
    hoverColor: "hover:border-red-400 hover:bg-red-50",
    textColor: "text-red-700"
  },
  { 
    label: "Disagree", 
    value: 2,
    emoji: "🙁",
    color: "from-orange-500 to-orange-600",
    hoverColor: "hover:border-orange-400 hover:bg-orange-50",
    textColor: "text-orange-700"
  },
  { 
    label: "Neutral", 
    value: 3,
    emoji: "😐",
    color: "from-yellow-500 to-yellow-600",
    hoverColor: "hover:border-yellow-400 hover:bg-yellow-50",
    textColor: "text-yellow-700"
  },
  { 
    label: "Agree", 
    value: 4,
    emoji: "🙂",
    color: "from-green-500 to-green-600",
    hoverColor: "hover:border-green-400 hover:bg-green-50",
    textColor: "text-green-700"
  },
  { 
    label: "Strongly Agree", 
    value: 5,
    emoji: "😊",
    color: "from-emerald-500 to-emerald-600",
    hoverColor: "hover:border-emerald-400 hover:bg-emerald-50",
    textColor: "text-emerald-700"
  },
];

export default function LikertScale({ onSelect, disabled, selectedValue }: Props) {
  return (
    <div className="space-y-6">
      {/* Desktop View - Horizontal */}
      <div className="hidden sm:grid sm:grid-cols-5 gap-3">
        {options.map((opt) => {
          const isSelected = selectedValue === opt.value;
          
          return (
            <button
              key={opt.value}
              disabled={disabled}
              onClick={() => onSelect(opt.value)}
              className={`
                group relative px-4 py-5 rounded-2xl border-2 
                font-medium transition-all duration-300 transform
                ${
                  disabled
                    ? "opacity-60 cursor-not-allowed"
                    : `${opt.hoverColor} hover:scale-105 hover:shadow-lg active:scale-95`
                }
                ${
                  isSelected
                    ? `bg-gradient-to-br ${opt.color} text-white border-transparent shadow-xl scale-105`
                    : "bg-white text-slate-700 border-slate-300"
                }
              `}
            >
              {/* Emoji */}
              <div className={`text-3xl mb-2 transition-transform duration-300 ${!isSelected && 'group-hover:scale-125'}`}>
                {opt.emoji}
              </div>
              
              {/* Label */}
              <div className="text-sm font-semibold">
                {opt.label}
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg animate-bounce-in">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Hover glow effect */}
              {!disabled && !isSelected && (
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-indigo-400/10 to-purple-400/10" />
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile View - Vertical List */}
      <div className="sm:hidden space-y-3">
        {options.map((opt) => {
          const isSelected = selectedValue === opt.value;
          
          return (
            <button
              key={opt.value}
              disabled={disabled}
              onClick={() => onSelect(opt.value)}
              className={`
                group relative w-full px-6 py-4 rounded-xl border-2 
                font-medium transition-all duration-300 transform
                flex items-center gap-4
                ${
                  disabled
                    ? "opacity-60 cursor-not-allowed"
                    : `${opt.hoverColor} active:scale-98`
                }
                ${
                  isSelected
                    ? `bg-gradient-to-r ${opt.color} text-white border-transparent shadow-lg`
                    : "bg-white text-slate-700 border-slate-300"
                }
              `}
            >
              {/* Emoji */}
              <div className="text-3xl">
                {opt.emoji}
              </div>
              
              {/* Label */}
              <div className="flex-1 text-left font-semibold">
                {opt.label}
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <div className="bg-white/20 rounded-full p-1.5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Arrow indicator for unselected */}
              {!isSelected && (
                <div className={`${opt.textColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Helper Text */}
      <div className="text-center">
        <p className="text-sm text-slate-500">
          {selectedValue 
            ? "Great! Your response has been recorded." 
            : "Select the option that best represents your view"}
        </p>
      </div>

      <style>{`
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .active\\:scale-98:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
}