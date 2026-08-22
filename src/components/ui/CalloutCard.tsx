import { AlertTriangle, Lightbulb, BookOpen, AlertCircle, Info, Beaker, CheckCircle } from 'lucide-react';
import type { ReactNode } from 'react';

type CalloutType = 'definition' | 'formula' | 'exam-tip' | 'misconception' | 'key-concept' | 'science-context' | 'info' | 'warning' | 'tip' | 'error' | 'success';

interface CalloutCardProps {
  type: CalloutType;
  title?: string;
  children?: ReactNode;
  content?: ReactNode;
  className?: string;
}

const configs: Record<string, { icon: typeof Info; label: string; border: string; bg: string; iconColor: string; titleColor: string }> = {
  definition: {
    icon: BookOpen, label: 'Definition',
    border: 'border-l-blue-700', bg: 'bg-blue-50/50', iconColor: 'text-blue-700', titleColor: 'text-blue-800',
  },
  formula: {
    icon: Info, label: 'Key Formula',
    border: 'border-l-violet-500', bg: 'bg-violet-50/50', iconColor: 'text-violet-600', titleColor: 'text-violet-800',
  },
  'exam-tip': {
    icon: Lightbulb, label: 'Exam Tip',
    border: 'border-l-amber-500', bg: 'bg-amber-50/50', iconColor: 'text-amber-600', titleColor: 'text-amber-800',
  },
  misconception: {
    icon: AlertTriangle, label: 'Common Misconception',
    border: 'border-l-orange-500', bg: 'bg-orange-50/50', iconColor: 'text-orange-600', titleColor: 'text-orange-800',
  },
  'key-concept': {
    icon: AlertCircle, label: 'Key Concept',
    border: 'border-l-emerald-500', bg: 'bg-emerald-50/50', iconColor: 'text-emerald-600', titleColor: 'text-emerald-800',
  },
  'science-context': {
    icon: Beaker, label: 'Science in Context',
    border: 'border-l-sky-500', bg: 'bg-sky-50/50', iconColor: 'text-sky-600', titleColor: 'text-sky-800',
  },
  info: {
    icon: Info, label: 'Note',
    border: 'border-l-blue-500', bg: 'bg-blue-50/50', iconColor: 'text-blue-600', titleColor: 'text-blue-800',
  },
  warning: {
    icon: AlertTriangle, label: 'Warning',
    border: 'border-l-orange-500', bg: 'bg-orange-50/50', iconColor: 'text-orange-600', titleColor: 'text-orange-800',
  },
  tip: {
    icon: Lightbulb, label: 'Tip',
    border: 'border-l-amber-500', bg: 'bg-amber-50/50', iconColor: 'text-amber-600', titleColor: 'text-amber-800',
  },
  error: {
    icon: AlertTriangle, label: 'Error',
    border: 'border-l-red-500', bg: 'bg-red-50/50', iconColor: 'text-red-600', titleColor: 'text-red-800',
  },
  success: {
    icon: CheckCircle, label: 'Success',
    border: 'border-l-emerald-500', bg: 'bg-emerald-50/50', iconColor: 'text-emerald-600', titleColor: 'text-emerald-800',
  },
};

export function CalloutCard({ type, title, children, content, className = '' }: CalloutCardProps) {
  const config = configs[type] || configs.info;
  const Icon = config.icon;
  const displayContent = children || content;

  return (
    <div className={`border-l-4 ${config.border} ${config.bg} rounded-r-lg p-4 my-4 ${className}`} role="note">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={16} className={config.iconColor} />
        <span className={`text-xs font-bold uppercase tracking-wider ${config.titleColor}`}>
          {title || config.label}
        </span>
      </div>
      <div className="text-sm text-slate-700 leading-relaxed">{displayContent}</div>
    </div>
  );
}

export default CalloutCard;
