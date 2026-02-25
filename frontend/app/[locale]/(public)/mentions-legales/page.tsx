export default function MentionsLegalesPage() {
  return (
    <div
      className="min-h-screen py-16 md:py-20 lg:py-24"
      style={{ backgroundColor: "rgb(231, 227, 216)" }}
    >
      <div className="max-w-4xl mx-auto px-6 md:px-8 lg:px-16">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-8 md:mb-12">
          Mentions légales
        </h1>

        <div className="space-y-8 text-gray-700 font-light">
          <section>
            <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
              Éditeur du site
            </h2>

            <p className="mb-4">
              Le site https://www.gli-international.com est édité par BRDWISE,
              société de droit israelien.
            </p>

            <p className="mb-4">
              GLI International est une marque commerciale exploitée par BRDWISE.
            </p>

            <p className="mb-2">
              <strong className="font-semibold">BRDWISE</strong>
            </p>
            <p className="mb-2">
              <strong className="font-semibold">
                Numéro d’identification de la société :
              </strong>{" "}
                336166210
            </p>
            <p className="mb-2">
              <strong className="font-semibold">Siège social :</strong>
              Hashagrir Shlomo Argov 6, Jerusalem, Israel
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
              Contact
            </h2>
            <p>
              <strong className="font-semibold">Email :</strong>{" "}
              contact@gli-international.com
            </p>
            <p>
              <strong className="font-semibold">Telephone:</strong>{" "}
              +972 58-789-5678
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
              Directeur de la publication
            </h2>
            <p>Jonathan Cohen</p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
              Hébergement
            </h2>
            <p>
              <strong className="font-semibold">Hébergeur :</strong> Netlify, Inc. (États-Unis)
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
              Propriété intellectuelle
            </h2>
            <p className="mb-4">
              L’ensemble des éléments présents sur le site (textes, images, logos,
              marques, contenus, structure) est protégé par le droit de la propriété
              intellectuelle et demeure la propriété exclusive de BRDWISE ou de
              ses partenaires.
            </p>
            <p>
              Toute reproduction, représentation ou exploitation, totale ou partielle,
              sans autorisation écrite préalable, est strictement interdite.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
              Responsabilité
            </h2>
            <p className="mb-4">
              BRDWISE s’efforce d’assurer l’exactitude et la mise à jour des
              informations diffusées sur le site.
            </p>
            <p className="mb-4">
              Toutefois, la société ne saurait être tenue responsable d’erreurs,
              d’omissions, d’interruptions du service ou de dommages résultant de
              l’utilisation du site.
            </p>
            <p>
              Les informations présentées n’ont pas valeur contractuelle. Les
              conditions applicables aux prestations sont définies dans les
              Conditions Générales de Vente (CGV).
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
              Droit applicable
            </h2>
            <p className="mb-4">
              Le présent site et son contenu sont soumis au droit israelien.
            </p>
            <p>
              Tout litige relatif à l’utilisation du site ou à son contenu relève de
              la compétence exclusive des tribunaux israeliens, sauf disposition
              légale impérative contraire.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
