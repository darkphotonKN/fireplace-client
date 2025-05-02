export default function Home() {
  return (
    <main className="min-h-screen">
      <h1 className="mb-12" style={{ color: 'rgb(247, 111, 83)' }}>
        Flow
      </h1>

      <div className="space-y-12">
        <section>
          <h2 className="mb-4" style={{ color: 'rgb(46, 46, 46)' }}>
            Today&apos;s Tasks
          </h2>
          <p style={{ color: 'rgb(46, 46, 46)' }}>
            Track your daily progress and manage your learning goals. Stay
            focused on what matters most for your development journey.
          </p>
        </section>

        <section>
          <h2 className="mb-4" style={{ color: 'rgb(46, 46, 46)' }}>
            Resource Links
          </h2>
          <p style={{ color: 'rgb(46, 46, 46)' }}>
            Access curated learning materials, documentation, and helpful tools.
            Everything you need to accelerate your development skills in one
            place.
          </p>
        </section>

        <section>
          <h2 className="mb-4" style={{ color: 'rgb(46, 46, 46)' }}>
            AI Powered Summary
          </h2>
          <p style={{ color: 'rgb(46, 46, 46)' }}>
            Get personalized insights and recommendations based on your learning
            patterns. Let AI help you optimize your development workflow.
          </p>
        </section>
      </div>
    </main>
  );
}
