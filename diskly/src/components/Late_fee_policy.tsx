export default function Late_Fee() {
  return (

    <div className="!min-h-screen !flex !items-center !justify-center  !p-6">
      <div className="!shadow-lg !rounded-2xl !p-8 !max-w-2xl !w-full">
      <div className="flex justify-center">
        <img
          src="/images/disklogo.png"
          alt="Diskly Logo"
          className="w-20 h-20 object-contain cursor-pointer"
          onClick={() => {
            window.location.href = "/";
          }}
        />
      </div>
        <h1 className="!text-3xl !font-bold !mb-4 !text-[#63D6DD] !text-center">
          Late Fee Policy
        </h1>

        <p className="!text-white !mb-4">
          To ensure fair use of our rental services and maintain availability
          for all users, we impose a late fee on overdue rentals.
        </p>

        <h2 className="!text-xl !font-semibold !text-[#63D6DD] !mb-2">
          Calculation Formula
        </h2>
        <div className="!bg-gray-50 !border-l-4 !border-blue-500 !p-4 !rounded !mb-4 !font-mono !text-sm !text-gray-800">
          Late Fee = (Original Price) × 2<sup>days overdue</sup>
        </div>

        <p className="!text-white !mb-4">
          Each day the rented item is not returned after the due date,
          the late fee doubles relative to the original rental price.
        </p>

        <h2 className="!text-xl !font-semibold !text-[#63D6DD] !mb-2">
          Example
        </h2>
        <p className="!text-white !mb-4">
          If the original rental price is <b>₱100</b> and the item is returned
          <b> 3 days late</b>:
        </p>
        <div className="!bg-gray-50 !border-l-4 !border-green-500 !p-4 !rounded !mb-4 !font-mono !text-sm !text-gray-800">
          ₱100 × 2³ = ₱800 total late fee
        </div>

        <p className="!text-white">
          Please make sure to return your rentals on or before the due date
          to avoid accumulating charges. <a href="contact-us">Contact customer support </a> if you
          expect any delay.
        </p>
      </div>
    </div>
  );
}
