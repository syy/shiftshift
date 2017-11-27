// KEY BINDER
(function() {
  let firstTime = 0;
  let isOpen = false;
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Shift') {
      let newTime = new Date();
      if (newTime - firstTime <= 600) {
        if(!isOpen) {
          isOpen = true;
          const prompt = window.prompt("search");
          if(prompt !== null) {
            chrome.extension.sendMessage({ type: 'findWord', payload: prompt }, (response) => {
              console.log('Content main got this: ', response);
            });
          }
        }
      } else {
        isOpen = false;
      }
      firstTime = newTime;
    }
  });
})();