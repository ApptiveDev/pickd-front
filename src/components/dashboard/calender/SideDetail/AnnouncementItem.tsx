import { Star } from 'lucide-react';

interface AnnouncementItemProps {
  title: string;
  company: string;
  step: string;
  dday: string;
}

const AnnouncementItem = ({ title, company, step, dday }: AnnouncementItemProps) => {
  const isUrgent = dday === 'D-Day' || dday === 'D-1';

  return (
    <div className="flex items-center justify-between group cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <Star 
          size={18} 
          className="text-gray-300" 
        />
        
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-gray-800 leading-none">{title}</h4>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-400">{company}</span>
            <span className="text-[10px] bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded">
              {step}
            </span>
          </div>
        </div>
      </div>

      <div className={`text-[10px] font-bold px-2 py-1 rounded-md ${
        isUrgent ? 'bg-red-50 text-red-500' : 'bg-yellow-50 text-yellow-600'
      }`}>
        {dday}
      </div>
    </div>
  );
};

export default AnnouncementItem;