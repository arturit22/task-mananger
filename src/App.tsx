import Navbar from './components/Navbar/Navbar';
import { ThemeProvider } from './components/ThemeProvider/ThemeProvider';
import TodoCalendar from './components/TodoCalendar/TodoCalendar';

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
        <Navbar />
        <TodoCalendar />
      </div>
    </ThemeProvider>
  );
}
