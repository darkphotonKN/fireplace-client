import Todo from '@/components/Todo';
import GitHub from '@/components/GitHub';

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="space-y-12">
        {/* --- Today's Tasks --- */}
        <section>
          <h2 className="mb-4">Today&apos;s Tasks</h2>
          <Todo />
        </section>

        <section>
          <h2 className="mb-4">Resource Links</h2>
          <div className="space-y-8">
            <p>
              Access curated learning materials, documentation, and helpful
              tools. Everything you need to accelerate your development skills
              in one place.
            </p>

            <GitHub />
          </div>
        </section>

        <section>
          <h2 className="mb-4">Summary *Powered by AI*</h2>
          <p>
            Get personalized insights and recommendations based on your learning
            patterns. Let AI help you optimize your development workflow.
          </p>
        </section>
      </div>
    </main>
  );
}
