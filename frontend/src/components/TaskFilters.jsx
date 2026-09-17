const TaskFilters = ({
  search,
  setSearch,
  completed,
  setCompleted,
  priority,
  setPriority,
  sort,
  setSort,
}) => {
  return (
    <div className="filters">

      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <select
        value={completed}
        onChange={(e) =>
          setCompleted(e.target.value)
        }
      >
        <option value="">
          All Tasks
        </option>

        <option value="true">
          Completed
        </option>

        <option value="false">
          Pending
        </option>
      </select>


      <select
        value={priority}
        onChange={(e) =>
          setPriority(e.target.value)
        }
      >
        <option value="">
          All Priorities
        </option>

        <option value="low">
          Low
        </option>

        <option value="medium">
          Medium
        </option>

        <option value="high">
          High
        </option>
      </select>


      <select
        value={sort}
        onChange={(e) =>
          setSort(e.target.value)
        }
      >
        <option value="-createdAt">
          Newest
        </option>

        <option value="createdAt">
          Oldest
        </option>

        <option value="title">
          Title A-Z
        </option>

        <option value="-title">
          Title Z-A
        </option>

        <option value="priority">
          Priority
        </option>
      </select>

    </div>
  );
};

export default TaskFilters;