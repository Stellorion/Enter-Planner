import { Task, TaskFilters } from '@/src/types/task';

export function filterAndSortTasks(
  tasks: Task[],
  searchQuery: string,
  filters: TaskFilters
): Task[] {
  let filtered = tasks.filter((task) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const titleMatch = task.title.toLowerCase().includes(query);
    const descriptionMatch = task.description?.toLowerCase().includes(query);

    return titleMatch || descriptionMatch;
  });

  filtered = filtered.filter((task) => {
    if (filters.status === 'ALL') return true;
    return task.status === filters.status;
  });

  filtered = filtered.filter((task) => {
    const taskDueDate = task.dueDate ? new Date(task.dueDate) : null;

    if (!filters.dateRange.start && !filters.dateRange.end) {
      return true;
    }

    if (!taskDueDate) {
      return false;
    }

    if (filters.dateRange.start) {
      const filterStart = new Date(filters.dateRange.start);
      filterStart.setHours(0, 0, 0, 0);
      const taskDate = new Date(taskDueDate);
      taskDate.setHours(0, 0, 0, 0);

      if (taskDate < filterStart) return false;
    }

    if (filters.dateRange.end) {
      const filterEnd = new Date(filters.dateRange.end);
      filterEnd.setHours(23, 59, 59, 999);
      const taskDate = new Date(taskDueDate);
      taskDate.setHours(0, 0, 0, 0);

      if (taskDate > filterEnd) return false;
    }

    return true;
  });

  return filtered;
}

export function groupTasksByStatus(tasks: Task[]) {
  return {
    plannedTasks: tasks.filter((t) => t.status === 'PLANNED'),
    inProgressTasks: tasks.filter((t) => t.status === 'IN_PROGRESS'),
    onHoldTasks: tasks.filter((t) => t.status === 'ON_HOLD'),
    doneTasks: tasks.filter((t) => t.status === 'DONE'),
  };
}
