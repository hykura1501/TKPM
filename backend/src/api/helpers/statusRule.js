function generateStatusTransitionRules(statusList) {
    const idToNameMap = {};
    statusList.forEach(status => {
      idToNameMap[status.id] = status.name;
    });
  
    const transitionRules = {};
    statusList.forEach(status => {
      transitionRules[status.name] = status.allowedStatus
        .map(id => idToNameMap[id])
        .filter(Boolean);
    });
  
    return transitionRules;
  }

module.exports = generateStatusTransitionRules;