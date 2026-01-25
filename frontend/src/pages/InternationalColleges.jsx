import React, { useState, useEffect } from 'react';
import { FaSearch, FaGlobeAmericas, FaUniversity, FaSortAmountDown } from 'react-icons/fa';

const InternationalColleges = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [limit, setLimit] = useState(50);

  useEffect(() => {
    fetchColleges();
  }, [limit]);

  const fetchColleges = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5001/api/predictor/colleges?type=International&limit=${limit}`);
      const data = await res.json();
      if (data.success) {
        setColleges(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch international colleges", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredColleges = colleges.filter(college => 
    college.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (college.location?.country && college.location.country.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8 mt-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaGlobeAmericas className="text-brand-blue" />
            Top International Universities
          </h1>
          <p className="text-gray-600 mt-2">Explore the best universities from around the world.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search universities or countries..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-orange"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
         <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-orange"></div>
         </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 font-semibold text-gray-600 w-20 text-center">Rank</th>
                  <th className="p-4 font-semibold text-gray-600">University</th>
                  <th className="p-4 font-semibold text-gray-600">Location</th>
                  <th className="p-4 font-semibold text-gray-600 text-right">Score/Rating</th>
                </tr>
              </thead>
              <tbody>
                {filteredColleges.length > 0 ? (
                  filteredColleges.map((college, index) => (
                    <tr key={college._id || index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                          college.rank <= 10 ? 'bg-yellow-100 text-yellow-700' : 
                          college.rank <= 50 ? 'bg-blue-50 text-brand-blue' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {college.rank || '-'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-gray-900">{college.name}</div>
                        {/* <div className="text-xs text-gray-500 mt-0.5">{college.type}</div> */}
                      </td>
                      <td className="p-4 text-gray-600">
                         {college.location?.country || 'Unknown'}
                         {college.location?.city ? `, ${college.location.city}` : ''}
                      </td>
                      <td className="p-4 text-right font-medium text-gray-700">
                        {/* {college.cutoff && college.cutoff.length > 0 ? 'View Cutoffs' : 'N/A'} */}
                        N/A
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">
                      No universities found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {filteredColleges.length >= limit && (
             <div className="p-4 flex justify-center border-t border-gray-100">
                <button 
                  onClick={() => setLimit(prev => prev + 50)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Load More
                </button>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InternationalColleges;
