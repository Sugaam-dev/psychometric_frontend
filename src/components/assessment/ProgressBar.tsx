type Props = {
  answered: number;
  total: number;
};

export default function ProgressBar({ answered, total }: Props) {
  const percent = total === 0 ? 0 : Math.round((answered / total) * 100);

  // Determine progress stage for color
  const getProgressColor = () => {
    if (percent < 25) return 'from-red-500 to-orange-500';
    if (percent < 50) return 'from-orange-500 to-yellow-500';
    if (percent < 75) return 'from-yellow-500 to-green-500';
    return 'from-green-500 to-emerald-500';
  };

  const getProgressRing = () => {
    if (percent < 25) return 'text-red-500';
    if (percent < 50) return 'text-orange-500';
    if (percent < 75) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {/* Left side - Text info */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-600">
              Question {answered + 1} of {total}
            </span>
            <span className="text-xs text-slate-500">
              {total - answered} remaining
            </span>
          </div>
        </div>

        {/* Right side - Percentage circle */}
        <div className="flex items-center gap-3">
          <div className="relative w-16 h-16">
            {/* Background circle */}
            <svg className="transform -rotate-90 w-16 h-16">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-slate-200"
              />
              {/* Progress circle */}
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - percent / 100)}`}
                className={`${getProgressRing()} transition-all duration-1000 ease-out`}
                strokeLinecap="round"
              />
            </svg>
            {/* Percentage text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-slate-700">
                {percent}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative">
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
          <div
            className={`h-full bg-gradient-to-r ${getProgressColor()} transition-all duration-700 ease-out relative`}
            style={{ width: `${percent}%` }}
          >
            {/* Animated shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>

        {/* Milestone markers */}
        <div className="absolute top-0 left-0 w-full h-3 flex justify-between px-0.5">
          {[25, 50, 75].map((milestone) => (
            <div
              key={milestone}
              className="relative"
              style={{ left: `${milestone}%` }}
            >
              <div
                className={`w-1 h-3 rounded-full transition-colors duration-300 ${
                  percent >= milestone
                    ? 'bg-white/60'
                    : 'bg-slate-300/50'
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Progress indicators */}
      <div className="flex justify-between mt-2 px-1">
        <span className="text-xs text-slate-400">Start</span>
        <div className="flex gap-8 text-xs text-slate-400">
          <span className={percent >= 25 ? 'text-orange-500 font-medium' : ''}>25%</span>
          <span className={percent >= 50 ? 'text-yellow-500 font-medium' : ''}>50%</span>
          <span className={percent >= 75 ? 'text-green-500 font-medium' : ''}>75%</span>
        </div>
        <span className={`text-xs ${percent === 100 ? 'text-green-600 font-bold' : 'text-slate-400'}`}>
          {percent === 100 ? 'Complete! 🎉' : 'End'}
        </span>
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}