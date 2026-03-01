import Link from 'next/link'
import { Button } from '@/components/UI/Button'
import { Card } from '@/components/UI/Card'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-dark">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-display font-bold bg-gradient-brand bg-clip-text text-transparent">
            GitGenie
          </div>
          <Link href="/api/auth/login">
            <Button size="md">Login with GitHub</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 text-center">
        <h1 className="text-5xl font-display font-bold mb-6 bg-gradient-brand bg-clip-text text-transparent animate-entrance-fade">
          GitHub Achievement Alchemist
        </h1>
        <p className="text-xl text-foreground-muted mb-8 max-w-2xl mx-auto animate-entrance-slide-bottom">
          Transform your GitHub profile into a badge-collecting masterpiece. Unlock all 8 achievements
          with our interactive, jaw-dropping platform.
        </p>
        <div className="flex gap-4 justify-center flex-wrap animate-entrance-scale">
          <Link href="/api/auth/login">
            <Button size="lg" variant="primary">
              Start Unlocking Badges
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="secondary">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-display font-bold text-center mb-12">8 Epic Achievements</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              emoji: '⚡',
              name: 'QuickDraw',
              desc: 'Create & close an issue in 5 min',
            },
            {
              emoji: '🦈',
              name: 'Pull Shark',
              desc: 'Merge 2 pull requests',
            },
            {
              emoji: '🎯',
              name: 'YOLO',
              desc: 'Merge PR without review',
            },
            {
              emoji: '👥',
              name: 'Pair Extraordinaire',
              desc: 'Co-author a commit',
            },
            {
              emoji: '🧠',
              name: 'Galaxy Brain',
              desc: '2+ accepted discussion answers',
            },
            {
              emoji: '⭐',
              name: 'StarStruck',
              desc: '16+ stars on repository',
            },
            {
              emoji: '💝',
              name: 'Public Sponsor',
              desc: 'Sponsor an open-source dev',
            },
            {
              emoji: '💖',
              name: 'Heart On Your Sleeve',
              desc: 'Profile with multiple hearts',
            },
          ].map((achievement) => (
            <Card
              key={achievement.name}
              hoverable
              className="text-center transform hover:scale-105 transition-transform"
            >
              <div className="text-5xl mb-4">{achievement.emoji}</div>
              <h3 className="text-lg font-bold mb-2">{achievement.name}</h3>
              <p className="text-sm text-foreground-muted">{achievement.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/50">
          <h2 className="text-2xl font-bold mb-4">Ready to become a GitHub Achievement Alchemist?</h2>
          <p className="text-foreground-muted mb-6">
            Join developers from around the world in unlocking GitHub&apos;s most exclusive badges
          </p>
          <Link href="/api/auth/login">
            <Button size="lg" variant="primary">
              Login & Start
            </Button>
          </Link>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-foreground-muted">
          <p>GitGenie © 2026. Built with ❤️ by Jesun Ahmad Ushno</p>
        </div>
      </footer>
    </main>
  )
}
