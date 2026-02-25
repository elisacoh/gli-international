import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen pb-16 flex items-center justify-center" style={{ backgroundColor: 'rgb(231, 227, 216)' }}>
      <div className="text-center">
        <h1 className="text-4xl font-light text-gray-900 mb-4">Formation non trouvée</h1>
        <p className="text-gray-600 mb-8">
          Désolé, cette formation n'existe pas ou n'est plus disponible.
        </p>
        <Link
          href="/fr/formations"
          className="inline-block bg-gray-900 text-white py-3 px-6 text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition-all duration-300"
        >
          Retour aux formations
        </Link>
      </div>
    </div>
  );
}
