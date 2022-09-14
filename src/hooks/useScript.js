import { useEffect } from 'react';

const useScript = (url) => {
  useEffect(() => {
    const script = document.createElement('script');

    script.src = url;
    script.async = true;

    document.body.appendChild(script);
    function ClearAllIntervals() {
      for (var i = 1; i < 99999; i++)
          window.clearInterval(i)
  }
  
    return () => {
      ClearAllIntervals()
      document.body.removeChild(script)
    }
  }, [url]);
};

export default useScript;