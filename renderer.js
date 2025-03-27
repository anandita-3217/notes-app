document.getElementById('minimize-btn').addEventListener('click', () => {
    window.electronAPI.minimizeWindow();
  });
  
  document.getElementById('close-btn').addEventListener('click', () => {
    window.electronAPI.closeWindow();
  });
  
  document.getElementById('action1').addEventListener('click', () => {
    alert('You did something fun!');
  });
  
  document.getElementById('action2').addEventListener('click', () => {
    document.querySelector('.mascot img').classList.add('spin');
    setTimeout(() => {
      document.querySelector('.mascot img').classList.remove('spin');
    }, 1000);
  });
  
  // Add this to styles.css for the spin animation
  /*
  .spin {
    animation: spin 1s linear;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  */