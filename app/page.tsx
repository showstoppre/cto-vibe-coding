import Grid from '@/components/Grid';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center justify-center py-8 px-4">
        <Grid />
      </main>
    </div>
  );
}
