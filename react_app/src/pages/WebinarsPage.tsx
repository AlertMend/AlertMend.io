import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Video, Calendar, Users, ArrowRight } from 'lucide-react'

export default function WebinarsPage() {
  const webinars = [
    {
      title: 'Introduction to AIOps for Infrastructure',
      date: 'April 15, 2024',
      time: '2:00 PM SGT',
      attendees: '500+',
      status: 'Upcoming',
    },
    {
      title: 'Kubernetes Best Practices with AlertMend',
      date: 'March 28, 2024',
      time: '3:00 PM SGT',
      attendees: '1.2K',
      status: 'Recorded',
    },
    {
      title: 'Cost Optimization in Multi-Cloud Environments',
      date: 'March 15, 2024',
      time: '2:00 PM SGT',
      attendees: '800+',
      status: 'Recorded',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-24">
        <section className="py-20 md:py-32 container-padding bg-gradient-to-b from-white via-primary-50/30 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-block px-5 py-2 bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 rounded-full text-sm font-bold mb-6 shadow-lg">
                Webinars
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
                Upcoming & Recorded Webinars
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
                Join our live webinars or watch recorded sessions to learn from experts and peers.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {webinars.map((webinar, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-primary-400 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      webinar.status === 'Upcoming' 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {webinar.status}
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <Users className="h-4 w-4" />
                      <span>{webinar.attendees}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <Video className="h-6 w-6 text-primary-600" />
                    <h3 className="text-xl font-black text-gray-900">{webinar.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-6">
                    <Calendar className="h-4 w-4" />
                    <span>{webinar.date} at {webinar.time}</span>
                  </div>
                  <a
                    href="#"
                    className="text-primary-600 hover:text-primary-700 font-bold text-sm flex items-center gap-2"
                  >
                    {webinar.status === 'Upcoming' ? 'Register' : 'Watch Recording'}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

