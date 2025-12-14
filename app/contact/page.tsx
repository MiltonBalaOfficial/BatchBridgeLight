const ContactPage = () => {
  return (
    <div className='bg-gray-50 py-20 dark:bg-gray-900'>
      <div className='container mx-auto px-4'>
        <div className='mx-auto max-w-4xl'>
          <h1 className='text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-gray-100'>
            Contact Us
          </h1>
          <div className='prose prose-lg mt-6 text-gray-600 dark:text-gray-300'>
            <p>If you have any questions, feel free to reach out to us.</p>
            <p>
              You can contact us by email at{' '}
              <a href='mailto:'>batchbridge@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
