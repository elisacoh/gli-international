export default function LegalNoticePage() {
  return (
    <div
      className="min-h-screen py-16 md:py-20 lg:py-24"
      style={{ backgroundColor: "rgb(231, 227, 216)" }}
    >
      <div className="max-w-4xl mx-auto px-6 md:px-8 lg:px-16">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-8 md:mb-12">
          Legal Notice
        </h1>

        <div className="space-y-8 text-gray-700 font-light">
          <section>
            <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
              Website publisher
            </h2>

            <p className="mb-4">
              The website https://www.gli-international.com is published by BRDWISE
              LLC, a company incorporated under Israeli law.
            </p>

            <p className="mb-4">
              GLI International is a trademark operated by BRDWISE.
            </p>

            <p className="mb-2">
              <strong className="font-semibold">BRDWISE</strong>
            </p>
            <p className="mb-2">
              <strong className="font-semibold">Company identification number:</strong>{" "}
                336166210
            </p>
            <p className="mb-2">
              <strong className="font-semibold">Registered office:</strong>
              Hashagrir Shlomo Argov 6, Jerusalem, Israel
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
              Contact
            </h2>
            <p>
              <strong className="font-semibold">Email:</strong>{" "}
              contact@gli-international.com
            </p>
            <p>
              <strong className="font-semibold">Telephone:</strong>{" "}
              +972 58-789-5678
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
              Publishing director
            </h2>
            <p>Jonathan Cohen</p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
              Hosting
            </h2>
            <p>
              <strong className="font-semibold">Hosting provider:</strong> Netlify, Inc. (États-Unis)
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
              Intellectual property
            </h2>
            <p className="mb-4">
              All elements available on this website (texts, images, logos, trademarks,
              content, structure) are protected by intellectual property laws and remain
              the exclusive property of BRDWISE or its partners.
            </p>
            <p>
              Any reproduction, representation, or exploitation, in whole or in part,
              without prior written authorization is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
              Liability
            </h2>
            <p className="mb-4">
              BRDWISE strives to ensure that the information published on this
              website is accurate and kept up to date.
            </p>
            <p className="mb-4">
              However, the company cannot be held liable for errors, omissions,
              service interruptions, or any damages resulting from the use of the website.
            </p>
            <p>
              The information provided on this website does not have contractual value.
              The terms and conditions applicable to services are defined in the General
              Terms and Conditions of Sale (GTC).
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
              Applicable law
            </h2>
            <p className="mb-4">
              This website and its content are governed by Israeli law.
            </p>
            <p>
              Any dispute relating to the use of the website or its content shall fall
              under the exclusive jurisdiction of the courts of Israel, unless mandatory
              legal provisions provide otherwise.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
