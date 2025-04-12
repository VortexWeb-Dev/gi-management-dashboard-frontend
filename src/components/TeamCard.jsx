import { Users, ChevronDown, ChevronUp, Star, Award, Medal } from 'lucide-react';
import { useState } from 'react';

const TeamCard = ({ team }) => {
    const [expanded, setExpanded] = useState(false);
  
    // Function to get position icon
    const getPositionIcon = (position) => {
      if (position === null) return <Star className="w-5 h-5 text-yellow-500" />;
      if (position === "Senior Agent") return <Award className="w-5 h-5 text-blue-500" />;
      if (position === "Agent") return <Medal className="w-5 h-5 text-green-500" />;
      return null;
    };

  
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow transition-all duration-300 hover:shadow-xl">
        {/* Team header */}
        <div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-lg">
              <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{team.teamName}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Led by {team.head}</p>
            </div>
          </div>
          <button 
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {expanded ? 
              <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" /> : 
              <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            }
          </button>
        </div>
        
        {/* Team members */}
        {/* <div className={`transition-all duration-300 ${expanded ? 'max-h-96' : 'max-h-0'} overflow-hidden`}>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto"> */}
          <div className={`transition-all duration-300 ${expanded ? '' : 'max-h-0'} overflow-hidden`}>
  <ul className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto" 
      style={{ maxHeight: expanded ? '300px' : 0 }}>
            {team.members.map((member, index) => (
              <li key={index} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                    {member.name.split(' ').map(word => word[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {member.position || "Team Lead"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {getPositionIcon(member.position)}
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Team stats */}
        <div className=" py-4 bg-gray-50 dark:bg-gray-900 grid grid-cols-2 text-center px-auto">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Members</p>
            <p className="font-semibold text-gray-900 dark:text-white">{team.members.length}</p>
          </div>
          {/* <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Avg Experience</p>
            <p className="font-semibold text-gray-900 dark:text-white">3.5 yrs</p>
          </div> */}
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Performance</p>
            <p className="font-semibold text-indigo-600 dark:text-indigo-400">High</p>
          </div>
        </div>
      </div>
    );
  };

  export default TeamCard;