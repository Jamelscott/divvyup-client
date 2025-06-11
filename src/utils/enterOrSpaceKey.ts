const onEnterOrSpaceKey = (e: React.KeyboardEvent, callback: () => void) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          callback();
        }
      };
      export default onEnterOrSpaceKey;