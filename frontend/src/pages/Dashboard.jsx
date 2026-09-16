import {
  useEffect,
  useState,
} from "react";

import Navbar from "../components/Navbar";
import Stats from "../components/Stats";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";
import TaskFilters from "../components/TaskFilters";
import Pagination from "../components/Pagination";

import { api } from "../utils/api";


const Dashboard = () => {

  const [tasks, setTasks] =
    useState([]);

  const [stats, setStats] =
    useState({
      total: 0,
      completed: 0,
      pending: 0,
      highPriority: 0,
    });


  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // Filters
  const [search, setSearch] =
    useState("");

  const [completed, setCompleted] =
    useState("");

  const [priority, setPriority] =
    useState("");

  const [sort, setSort] =
    useState("-createdAt");


  // Pagination
  const [page, setPage] =
    useState(1);

  const [pagination, setPagination] =
    useState({
      page: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    });


  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const params =
        new URLSearchParams();

      if (search) {
        params.set(
          "search",
          search
        );
      }

      if (completed) {
        params.set(
          "completed",
          completed
        );
      }

      if (priority) {
        params.set(
          "priority",
          priority
        );
      }

      params.set("sort", sort);

      params.set(
        "page",
        page
      );

      params.set(
        "limit",
        5
      );


      const result =
        await api.get(
          `/tasks?${params.toString()}`
        );


      setTasks(result.data);

      setPagination(
        result.pagination
      );

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  const fetchStats = async () => {
    try {
      const result =
        await api.get(
          "/tasks/stats"
        );

      setStats(result.data);
    } catch (error) {
      console.error(
        error.message
      );
    }
  };


  useEffect(() => {
    fetchTasks();
  }, [
    search,
    completed,
    priority,
    sort,
    page,
  ]);


  useEffect(() => {
    fetchStats();
  }, []);


  const handleTaskCreated = (
    newTask
  ) => {
    setPage(1);

    fetchTasks();

    fetchStats();
  };


  const handleTaskUpdated = (
    updatedTask
  ) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task._id === updatedTask._id
          ? updatedTask
          : task
      )
    );

    fetchStats();
  };


  const handleTaskDeleted = (
    taskId
  ) => {
    setTasks((currentTasks) =>
      currentTasks.filter(
        (task) =>
          task._id !== taskId
      )
    );

    fetchStats();
  };


  const resetFilters = () => {
    setSearch("");
    setCompleted("");
    setPriority("");
    setSort("-createdAt");
    setPage(1);
  };


  return (
    <div>

      <Navbar />

      <main className="dashboard">

        <div className="dashboard-header">

          <div>
            <h1>
              My Tasks
            </h1>

            <p>
              Manage your tasks
              efficiently.
            </p>
          </div>

        </div>


        <Stats stats={stats} />


        <section className="panel">

          <h2>
            Add New Task
          </h2>

          <TaskForm
            onTaskCreated={
              handleTaskCreated
            }
          />

        </section>


        <section className="panel">

          <div className="section-header">

            <h2>
              Tasks
            </h2>

            <button
              className="reset-button"
              onClick={
                resetFilters
              }
            >
              Reset Filters
            </button>

          </div>


          <TaskFilters
            search={search}
            setSearch={(value) => {
              setSearch(value);
              setPage(1);
            }}

            completed={completed}
            setCompleted={(value) => {
              setCompleted(value);
              setPage(1);
            }}

            priority={priority}
            setPriority={(value) => {
              setPriority(value);
              setPage(1);
            }}

            sort={sort}
            setSort={(value) => {
              setSort(value);
              setPage(1);
            }}
          />


          {loading && (
            <p className="loading">
              Loading tasks...
            </p>
          )}


          {error && (
            <p className="error">
              {error}
            </p>
          )}


          {!loading &&
            !error &&
            tasks.length === 0 && (
              <div className="empty">
                <h3>
                  No tasks found
                </h3>

                <p>
                  Create a task or
                  change your filters.
                </p>
              </div>
            )}


          <div className="task-list">

            {tasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onTaskUpdated={
                  handleTaskUpdated
                }
                onTaskDeleted={
                  handleTaskDeleted
                }
              />
            ))}

          </div>


          <Pagination
            page={pagination.page}
            totalPages={
              pagination.totalPages
            }
            hasNextPage={
              pagination.hasNextPage
            }
            hasPreviousPage={
              pagination.hasPreviousPage
            }
            onPageChange={
              setPage
            }
          />

        </section>

      </main>

    </div>
  );
};

export default Dashboard;