// src/hooks/useFreesound.js
import { useEffect, useState } from 'react';

// const TOKEN = 'YU9ju1m1dQBUbGLpaed6pNAJfwhzx0VGSjcIQK2W';

const TOKEN = import.meta.env.VITE_FREESOUND_CLIENT_ID;

const useFreesound = () => {
  const [sounds, setSounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('music')

  useEffect(() => {
    const fetchSounds = async () => {
      if (!TOKEN) {
        console.error('Freesound token not found in environment variables');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://freesound.org/apiv2/search/text/?query=${query}&fields=id,name,previews&token=${TOKEN}&page_size=150`
        );

        const data = await response.json();
        setSounds(data.results || []);
      } catch (error) {
        console.error('Error fetching sounds:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSounds();
  }, [query]);

  return { sounds, loading, setQuery };
};

export default useFreesound;



// src/hooks/useFreesound.js
// import { useEffect, useState } from 'react';

// const TOKEN = import.meta.env.VITE_FREESOUND_CLIENT_ID;

// const useFreesound = (query = 'rain') => {
//   const [sounds, setSounds] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!query) return;

//     const fetchSounds = async () => {
//       if (!TOKEN) {
//         console.error('Freesound token not found in environment variables');
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);

//         const response = await fetch(
//           `https://freesound.org/apiv2/search/text/?query=${encodeURIComponent(query)}&fields=id,name,previews&token=${TOKEN}&page_size=150`
//         );

//         const data = await response.json();
//         setSounds(data.results || []);
//       } catch (error) {
//         console.error('Error fetching sounds:', error);
//         setSounds([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSounds();
//   }, [query]);

//   return { sounds, loading };
// };

// export default useFreesound;

    