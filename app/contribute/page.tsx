const ContributePage = () => {
  return (
    <div className='bg-gray-50 py-20 dark:bg-gray-900'>
      <div className='container mx-auto px-4'>
        <div className='mx-auto max-w-4xl'>
          <h1 className='text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-gray-100'>
            Contribute to BatchBridge
          </h1>
          <div className='prose prose-lg mt-6 text-gray-600 dark:text-gray-300'>
            <p>
              Your support helps us keep BatchBridge running and ad-free. Here
              are the ways you can contribute:
            </p>
            <h2>UPI (Unified Payments Interface)</h2>
            <p>You can send money to the following UPI ID:</p>
            <p className='font-mono'>[Your UPI ID]</p>

            <h2>Bank Transfer</h2>
            <p>
              You can also contribute via a direct bank transfer. Our bank
              details are as follows:
            </p>
            <ul>
              <li>
                <strong>Bank Name:</strong> [Your Bank Name]
              </li>
              <li>
                <strong>Account Name:</strong> [Your Account Name]
              </li>
              <li>
                <strong>Account Number:</strong> [Your Account Number]
              </li>
              <li>
                <strong>IFSC Code:</strong> [Your IFSC Code]
              </li>
            </ul>

            <h2>QR Code</h2>
            <p>
              Scan the QR code below using your favorite UPI app to contribute.
            </p>
            {/* Placeholder for QR code image */}
            <div className='flex h-48 w-48 items-center justify-center bg-gray-200'>
              <p>QR Code</p>
            </div>

            <h2>In Cash</h2>
            <p>
              If you prefer to contribute in cash, please contact one of our
              representatives directly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributePage;
