const todoList = () => {
  all = [];

  const add = (todoItem) => {
    all.push(todoItem);
  };
  const markAsComplete = (index) => {
    all[index].completed = true;
  };

  const overdue = () => {
    return all.filter((item) => item.dueDate < today && !item.completed);
  };

  const dueToday = () => {
    return all.filter((item) => item.dueDate == today);
  };

  const dueLater = () => {
    return all.filter((item) => item.dueDate > today);
  };

  const toDisplayableList = (list) => {
    return list
      .map((item) => {
        const checkbox = item.completed ? "[x]" : "[ ]";
        const title = item.title;

        if (item.dueDate != today) {
          return `${checkbox} ${title} ${item.dueDate}`;
        } else {
          return `${checkbox} ${title}`;
        }
      })
      .join("\n");
  };

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
  };
};
