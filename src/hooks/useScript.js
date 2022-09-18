import { useEffect } from 'react';

const useScript = (url) => {
  useEffect(() => {
    const script = document.createElement('script');
    const mapElement = document.getElementById('map');

    console.log(mapElement.children.length)

    script.src = url;
    script.async = true;

    if(mapElement.children.length == 0) { 
      document.body.appendChild(script);
    }
    
    function ClearAllIntervals() {
      for (var i = 1; i < 99999; i++)
          window.clearInterval(i)
  }
  
    return () => {
      ClearAllIntervals()
      if(mapElement.children.length == 0) { document.body.removeChild(script) }
    }
  }, [url]);
};

export default useScript;