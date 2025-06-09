import { Board } from '@/components/board';
import { Header } from '@/components/board/header';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Board />
    </div>
  );
}
