import {
  MdOutlinePeopleAlt,
  MdCloudQueue,
  MdSmartphone,
  MdCalendarToday,
  MdOutlineCheckBox,
  MdAccessTime,
} from 'react-icons/md';

const FeatureSection = () => {
  return (
    <section id="features" className="py-20">
      <div className="container">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-blue-900 md:text-4xl dark:text-blue-600">
            Everything you need to stay organized
          </h2>

          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-500">
            Powerful features designed to boost your productivity and simplify
            your day-to-day planning.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: <MdCalendarToday />,
              title: 'Smart Calendar',
              description:
                'Visualize your schedule with our intuitive calendar interface. Drag and drop events to reschedule.',
            },
            {
              icon: <MdOutlineCheckBox />,
              title: 'Task Management',
              description:
                'Create, organize, and prioritize tasks with ease. Set deadlines and never miss important to-dos.',
            },
            {
              icon: <MdAccessTime />,
              title: 'Reminders',
              description:
                'Get timely notifications for upcoming events and tasks across all your devices.',
            },
            {
              icon: <MdOutlinePeopleAlt />,
              title: 'Collaboration',
              description:
                'Share calendars and task lists with family, friends, or colleagues for seamless teamwork.',
            },
            {
              icon: <MdSmartphone />,
              title: 'Mobile Access',
              description:
                'Access your schedule and tasks from anywhere with our mobile-friendly design.',
            },
            {
              icon: <MdCloudQueue />,
              title: 'Cloud Sync',
              description:
                'Your data is automatically synced across all your devices in real-time.',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="
                group relative overflow-hidden rounded-xl
                border border-blue-100
                bg-white p-6
                shadow-sm

                transition-all duration-300 ease-out

                hover:z-10
                hover:-translate-y-2
                hover:scale-[1.02]

                hover:border-blue-300
                hover:bg-blue-50/80

                hover:shadow-[0_0_20px_rgba(37,99,235,0.25),0_0_50px_rgba(37,99,235,0.12)]

                dark:border-gray-700
                dark:bg-gray-800
                dark:hover:border-blue-500/40
                dark:hover:bg-gray-800
                dark:hover:shadow-[0_0_25px_rgba(59,130,246,0.5),0_0_60px_rgba(59,130,246,0.25)]
              "
            >
              {/* Ambient glow */}
              <div
                className="
                  pointer-events-none absolute
                  -inset-10
                  rounded-full
                  bg-blue-500/0
                  blur-3xl
                  transition-all duration-500

                  group-hover:bg-blue-500/10

                  dark:group-hover:bg-blue-500/15
                "
              />

              {/* Content */}
              <div className="relative">
                {/* Icon */}
                <div
                  className="
                    mb-4
                    flex h-12 w-12 items-center justify-center
                    rounded-lg
                    bg-blue-100
                    text-blue-600

                    transition-all duration-300

                    group-hover:bg-blue-600
                    group-hover:text-white
                    group-hover:shadow-[0_0_20px_rgba(37,99,235,0.45)]
                    group-hover:scale-110

                    dark:bg-blue-500/10
                    dark:text-blue-500
                    dark:group-hover:bg-blue-500
                    dark:group-hover:text-white
                  "
                >
                  <feature.icon.type className="h-7 w-7" />
                </div>

                {/* Title */}
                <h3
                  className="
                    mb-2 text-xl font-semibold
                    text-blue-900

                    transition-colors duration-300
                    group-hover:text-blue-700

                    dark:text-blue-500
                    dark:group-hover:text-blue-400
                  "
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className="
                    text-gray-600
                    transition-colors duration-300
                    group-hover:text-gray-700

                    dark:text-gray-400
                    dark:group-hover:text-gray-300
                  "
                >
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;