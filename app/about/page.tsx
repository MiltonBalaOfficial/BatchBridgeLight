const AboutPage = () => {
  return (
    <div className='bg-gray-50 py-20 dark:bg-gray-900'>
      <div className='container mx-auto px-4'>
        <div className='mx-auto max-w-4xl text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-gray-100'>
            About BatchBridge
          </h1>
          <p className='mt-6 text-lg text-gray-600 dark:text-gray-300'>
            Our mission is to bridge the gap between batches at COMJNMH,
            fostering a vibrant and supportive community where students can
            share experiences, collaborate on projects, and build lasting
            relationships.
          </p>
        </div>
        <div className='mt-16 grid grid-cols-1 gap-8 md:grid-cols-2'>
          <div className='rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800'>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
              Our Vision
            </h2>
            <p className='mt-4 text-gray-600 dark:text-gray-300'>
              We envision a future where every student at COMJNMH feels
              connected to a larger network of peers and alumni, empowering them
              to succeed both academically and professionally. We believe that
              by fostering a strong sense of community, we can create a more
              supportive and enriching learning environment for everyone.
            </p>
          </div>
          <div className='rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800'>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
              Our Story
            </h2>
            <p className='mt-4 text-gray-600 dark:text-gray-300'>
              BatchBridge was founded by a group of passionate students who
              recognized the need for a centralized platform to connect with
              their peers across different batches. What started as a small
              project has now grown into a thriving community of students and
              alumni, all dedicated to supporting one another and building a -
              stronger COMJNMH family.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
