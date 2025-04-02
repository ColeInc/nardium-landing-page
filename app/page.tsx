import SignInWithGoogle from '@/components/SignInWithGoogle'
import SubscribeButton from '@/components/SubscribeButton'
import Link from 'next/link'

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col">
            {/* Hero Section */}
            <section className="flex-1 flex flex-col items-center justify-center px-4 py-16 bg-gray-50">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        Nardium - Google Docs Outline Tool
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Explore and navigate your Google Docs with ease! Enhance your document reading experience with powerful outline tools.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                        <SignInWithGoogle />
                        <SubscribeButton />
                    </div>

                    <div className="mt-8">
                        <Link
                            href="/features"
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Learn more about our features →
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    )
} 